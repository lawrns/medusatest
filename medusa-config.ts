// medusa-config.ts
import { defineMedusaConfig, Modules } from "@medusajs/utils"

const REDIS_URL = process.env.REDIS_URL
// Default to DB 0 if REDIS_DB is unset or invalid
const REDIS_DB =
  Number.isFinite(Number(process.env.REDIS_DB)) ? Number(process.env.REDIS_DB) : 0

export default defineMedusaConfig({
  projectConfig: {
    database_url: process.env.DATABASE_URL!,   // required
    jwt_secret: process.env.JWT_SECRET!,       // required
    cookie_secret: process.env.COOKIE_SECRET!, // required
    redis_url: REDIS_URL,                      // optional but kept for completeness
  },

  // Admin UI served by the backend at /app
  admin: {
    serve: true,
    path: "/app",
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    // harmless default when running in a single service
    backend: process.env.MEDUSA_BACKEND_URL || `http://localhost:${process.env.PORT || 9000}`,
  },

  modules: {
    // Cache via Redis
    [Modules.CACHE]: {
      resolve: "@medusajs/cache-redis",
      options: REDIS_URL ? { redis: { url: REDIS_URL, db: REDIS_DB } } : undefined,
    },

    // Event bus via Redis
    [Modules.EVENT_BUS]: {
      resolve: "@medusajs/event-bus-redis",
      options: REDIS_URL ? { redis: { url: REDIS_URL, db: REDIS_DB } } : undefined,
    },

    // Workflow engine via Redis
    [Modules.WORKFLOW_ENGINE]: {
      resolve: "@medusajs/workflow-engine-redis",
      options: REDIS_URL ? { redis: { url: REDIS_URL, db: REDIS_DB } } : undefined,
    },
  },
})