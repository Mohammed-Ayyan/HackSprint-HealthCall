import { prisma } from "./db/client";
import { config } from "./config/env";
import * as types from "./types";

export { prisma, config, types };

/**
 * Health check to verify database connectivity.
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
}

/**
 * Application Bootstrap / Service Entry
 */
async function main() {
  console.log("==================================================");
  console.log("CareOps AI - Healthcare Workflow Engine Backend");
  console.log(`Environment: ${config.env}`);
  console.log("==================================================");

  const isHealthy = await checkDatabaseHealth();
  if (isHealthy) {
    console.log(" Database connection verified successfully.");
  } else {
    console.warn("⚠️  Could not connect to database. Ensure PostgreSQL is running.");
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error("Fatal error during bootstrap:", err);
    process.exit(1);
  });
}
