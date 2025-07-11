import { Hono } from 'hono';
import { authMiddleware } from './middleware/auth';

const app = new Hono();

app.use('/*', authMiddleware);

app.get('/', (c) => c.text('Get Billing Info'));
app.get('/account', (c) => c.text('Get Account Info'));

export default app;
