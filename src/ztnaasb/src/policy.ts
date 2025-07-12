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

  // Get all organizations administered by the user
  const { results: orgs } = await c.env.DB.prepare(
    'SELECT id FROM organizations WHERE admin_email = ?'
  ).bind(userEmail).all();

  if (orgs.length === 0) {
    return c.json([]); // No organizations found for this user, so no policies
  }

  const orgIds = orgs.map((org: any) => org.id);

  // Get all networks belonging to these organizations
  const placeholdersOrg = orgIds.map(() => '?').join(', ');
  const { results: networks } = await c.env.DB.prepare(
    `SELECT id FROM networks WHERE org_id IN (${placeholdersOrg})`
  ).bind(...orgIds).all();

  if (networks.length === 0) {
    return c.json([]); // No networks found for these organizations, so no policies
  }

  const networkIds = networks.map((network: any) => network.id);

  // Fetch policies belonging to these networks
  const placeholdersNetwork = networkIds.map(() => '?').join(', ');
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM policies WHERE network_id IN (${placeholdersNetwork})`
  ).bind(...networkIds).all();

  return c.json(results);
});

app.post('/', async (c) => {
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const { id, network_id, name, type, config, priority, enabled } = await c.req.json();

  // Verify that the network_id belongs to a network within an organization administered by the user
  const { results: networkResults } = await c.env.DB.prepare(
    'SELECT org_id FROM networks WHERE id = ?'
  ).bind(network_id).all();

  if (networkResults.length === 0) {
    return c.json({ message: 'Network not found' }, 404);
  }

  const orgId = networkResults[0].org_id;

  const { results: orgResults } = await c.env.DB.prepare(
    'SELECT * FROM organizations WHERE id = ? AND admin_email = ?'
  ).bind(orgId, userEmail).all();

  if (orgResults.length === 0) {
    return c.json({ message: 'Unauthorized to create policy under this network' }, 403);
  }

  await c.env.DB.prepare(
    'INSERT INTO policies (id, network_id, name, type, config, priority, enabled) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, network_id, name, type, JSON.stringify(config), priority, enabled).run();

  // Store policy config in KV for real-time distribution
  await c.env.POLICIES.put(id, JSON.stringify(config));

  return c.json({ message: 'Policy created' }, 201);
});

app.get('/:id', async (c) => {
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const { id } = c.req.param();

  // Fetch the policy and its associated network_id
  const { results: policyResults } = await c.env.DB.prepare(
    'SELECT network_id FROM policies WHERE id = ?'
  ).bind(id).all();

  if (policyResults.length === 0) {
    return c.json({ message: 'Policy not found' }, 404);
  }

  const networkId = policyResults[0].network_id;

  // Fetch the network and its associated org_id
  const { results: networkResults } = await c.env.DB.prepare(
    'SELECT org_id FROM networks WHERE id = ?'
  ).bind(networkId).all();

  if (networkResults.length === 0) {
    return c.json({ message: 'Network not found for this policy' }, 404);
  }

  const orgId = networkResults[0].org_id;

  // Verify that the user is an admin of the organization that owns this network
  const { results: orgResults } = await c.env.DB.prepare(
    'SELECT * FROM organizations WHERE id = ? AND admin_email = ?'
  ).bind(orgId, userEmail).all();

  if (orgResults.length === 0) {
    return c.json({ message: 'Unauthorized to view this policy' }, 403);
  }

  // If authorized, fetch the full policy details
  const { results } = await c.env.DB.prepare('SELECT * FROM policies WHERE id = ?').bind(id).all();
  return c.json(results[0]);
});

app.put('/:id', async (c) => {
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const { id } = c.req.param();
  const { network_id, name, type, config, priority, enabled } = await c.req.json();

  // Fetch the policy and its associated network_id
  const { results: policyResults } = await c.env.DB.prepare(
    'SELECT network_id FROM policies WHERE id = ?'
  ).bind(id).all();

  if (policyResults.length === 0) {
    return c.json({ message: 'Policy not found' }, 404);
  }

  const existingNetworkId = policyResults[0].network_id;

  // If network_id is provided in the update, ensure it matches the existing one
  if (network_id && network_id !== existingNetworkId) {
    return c.json({ message: 'Cannot change network_id of an existing policy' }, 400);
  }

  // Fetch the network and its associated org_id
  const { results: networkResults } = await c.env.DB.prepare(
    'SELECT org_id FROM networks WHERE id = ?'
  ).bind(existingNetworkId).all();

  if (networkResults.length === 0) {
    return c.json({ message: 'Network not found for this policy' }, 404);
  }

  const orgId = networkResults[0].org_id;

  // Verify that the user is an admin of the organization that owns this network
  const { results: orgResults } = await c.env.DB.prepare(
    'SELECT * FROM organizations WHERE id = ? AND admin_email = ?'
  ).bind(orgId, userEmail).all();

  if (orgResults.length === 0) {
    return c.json({ message: 'Unauthorized to update this policy' }, 403);
  }

  await c.env.DB.prepare(
    'UPDATE policies SET network_id = ?, name = ?, type = ?, config = ?, priority = ?, enabled = ? WHERE id = ?'
  ).bind(existingNetworkId, name, type, JSON.stringify(config), priority, enabled, id).run();

  // Update policy config in KV for real-time distribution
  await c.env.POLICIES.put(id, JSON.stringify(config));

  return c.json({ message: 'Policy updated' });
});

app.delete('/:id', async (c) => {
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const { id } = c.req.param();

  // Fetch the policy and its associated network_id
  const { results: policyResults } = await c.env.DB.prepare(
    'SELECT network_id FROM policies WHERE id = ?'
  ).bind(id).all();

  if (policyResults.length === 0) {
    return c.json({ message: 'Policy not found' }, 404);
  }

  const networkId = policyResults[0].network_id;

  // Fetch the network and its associated org_id
  const { results: networkResults } = await c.env.DB.prepare(
    'SELECT org_id FROM networks WHERE id = ?'
  ).bind(networkId).all();

  if (networkResults.length === 0) {
    return c.json({ message: 'Network not found for this policy' }, 404);
  }

  const orgId = networkResults[0].org_id;

  // Verify that the user is an admin of the organization that owns this network
  const { results: orgResults } = await c.env.DB.prepare(
    'SELECT * FROM organizations WHERE id = ? AND admin_email = ?'
  ).bind(orgId, userEmail).all();

  if (orgResults.length === 0) {
    return c.json({ message: 'Unauthorized to delete this policy' }, 403);
  }

  await c.env.DB.prepare('DELETE FROM policies WHERE id = ?').bind(id).run();

  // Delete policy from KV
  await c.env.POLICIES.delete(id);

  return c.json({ message: 'Policy deleted' });
});

export default app;
