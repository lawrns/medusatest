import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import { Modules } from '@medusajs/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const REDIS_URL = process.env.REDIS_URL
const REDIS_DB = Number.isFinite(Number(process.env.REDIS_DB)) ? Number(process.env.REDIS_DB) : 0

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/medusa",
    redisUrl: REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:7000,http://localhost:7001",
    }
  },

  modules: {
    // Cache via Redis
    [Modules.CACHE]: {
      resolve: "@medusajs/cache-redis",
      options: REDIS_URL ? { redisUrl: REDIS_URL } : undefined
    },

    // Event bus via Redis
    [Modules.EVENT_BUS]: {
      resolve: "@medusajs/event-bus-redis",
      options: REDIS_URL ? { redisUrl: REDIS_URL } : undefined
    },

    // Workflow engine via Redis
    [Modules.WORKFLOW_ENGINE]: {
      resolve: "@medusajs/workflow-engine-redis",
      options: REDIS_URL ? { redisUrl: REDIS_URL } : undefined
    }
  },
})