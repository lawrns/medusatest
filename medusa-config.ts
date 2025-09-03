import { loadEnv, defineConfig } from '@medusajs/framework/utils'

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
    cacheService: {
      resolve: "@medusajs/cache-redis",
      options: REDIS_URL ? { redis: { url: REDIS_URL, db: REDIS_DB } } : undefined
    },
    eventBusService: {
      resolve: "@medusajs/event-bus-redis",
      options: REDIS_URL ? { redis: { url: REDIS_URL, db: REDIS_DB } } : undefined
    },
    workflowEngineService: {
      resolve: "@medusajs/workflow-engine-redis",
      options: REDIS_URL ? { redis: { url: REDIS_URL, db: REDIS_DB } } : undefined
    }
  },
})