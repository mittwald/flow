import { generateFlowPackages } from "./generate/flowPackages";
import { generateMigrationGuide } from "./generate/migrationGuide";
import { generateMigrationsModule } from "./generate/migrationsModule";

await generateFlowPackages();
await generateMigrationsModule();
await generateMigrationGuide();
