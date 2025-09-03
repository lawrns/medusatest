import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const ADMIN_PATH = process.env.ADMIN_PATH || "/app";
const USE_INMEMORY = process.env.USE_INMEMORY === "true"; // set to true to force fallback
const REDIS_URL = process.env.REDIS_URL; // e.g. redis://user:pass@host:6379

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
    ...( !USE_INMEMORY && REDIS_URL ? {
      cacheService: { resolve: "@medusajs/cache-redis", options: { redisUrl: REDIS_URL } },
      eventBusService: { resolve: "@medusajs/event-bus-redis", options: { redisUrl: REDIS_URL } },
      workflowEngineService: { resolve: "@medusajs/workflow-engine-redis", options: { redis: { url: REDIS_URL } } }
    } : {} )
  },
})