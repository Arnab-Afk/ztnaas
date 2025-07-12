import { Hono } from 'hono';
import { authMiddleware } from './middleware/auth';
import { Env } from '../index';
import { createMagicWANConnection, deleteMagicWANConnection } from './services/magicWan';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', authMiddleware);

app.get('/', async (c) => {
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;

  // Get all organizations administered by the user
  const { results: orgs } = await c.env.DB.prepare(
    'SELECT id FROM organizations WHERE admin_email = ?'
  ).bind(userEmail).all();

  if (orgs.length === 0) {
    return c.json([]); // No organizations found for this user, so no networks
  }

  const orgIds = orgs.map((org: any) => org.id);

  // Fetch networks belonging to these organizations
  // Using IN clause for multiple org_ids
  const placeholders = orgIds.map(() => '?').join(', ');
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM networks WHERE org_id IN (${placeholders})`
  ).bind(...orgIds).all();

  return c.json(results);
});

app.post('/', async (c) => {
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const { id, org_id, name, status, config } = await c.req.json();

  // Verify that the org_id belongs to an organization administered by the user
  const { results: orgResults } = await c.env.DB.prepare(
    'SELECT * FROM organizations WHERE id = ? AND admin_email = ?'
  ).bind(org_id, userEmail).all();

  if (orgResults.length === 0) {
    return c.json({ message: 'Organization not found or unauthorized to create network under this organization' }, 403);
  }

  await c.env.DB.prepare(
    'INSERT INTO networks (id, org_id, name, status, config) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, org_id, name, status, JSON.stringify(config)).run();
  
  // Simulate Magic WAN API call
  await createMagicWANConnection(config, c.env.CLOUDFLARE_ACCOUNT_ID, c.env.CLOUDFLARE_API_TOKEN);

  return c.json({ message: 'Network created' }, 201);
});

app.get('/:id', async (c) => {
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const { id } = c.req.param();

  // Fetch the network and its associated org_id
  const { results: networkResults } = await c.env.DB.prepare(
    'SELECT org_id FROM networks WHERE id = ?'
  ).bind(id).all();

  if (networkResults.length === 0) {
    return c.json({ message: 'Network not found' }, 404);
  }

  const orgId = networkResults[0].org_id;

  // Verify that the user is an admin of the organization that owns this network
  const { results: orgResults } = await c.env.DB.prepare(
    'SELECT * FROM organizations WHERE id = ? AND admin_email = ?'
  ).bind(orgId, userEmail).all();

  if (orgResults.length === 0) {
    return c.json({ message: 'Unauthorized to view this network' }, 403);
  }

  // If authorized, fetch the full network details
  const { results } = await c.env.DB.prepare('SELECT * FROM networks WHERE id = ?').bind(id).all();
  return c.json(results[0]);
});

app.put('/:id', async (c) => {
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const { id } = c.req.param();
  const { org_id, name, status, config } = await c.req.json();

  // Verify that the network_id exists and belongs to an organization administered by the user
  const { results: networkResults } = await c.env.DB.prepare(
    'SELECT org_id FROM networks WHERE id = ?'
  ).bind(id).all();

  if (networkResults.length === 0) {
    return c.json({ message: 'Network not found' }, 404);
  }

  const existingOrgId = networkResults[0].org_id;

  // Ensure the user is an admin of the existing organization for this network
  const { results: orgResults } = await c.env.DB.prepare(
    'SELECT * FROM organizations WHERE id = ? AND admin_email = ?'
  ).bind(existingOrgId, userEmail).all();

  if (orgResults.length === 0) {
    return c.json({ message: 'Unauthorized to update this network' }, 403);
  }

  // If org_id is provided in the update, ensure it matches the existing one
  if (org_id && org_id !== existingOrgId) {
    return c.json({ message: 'Cannot change org_id of an existing network' }, 400);
  }

  await c.env.DB.prepare(
    'UPDATE networks SET org_id = ?, name = ?, status = ?, config = ? WHERE id = ?'
  ).bind(existingOrgId, name, status, JSON.stringify(config), id).run();
  return c.json({ message: 'Network updated' });
});

app.delete('/:id', async (c) => {
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const { id } = c.req.param();

  // Verify that the network_id exists and belongs to an organization administered by the user
  const { results: networkResults } = await c.env.DB.prepare(
    'SELECT org_id FROM networks WHERE id = ?'
  ).bind(id).all();

  if (networkResults.length === 0) {
    return c.json({ message: 'Network not found' }, 404);
  }

  const orgId = networkResults[0].org_id;

  // Ensure the user is an admin of the organization that owns this network
  const { results: orgResults } = await c.env.DB.prepare(
    'SELECT * FROM organizations WHERE id = ? AND admin_email = ?'
  ).bind(orgId, userEmail).all();

  if (orgResults.length === 0) {
    return c.json({ message: 'Unauthorized to delete this network' }, 403);
  }
  
  // Simulate Magic WAN API call
  await deleteMagicWANConnection(id, c.env.CLOUDFLARE_ACCOUNT_ID, c.env.CLOUDFLARE_API_TOKEN);

  await c.env.DB.prepare('DELETE FROM networks WHERE id = ?').bind(id).run();
  return c.json({ message: 'Network deleted' });
});

export default app;
