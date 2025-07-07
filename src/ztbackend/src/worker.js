import { Router } from 'itty-router';
import { handleOrganizations } from './handlers/organizations';
import { handleNetworks } from './handlers/networks';
import { handlePolicies } from './handlers/policies';
import { corsHeaders } from './utils/headers';

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// Create a new router
const router = Router();

// CORS preflight handler
router.options('*', async (request) => {
  return new Response(null, { headers: corsHeaders });
});

// Organization routes
router.get('/api/organizations', handleOrganizations.list);
router.post('/api/organizations', handleOrganizations.create);
router.get('/api/organizations/:id', handleOrganizations.get);
router.put('/api/organizations/:id', handleOrganizations.update);
router.delete('/api/organizations/:id', handleOrganizations.remove);

// Network routes
router.get('/api/networks', handleNetworks.list);
router.post('/api/networks', handleNetworks.create);
router.get('/api/networks/:id', handleNetworks.get);
router.put('/api/networks/:id', handleNetworks.update);
router.delete('/api/networks/:id', handleNetworks.remove);

// Policy routes
router.get('/api/policies', handlePolicies.list);
router.post('/api/policies', handlePolicies.create);
router.get('/api/policies/:id', handlePolicies.get);
router.put('/api/policies/:id', handlePolicies.update);
router.delete('/api/policies/:id', handlePolicies.remove);

// 404 handler
router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
  async fetch(request, env, ctx) {
    try {
      // Create a timeout for the entire request to prevent hanging
      const timeout = new Promise((_, reject) => {
        ctx.waitUntil(new Promise((resolve) => {
          setTimeout(() => {
            reject(new Error('Request timed out'));
            resolve();
          }, 8000); // 8 second global timeout (slightly longer than individual DB timeouts)
        }));
      });
      
      // Race the router against the timeout
      return await Promise.race([
        router.handle(request, env, ctx),
        timeout
      ]);
    } catch (e) {
      console.error('Worker error:', e);
      return new Response(`Server Error: ${e.message}`, { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};