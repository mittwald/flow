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
  private readonly prNumber: string;
  private readonly projectId: string;
  private readonly images: DockerImage[];

  constructor() {
    this.validateEnvironment();
    this.prNumber = process.env.PR_NUMBER || "";
    this.projectId = process.env.MITTWALD_PROJECT_ID || "";
    this.images = this.parseImages();
  }

  private validateEnvironment(): void {
    const required = [
      "PR_NUMBER",
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
  }

  private parseImages(): DockerImage[] {
    const docsTag = process.env.DOCS_IMAGE_TAG || "";
    const storybookTag = process.env.STORYBOOK_IMAGE_TAG || "";

    const images: DockerImage[] = [];

    if (docsTag && !docsTag.includes("sha-")) {
      images.push({
        name: docsTag,
        tag: docsTag.split(":")[1] || "latest",
        imageType: "docs",
      });
    }

    if (storybookTag && !storybookTag.includes("sha-")) {
      images.push({
        name: storybookTag,
        tag: storybookTag.split(":")[1] || "latest",
        imageType: "storybook",
      });
    }

    return images;
  }

  private getServiceName(imageType: "docs" | "storybook"): string {
    return `${imageType}pr-${this.prNumber}`;
  }

  private getHostname(imageType: "docs" | "storybook"): string {
    return `pr-${this.prNumber}.${imageType}.review.flow-components.de`;
  }

  private getDescription(imageType: "docs" | "storybook"): string {
    return `${imageType.toUpperCase()}/PR-${this.prNumber}`;
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
    let containerId = existingService?.id;

    if (existingService) {
      console.log(`   Service ${serviceName} already exists, updating...`);

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

    if (!existingIngress) {
      console.log(`   Ingress for ${hostname} does not exist, creating...`);
      if (!containerId) {
        throw new Error(`Container ID not found for ${serviceName}`);
      }
      await this.createIngress(hostname, containerId);
    } else {
      console.log(`   Ingress for ${hostname} already exists`);
    }

    return hostname;
  }

  async postGitHubComment(urls: Record<string, string>): Promise<void> {
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
      await fetch(
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
      console.log("✅ Posted comment to GitHub PR");
    } catch (error) {
      console.warn("⚠️  Failed to post GitHub comment:", error);
    }
  }

  async deploy(): Promise<void> {
    try {
      console.log("🚀 Starting preview deployment process...\n");

      const [existingServices, existingIngresses] = await Promise.all([
        this.getServices(),
        this.getIngresses(),
      ]);

      const urls: Record<string, string> = {};
      for (const image of this.images) {
        urls[image.imageType] = await this.deployImage(
          image,
          existingServices,
          existingIngresses,
        );
      }

      await this.postGitHubComment(urls);

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
