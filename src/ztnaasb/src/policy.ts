import { Hono } from 'hono';
import { authMiddleware } from './middleware/auth';
import { Env } from '../index';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', authMiddleware);

app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM policies').all();
  return c.json(results);
});

app.post('/', async (c) => {
  const { id, network_id, name, type, config, priority, enabled } = await c.req.json();
  await c.env.DB.prepare(
    'INSERT INTO policies (id, network_id, name, type, config, priority, enabled) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, network_id, name, type, JSON.stringify(config), priority, enabled).run();
  return c.json({ message: 'Policy created' }, 201);
});

app.get('/:id', async (c) => {
  const { id } = c.req.param();
  const { results } = await c.env.DB.prepare('SELECT * FROM policies WHERE id = ?').bind(id).all();
  if (results.length === 0) {
    return c.json({ message: 'Policy not found' }, 404);
  }
  return c.json(results[0]);
});

app.put('/:id', async (c) => {
  const { id } = c.req.param();
  const { network_id, name, type, config, priority, enabled } = await c.req.json();
  await c.env.DB.prepare(
    'UPDATE policies SET network_id = ?, name = ?, type = ?, config = ?, priority = ?, enabled = ? WHERE id = ?'
  ).bind(network_id, name, type, JSON.stringify(config), priority, enabled, id).run();
  return c.json({ message: 'Policy updated' });
});

app.delete('/:id', async (c) => {
  const { id } = c.req.param();
  await c.env.DB.prepare('DELETE FROM policies WHERE id = ?').bind(id).run();
  return c.json({ message: 'Policy deleted' });
});

export default app;
