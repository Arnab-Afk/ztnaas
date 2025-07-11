import { Hono } from 'hono';
import { authMiddleware } from './middleware/auth';
import { Env } from '../index';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', authMiddleware);

app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM organizations').all();
  return c.json(results);
});

app.post('/', async (c) => {
  const { id, name, domain, admin_email } = await c.req.json();
  await c.env.DB.prepare(
    'INSERT INTO organizations (id, name, domain, admin_email) VALUES (?, ?, ?, ?)'
  ).bind(id, name, domain, admin_email).run();
  return c.json({ message: 'Organization created' }, 201);
});

app.get('/:id', async (c) => {
  const { id } = c.req.param();
  const { results } = await c.env.DB.prepare('SELECT * FROM organizations WHERE id = ?').bind(id).all();
  if (results.length === 0) {
    return c.json({ message: 'Organization not found' }, 404);
  }
  return c.json(results[0]);
});

app.put('/:id', async (c) => {
  const { id } = c.req.param();
  const { name, domain, admin_email } = await c.req.json();
  await c.env.DB.prepare(
    'UPDATE organizations SET name = ?, domain = ?, admin_email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(name, domain, admin_email, id).run();
  return c.json({ message: 'Organization updated' });
});

app.delete('/:id', async (c) => {
  const { id } = c.req.param();
  await c.env.DB.prepare('DELETE FROM organizations WHERE id = ?').bind(id).run();
  return c.json({ message: 'Organization deleted' });
});

export default app;