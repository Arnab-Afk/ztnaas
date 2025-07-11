// src/api/auth/routes.ts
import { Router } from 'itty-router';
import { z } from 'zod';
import { AuthService } from '../../services/auth/AuthService';
import { validateRequest } from '../../middleware/validation';

const authRouter = Router({ base: '/api/auth' });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  organizationName: z.string().min(2),
  domain: z.string().min(2),
});

authRouter.post('/login', validateRequest(loginSchema), async (request, env) => {
  const authService = new AuthService(env);
  const { email, password } = await request.json();
  
  try {
    const result = await authService.login(email, password);
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

authRouter.post('/register', validateRequest(registerSchema), async (request, env) => {
  const authService = new AuthService(env);
  const data = await request.json();
  
  try {
    const result = await authService.register(data);
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

export { authRouter as authRoutes };
