import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import { Modules } from '@medusajs/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/medusa",
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },

  modules: {
    [Modules.CACHE]: {
      resolve: "@medusajs/cache-redis",
      options: process.env.REDIS_URL ? { redisUrl: process.env.REDIS_URL } : undefined
    },
    [Modules.EVENT_BUS]: {
      resolve: "@medusajs/event-bus-redis",
      options: process.env.REDIS_URL ? { redisUrl: process.env.REDIS_URL } : undefined
    },
    [Modules.WORKFLOW_ENGINE]: {
      resolve: "@medusajs/workflow-engine-redis",
      options: process.env.REDIS_URL ? { redisUrl: process.env.REDIS_URL } : undefined
    }
  },
})
