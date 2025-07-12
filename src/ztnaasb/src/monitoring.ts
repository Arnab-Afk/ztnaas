import { Hono } from 'hono';
import { authMiddleware } from './middleware/auth';
import { Env } from '../index';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', authMiddleware);

app.get('/', async (c) => {
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const orgId = c.req.query('org_id');

  if (!orgId) {
    return c.json({ message: 'org_id query parameter is required' }, 400);
  }

  // Verify that the org_id belongs to an organization administered by the user
  const { results: orgResults } = await c.env.DB.prepare(
    'SELECT * FROM organizations WHERE id = ? AND admin_email = ?'
  ).bind(orgId, userEmail).all();

  if (orgResults.length === 0) {
    return c.json({ message: 'Organization not found or unauthorized to view monitoring data' }, 403);
  }

  // Simulate monitoring data for the given organization
  const simulatedData = {
    org_id: orgId,
    metrics: {
      latency: Math.floor(Math.random() * 100) + 'ms',
      throughput: Math.floor(Math.random() * 1000) + 'Mbps',
      active_connections: Math.floor(Math.random() * 500),
    },
    security_events: [
      { type: 'DDoS Attack', timestamp: new Date().toISOString(), severity: 'High' },
      { type: 'Port Scan', timestamp: new Date().toISOString(), severity: 'Medium' },
    ],
  };

  return c.json(simulatedData);
});

app.get('/analytics', async (c) => {
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const orgId = c.req.query('org_id');

  if (!orgId) {
    return c.json({ message: 'org_id query parameter is required' }, 400);
  }

  // Verify that the org_id belongs to an organization administered by the user
  const { results: orgResults } = await c.env.DB.prepare(
    'SELECT * FROM organizations WHERE id = ? AND admin_email = ?'
  ).bind(orgId, userEmail).all();

  if (orgResults.length === 0) {
    return c.json({ message: 'Organization not found or unauthorized to view analytics data' }, 403);
  }

  // Simulate analytics data for the given organization
  const simulatedAnalyticsData = {
    org_id: orgId,
    traffic_sources: {
      'Direct': 3000,
      'Referral': 1500,
      'Search': 2000,
    },
    top_blocked_threats: [
      { threat: 'SQL Injection', count: 50 },
      { threat: 'XSS Attack', count: 30 },
    ],
    geo_distribution: {
      'USA': 60,
      'Europe': 25,
      'Asia': 15,
    },
  };

  return c.json(simulatedAnalyticsData);
});

export default app;
