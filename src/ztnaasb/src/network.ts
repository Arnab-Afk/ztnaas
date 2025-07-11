import { Hono } from 'hono';
import { authMiddleware } from './middleware/auth';
import { Env } from '../index';
import { createMagicWANConnection, deleteMagicWANConnection } from './services/magicWan';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', authMiddleware);

app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM networks').all();
  return c.json(results);
});

app.post('/', async (c) => {
  const { id, org_id, name, status, config } = await c.req.json();
  await c.env.DB.prepare(
    'INSERT INTO networks (id, org_id, name, status, config) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, org_id, name, status, JSON.stringify(config)).run();
  
  // Simulate Magic WAN API call
  await createMagicWANConnection(config);

  return c.json({ message: 'Network created' }, 201);
});

app.get('/:id', async (c) => {
  const { id } = c.req.param();
  const { results } = await c.env.DB.prepare('SELECT * FROM networks WHERE id = ?').bind(id).all();
  if (results.length === 0) {
    return c.json({ message: 'Network not found' }, 404);
  }
  return c.json(results[0]);
});

app.put('/:id', async (c) => {
  const { id } = c.req.param();
  const { org_id, name, status, config } = await c.req.json();
  await c.env.DB.prepare(
    'UPDATE networks SET org_id = ?, name = ?, status = ?, config = ? WHERE id = ?'
  ).bind(org_id, name, status, JSON.stringify(config), id).run();
  return c.json({ message: 'Network updated' });
});

app.delete('/:id', async (c) => {
  const { id } = c.req.param();
  
  // Simulate Magic WAN API call
  await deleteMagicWANConnection(id);

  await c.env.DB.prepare('DELETE FROM networks WHERE id = ?').bind(id).run();
  return c.json({ message: 'Network deleted' });
});

export default app;
