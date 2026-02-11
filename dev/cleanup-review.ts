#!/usr/bin/env node

interface MittwaldService {
  id: string;
  serviceName: string;
  description: string;
}

interface MittwaldIngress {
  id: string;
  hostname: string;
}

const getApiHeaders = () => ({
  "content-type": "application/json",
  "x-access-token": process.env.MITTWALD_API_TOKEN || "",
});

class ReviewCleanup {
  private readonly prNumber: string;
  private readonly projectId: string;

  constructor() {
    this.validateEnvironment();
    this.prNumber = process.env.PR_NUMBER || "";
    this.projectId = process.env.MITTWALD_PROJECT_ID || "";
  }

  private validateEnvironment(): void {
    const required = ["PR_NUMBER", "MITTWALD_PROJECT_ID", "MITTWALD_API_TOKEN"];
    const missing = required.filter((v) => !process.env[v]);

    if (missing.length > 0) {
      console.error(
        `Missing required environment variables: ${missing.join(", ")}`,
      );
      process.exit(1);
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

  async deleteIngress(ingressId: string, hostname: string): Promise<void> {
    console.log(`🗑️  Deleting ingress ${hostname} (${ingressId})...`);

    try {
      const response = await fetch(
        `https://api.mittwald.de/v2/ingresses/${ingressId}`,
        {
          method: "DELETE",
          headers: getApiHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete ingress: ${response.statusText}`);
      }

      console.log(`✅ Ingress ${hostname} deleted successfully`);
    } catch (error) {
      console.error(`❌ Failed to delete ingress ${hostname}:`, error);
      throw error;
    }
  }

  async deleteServices(serviceNames: string[]): Promise<void> {
    console.log(`🗑️  Deleting services: ${serviceNames.join(", ")}...`);

    const serviceUpdates: Record<string, unknown> = {};
    serviceNames.forEach((name) => {
      serviceUpdates[name] = {};
    });

    try {
      const response = await fetch(
        `https://api.mittwald.de/v2/stacks/${this.projectId}`,
        {
          method: "PATCH",
          headers: getApiHeaders(),
          body: JSON.stringify({
            services: serviceUpdates,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `Failed to delete services: ${response.statusText} - ${error}`,
        );
      }

      console.log("✅ Services deleted successfully");
    } catch (error) {
      console.error("❌ Failed to delete services:", error);
      throw error;
    }
  }

  async run(): Promise<void> {
    try {
      console.log(`🚀 Starting cleanup for PR #${this.prNumber}...\n`);

      const [services, ingresses] = await Promise.all([
        this.getServices(),
        this.getIngresses(),
      ]);

      const prIngresses = ingresses.filter((i) =>
        i.hostname.startsWith(`pr-${this.prNumber}.`),
      );

      if (prIngresses.length === 0) {
        console.log("ℹ️  No ingresses found to delete.");
      } else {
        console.log(
          `Found ${prIngresses.length} ingresses to delete: ${prIngresses.map((i) => i.hostname).join(", ")}`,
        );
        for (const ingress of prIngresses) {
          await this.deleteIngress(ingress.id, ingress.hostname);
        }
      }

      const prServices = services.filter((s) =>
        s.serviceName.includes(`pr-${this.prNumber}`),
      );

      if (prServices.length === 0) {
        console.log("ℹ️  No services found to delete.");
      } else {
        console.log(
          `Found ${prServices.length} services to delete: ${prServices.map((s) => s.serviceName).join(", ")}`,
        );
        await this.deleteServices(prServices.map((s) => s.serviceName));
      }

      console.log("\n✨ Cleanup completed successfully!");
    } catch (error) {
      console.error("\n❌ Cleanup failed:", error);
      process.exit(1);
    }
  }
}

const cleaner = new ReviewCleanup();
cleaner.run().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
