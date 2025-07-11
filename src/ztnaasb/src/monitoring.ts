import { Hono } from 'hono';
import { authMiddleware } from './middleware/auth';

const app = new Hono();

app.use('/*', authMiddleware);

app.get('/', (c) => c.text('Get Monitoring Data'));
app.get('/analytics', (c) => c.text('Get Analytics Data'));

export default app;
