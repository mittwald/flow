#!/usr/bin/env node

interface DockerImage {
  name: string;
  tag: string;
  imageType: "docs" | "storybook";
}

interface MittwaldService {
  id: string;
  serviceName: string;
  description: string;
  status: string;
  deployedState: {
    image: string;
  };
  requiresRecreate: boolean;
}

interface MittwaldIngress {
  id: string;
  hostname: string;
  paths: {
    path: string;
    target: {
      container: {
        id: string;
        portProtocol: string;
      };
    };
  }[];
}

const getApiHeaders = () => ({
  "content-type": "application/json",
  "x-access-token": process.env.MITTWALD_API_TOKEN || "",
});

class ReviewDeployer {
  private readonly previewSlug: string;
  private readonly prNumber: string | undefined;
  private readonly projectId: string;
  private readonly images: DockerImage[];

  constructor() {
    this.validateEnvironment();
    this.previewSlug = process.env.PREVIEW_SLUG || "";
    // A pull-request preview's slug carries its number (`pr-3120`), and that is
    // the only kind of preview with a PR to guard against and comment on. The
    // `next` line has none, so both steps drop out instead of being configured
    // away — the slug stays the single source for what this deployment is.
    this.prNumber = /^pr-(\d+)$/.exec(this.previewSlug)?.[1];
    this.projectId = process.env.MITTWALD_PROJECT_ID || "";
    this.images = this.parseImages();
  }

  private validateEnvironment(): void {
    const required = [
      "PREVIEW_SLUG",
      "MITTWALD_PROJECT_ID",
      "MITTWALD_API_TOKEN",
      "DOCS_IMAGE_TAG",
      "STORYBOOK_IMAGE_TAG",
    ];
    const missing = required.filter((v) => !process.env[v]);

    if (missing.length > 0) {
      console.error(
        `Missing required environment variables: ${missing.join(", ")}`,
      );
      process.exit(1);
    }

    // The slug is interpolated into service names and into a hostname's
    // leftmost label, so it has to be a valid one: lowercase alphanumerics and
    // inner dashes, nothing else.
    const previewSlug = process.env.PREVIEW_SLUG || "";
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(previewSlug)) {
      console.error(
        `Invalid PREVIEW_SLUG (expected a lowercase DNS label such as \`pr-1234\` or \`next\`): ${previewSlug}`,
      );
      process.exit(1);
    }
  }

  private parseImages(): DockerImage[] {
    // The workflow passes one exact ref per app. The value used to come from
    // docker/metadata-action's multi-line `tags` output, so stay tolerant of
    // several lines: prefer the one tagged with this preview's slug.
    const parseImageTag = (rawTag: string): string | null => {
      const lines = rawTag
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      return (
        lines.find((line) => line.endsWith(`:${this.previewSlug}`)) ??
        lines[0] ??
        null
      );
    };

    const tagOf = (image: string): string =>
      image.slice(image.lastIndexOf(":") + 1) || "latest";

    const docsTag = parseImageTag(process.env.DOCS_IMAGE_TAG || "");
    const storybookTag = parseImageTag(process.env.STORYBOOK_IMAGE_TAG || "");

    const images: DockerImage[] = [];

    if (docsTag) {
      images.push({
        name: docsTag,
        tag: tagOf(docsTag),
        imageType: "docs",
      });
    }

    if (storybookTag) {
      images.push({
        name: storybookTag,
        tag: tagOf(storybookTag),
        imageType: "storybook",
      });
    }

    return images;
  }

  // `cleanup-review.ts` deletes a pull-request preview by these two shapes —
  // keep both in sync with it.
  private getServiceName(imageType: "docs" | "storybook"): string {
    return `${imageType}${this.previewSlug}`;
  }

  private getHostname(imageType: "docs" | "storybook"): string {
    return `${this.previewSlug}.${imageType}.review.flow-components.de`;
  }

  private getDescription(imageType: "docs" | "storybook"): string {
    return `${imageType.toUpperCase()}/${this.previewSlug.toUpperCase()}`;
  }

  private getTlsCertificateId(
    imageType: "docs" | "storybook",
  ): string | undefined {
    return imageType === "docs"
      ? process.env.MITTWALD_TLS_CERTIFICATE_ID_DOCS
      : process.env.MITTWALD_TLS_CERTIFICATE_ID_STORYBOOK;
  }

  // Guard against a race with the cleanup workflow: the build+deploy takes
  // several minutes, but `cleanup-previews.yml` fires the moment a PR closes.
  // A PR merged before its deploy finishes gets cleaned up first (finds
  // nothing), then this deploy would create preview resources the cleanup can
  // never reach again — orphaning them forever. So bail out if the PR is no
  // longer open. Fail open: only skip when we can positively confirm it's
  // closed, otherwise keep deploying.
  async isPullRequestClosed(): Promise<boolean> {
    if (!this.prNumber) {
      return false;
    }

    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPOSITORY;
    if (!token || !repo) {
      console.warn(
        "⚠️  GITHUB_TOKEN or GITHUB_REPOSITORY not set — skipping the PR-state guard; proceeding with deployment.",
      );
      return false;
    }

    const [owner, repoName] = repo.split("/");
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/pulls/${this.prNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );

      if (!response.ok) {
        console.warn(
          `⚠️  Could not fetch PR #${this.prNumber} state (${response.status} ${response.statusText}); proceeding with deployment.`,
        );
        return false;
      }

      const pr = (await response.json()) as { state: string };
      return pr.state !== "open";
    } catch (error) {
      console.warn(
        `⚠️  Failed to check PR #${this.prNumber} state; proceeding with deployment.`,
        error,
      );
      return false;
    }
  }

  async getServices(): Promise<MittwaldService[]> {
    console.log("📋 Fetching existing services...");

    try {
      const response = await fetch(
        `https://api.mittwald.de/v2/projects/${this.projectId}/services`,
        {
          method: "GET",
          headers: getApiHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }

      return (await response.json()) as MittwaldService[];
    } catch (error) {
      console.error("❌ Failed to fetch services:", error);
      throw error;
    }
  }

  async getIngresses(): Promise<MittwaldIngress[]> {
    console.log("🔗 Fetching existing ingresses...");

    try {
      const response = await fetch(
        `https://api.mittwald.de/v2/ingresses?projectId=${this.projectId}`,
        {
          method: "GET",
          headers: getApiHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ingresses: ${response.statusText}`);
      }

      return (await response.json()) as MittwaldIngress[];
    } catch (error) {
      console.error("❌ Failed to fetch ingresses:", error);
      throw error;
    }
  }

  async updateServices(serviceUpdates: Record<string, unknown>): Promise<void> {
    console.log("🚀 Updating services...");

    try {
      const response = await fetch(
        `https://api.mittwald.de/v2/stacks/${this.projectId}`,
        {
          method: "PATCH",
          headers: getApiHeaders(),
          body: JSON.stringify({
            services: serviceUpdates,
            volumes: {},
          }),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `Failed to update services: ${response.statusText} - ${error}`,
        );
      }

      console.log("✅ Services updated successfully");
    } catch (error) {
      console.error("❌ Failed to update services:", error);
      throw error;
    }
  }

  async pullImage(serviceId: string): Promise<void> {
    console.log("🔄 Pulling latest image...");

    try {
      const response = await fetch(
        `https://api.mittwald.de/v2/stacks/${this.projectId}/services/${serviceId}/actions/pull`,
        {
          method: "POST",
          headers: getApiHeaders(),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `Failed to pull image: ${response.statusText} - ${error}`,
        );
      }

      console.log("✅ Image pull triggered successfully");
    } catch (error) {
      console.error("❌ Failed to pull image:", error);
      throw error;
    }
  }

  async createIngress(
    hostname: string,
    containerId: string,
  ): Promise<MittwaldIngress> {
    console.log(`🌐 Creating ingress for ${hostname}...`);

    try {
      const response = await fetch("https://api.mittwald.de/v2/ingresses", {
        method: "POST",
        headers: getApiHeaders(),
        body: JSON.stringify({
          projectId: this.projectId,
          hostname,
          paths: [
            {
              path: "/",
              target: {
                container: {
                  id: containerId,
                  portProtocol: "80/tcp",
                },
              },
            },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `Failed to create ingress: ${response.statusText} - ${error}`,
        );
      }

      const ingress = (await response.json()) as MittwaldIngress;
      console.log(`✅ Ingress created for ${hostname}`);
      return ingress;
    } catch (error) {
      console.error("❌ Failed to create ingress:", error);
      throw error;
    }
  }

  async connectTlsCertificate(
    ingressId: string,
    imageType: "docs" | "storybook",
  ): Promise<void> {
    const certificateId = this.getTlsCertificateId(imageType);

    // Loudly, because this used to be a silent `return`: the workflow read the
    // IDs from `vars.*` while they are stored as secrets, so every preview fell
    // back to ACME without a trace in the log — until enough PRs had piled up to
    // hit the ACME rate limit and the hosts started serving the ingress
    // controller's placeholder certificate.
    if (!certificateId) {
      console.warn(
        `⚠️  No TLS certificate ID configured for ${imageType} — ingress ${ingressId} falls back to ACME`,
      );
      return;
    }

    console.log(`🔒 Connecting TLS certificate to ingress ${ingressId}...`);

    try {
      const response = await fetch(
        `https://api.mittwald.de/v2/ingresses/${ingressId}/tls`,
        {
          method: "PATCH",
          headers: getApiHeaders(),
          body: JSON.stringify({
            certificateId,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        console.warn(
          `⚠️  Failed to connect TLS certificate: ${response.statusText} - ${error}`,
        );
        return;
      }

      console.log("✅ TLS certificate connected successfully");
    } catch (error) {
      console.warn("⚠️  Failed to connect TLS certificate:", error);
    }
  }

  async deployImage(
    image: DockerImage,
    services: MittwaldService[],
    ingresses: MittwaldIngress[],
  ): Promise<string> {
    const serviceName = this.getServiceName(image.imageType);
    const hostname = this.getHostname(image.imageType);
    const description = this.getDescription(image.imageType);

    console.log(`\n📦 Deploying ${image.imageType} image...`);

    const existingService = services.find((s) => s.serviceName === serviceName);
    let containerId: string;

    if (existingService) {
      console.log(
        `   Service ${serviceName} already exists, pulling new image...`,
      );
      await this.pullImage(existingService.id);
      containerId = existingService.id;
    } else {
      console.log(`   Service ${serviceName} does not exist, creating...`);

      const serviceUpdates: Record<string, unknown> = {};
      serviceUpdates[serviceName] = {
        description,
        image: image.name,
        entrypoint: [],
        command: [],
        volumes: [],
        ports: ["80/tcp"],
        envs: {},
      };

      await this.updateServices(serviceUpdates);

      const updatedServices = await this.getServices();
      const newService = updatedServices.find(
        (s) => s.serviceName === serviceName,
      );
      if (!newService) {
        throw new Error(`Failed to create service ${serviceName}`);
      }
      containerId = newService.id;
    }

    const existingIngress = ingresses.find((i) => i.hostname === hostname);
    let ingressId: string;

    if (!existingIngress) {
      console.log(`   Ingress for ${hostname} does not exist, creating...`);
      if (!containerId) {
        throw new Error(`Container ID not found for ${serviceName}`);
      }
      const ingress = await this.createIngress(hostname, containerId);
      ingressId = ingress.id;
    } else {
      console.log(`   Ingress for ${hostname} already exists`);
      ingressId = existingIngress.id;
    }

    await this.connectTlsCertificate(ingressId, image.imageType);

    return hostname;
  }

  async postGitHubComment(urls: Record<string, string>): Promise<void> {
    if (!this.prNumber) {
      console.log(
        `ℹ️  Preview \`${this.previewSlug}\` belongs to no pull request — nothing to comment on.`,
      );
      return;
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn("⚠️  GITHUB_TOKEN not set, skipping GitHub comment posting");
      return;
    }

    const repo = process.env.GITHUB_REPOSITORY || "unknown";
    const [owner, repoName] = repo.split("/");

    const comment = `## 🚀 Preview Deployment

Preview environments are ready:

| Type | URL |
|------|-----|
${Object.entries(urls)
  .map(([type, url]) => `| ${type} | [${url}](https://${url}) |`)
  .join("\n")}

Images:
${this.images.map((img) => `- ${img.imageType}: \`${img.name}\``).join("\n")}
`;

    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/issues/${this.prNumber}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            body: comment,
          }),
        },
      );
      if (!response.ok) {
        console.warn(
          `⚠️  Failed to post GitHub comment: ${response.status} ${response.statusText}`,
        );
        return;
      }
      console.log("✅ Posted comment to GitHub PR");
    } catch (error) {
      console.warn("⚠️  Failed to post GitHub comment:", error);
    }
  }

  async deploy(): Promise<void> {
    try {
      console.log(
        `🚀 Starting preview deployment for \`${this.previewSlug}\`...\n`,
      );

      if (await this.isPullRequestClosed()) {
        console.log(
          `⏭️  PR #${this.prNumber} is already closed/merged — skipping preview deployment to avoid orphaned resources the cleanup can no longer reach.`,
        );
        return;
      }

      console.log(`📦 Parsed images (${this.images.length}):`);
      this.images.forEach((img) => {
        console.log(`   - ${img.imageType}: ${img.name}`);
      });

      if (this.images.length === 0) {
        console.warn(
          "⚠️  No images parsed from environment variables. Check DOCS_IMAGE_TAG and STORYBOOK_IMAGE_TAG.",
        );
        process.exit(1);
      }

      const [existingServices, existingIngresses] = await Promise.all([
        this.getServices(),
        this.getIngresses(),
      ]);

      const isFirstDeployment = !this.images.some((image) =>
        existingServices.some(
          (s) => s.serviceName === this.getServiceName(image.imageType),
        ),
      );

      const urls: Record<string, string> = {};
      for (const image of this.images) {
        urls[image.imageType] = await this.deployImage(
          image,
          existingServices,
          existingIngresses,
        );
      }

      if (isFirstDeployment) {
        await this.postGitHubComment(urls);
      }

      console.log("\n✨ Deployment completed successfully!");
      console.log("\nPreview URLs:");
      Object.entries(urls).forEach(([type, url]) => {
        console.log(`  ${type}: https://${url}`);
      });
    } catch (error) {
      console.error("\n❌ Deployment failed:", error);
      process.exit(1);
    }
  }
}

const deployer = new ReviewDeployer();
deployer.deploy().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
