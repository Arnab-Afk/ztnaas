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
    return c.json({ message: 'Organization not found or unauthorized to view billing info' }, 403);
  }

  // Simulate billing data for the given organization
  const simulatedBillingData = {
    org_id: orgId,
    current_bill: {
      amount: Math.floor(Math.random() * 1000) + 50,
      currency: 'USD',
      due_date: '2025-08-01',
    },
    usage_details: [
      { service: 'Magic WAN', usage: '100GB', cost: '50.00' },
      { service: 'Zero Trust Access', usage: '50 users', cost: '25.00' },
    ],
    payment_history: [
      { date: '2025-06-01', amount: '75.00', status: 'Paid' },
    ],
  };

  return c.json(simulatedBillingData);
});

app.get('/account', async (c) => {
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
    return c.json({ message: 'Organization not found or unauthorized to view account info' }, 403);
  }

  // Simulate account data for the given organization
  const simulatedAccountData = {
    org_id: orgId,
    account_name: `Organization ${orgId} Account`,
    contact_email: userEmail,
    plan: 'Professional',
    members: Math.floor(Math.random() * 50) + 5,
  };

  return c.json(simulatedAccountData);
});

export default app;
