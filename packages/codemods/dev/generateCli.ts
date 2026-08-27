import { generateMigrationGuide } from "./generate/migrationGuide";
import { generateMigrationsModule } from "./generate/migrationsModule";

await generateMigrationsModule();
await generateMigrationGuide();
