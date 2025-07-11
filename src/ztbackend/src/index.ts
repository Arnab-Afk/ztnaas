// src/index.ts
import { Router } from 'itty-router';
import { authRoutes } from './api/auth/routes';
import { networkRoutes } from './api/networks/routes';
import { policyRoutes } from './api/policies/routes';
import { monitoringRoutes } from './api/monitoring/routes';
import { authMiddleware } from './middleware/auth';
import { corsMiddleware } from './middleware/cors';
import { NetworkManager } from './services/network/NetworkManager';
import { PolicyEngine } from './services/policy/PolicyEngine';

const router = Router();

// CORS middleware
router.use(corsMiddleware);

// Health check
router.get('/health', () => new Response('OK'));

// Auth routes (no auth required)
router.all('/api/auth/*', authRoutes.handle);

// Protected routes
router.all('/api/*', authMiddleware);
router.all('/api/networks/*', networkRoutes.handle);
router.all('/api/policies/*', policyRoutes.handle);
router.all('/api/monitoring/*', monitoringRoutes.handle);

router.all('*', async () => new Response('Not Found', { status: 404 }));

export default {
  fetch(request: Request, env: any, ctx: any) {
    return router.handle(request, env, ctx);
  },
};

// Export Durable Objects
export { NetworkManager, PolicyEngine };
