import { Hono } from 'hono';
import { authMiddleware } from './middleware/auth';
import { Env } from '../index';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', authMiddleware);

app.get('/', async (c) => {
  // Ensure the user is authenticated and their email is available from the token
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;

  // Only return organizations where the authenticated user is the admin
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM organizations WHERE admin_email = ?'
  ).bind(userEmail).all();

  return c.json(results);
});

app.post('/', async (c) => {
  // Ensure the user is authenticated and their email is available
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const { id, name, domain } = await c.req.json();

  // When creating an organization, automatically assign the authenticated user as the admin
  await c.env.DB.prepare(
    'INSERT INTO organizations (id, name, domain, admin_email) VALUES (?, ?, ?, ?)'
  ).bind(id, name, domain, userEmail).run();
  return c.json({ message: 'Organization created' }, 201);
});

app.get('/:id', async (c) => {
  // Ensure the user is authenticated and their email is available
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const { id } = c.req.param();

  // Only return the organization if the authenticated user is its admin
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM organizations WHERE id = ? AND admin_email = ?'
  ).bind(id, userEmail).all();

  if (results.length === 0) {
    return c.json({ message: 'Organization not found or unauthorized' }, 404);
  }
  return c.json(results[0]);
});

app.put('/:id', async (c) => {
  // Ensure the user is authenticated and their email is available
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const { id } = c.req.param();
  const { name, domain } = await c.req.json();

  // Only allow update if the authenticated user is the admin of this organization
  const updateResult = await c.env.DB.prepare(
    'UPDATE organizations SET name = ?, domain = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND admin_email = ?'
  ).bind(name, domain, id, userEmail).run();

  if (updateResult.changes === 0) {
    return c.json({ message: 'Organization not found or unauthorized to update' }, 404);
  }

  return c.json({ message: 'Organization updated' });
});

app.delete('/:id', async (c) => {
  // Ensure the user is authenticated and their email is available
  if (!c.req.user || !c.req.user.email) {
    return c.json({ message: 'Unauthorized: User email not found in token' }, 401);
  }

  const userEmail = c.req.user.email;
  const { id } = c.req.param();

  // Only allow deletion if the authenticated user is the admin of this organization
  const deleteResult = await c.env.DB.prepare(
    'DELETE FROM organizations WHERE id = ? AND admin_email = ?'
  ).bind(id, userEmail).run();

  if (deleteResult.changes === 0) {
    return c.json({ message: 'Organization not found or unauthorized to delete' }, 404);
  }

  return c.json({ message: 'Organization deleted' });
});

export default app;