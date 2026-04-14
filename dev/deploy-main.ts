#!/usr/bin/env node

interface MittwaldService {
  id: string;
  serviceName: string;
}

const getApiHeaders = () => ({
  "content-type": "application/json",
  "x-access-token": process.env.MITTWALD_API_TOKEN || "",
});

const serviceNames = {
  docs: "docs-main",
  storybook: "storybook-main",
};

async function getServices(projectId: string): Promise<MittwaldService[]> {
  const response = await fetch(
    `https://api.mittwald.de/v2/projects/${projectId}/services`,
    {
      method: "GET",
      headers: getApiHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.statusText}`);
  }

  return (await response.json()) as MittwaldService[];
}

async function pullImage(projectId: string, serviceId: string): Promise<void> {
  const response = await fetch(
    `https://api.mittwald.de/v2/stacks/${projectId}/services/${serviceId}/actions/pull`,
    {
      method: "POST",
      headers: getApiHeaders(),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to pull image: ${response.statusText} - ${error}`);
  }
}

async function main(): Promise<void> {
  const required = ["MITTWALD_PROJECT_ID", "MITTWALD_API_TOKEN"];
  const missing = required.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
    process.exit(1);
  }

  const projectId = process.env.MITTWALD_PROJECT_ID!;

  console.log("📋 Fetching existing services...");
  const services = await getServices(projectId);

  for (const [type, serviceName] of Object.entries(serviceNames)) {
    const service = services.find((s) => s.serviceName === serviceName);

    if (!service) {
      throw new Error(
        `Service "${serviceName}" not found. Make sure it exists in the mittwald project.`,
      );
    }

    console.log(`🔄 Pulling latest image for ${type} (${serviceName})...`);
    await pullImage(projectId, service.id);
    console.log(`✅ Image pull triggered for ${type}`);
  }

  console.log("\n✨ Deployment completed successfully!");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
