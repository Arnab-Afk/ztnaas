import { Hono } from 'hono';
import organization from './organization';
import network from './network';
import policy from './policy';
import monitoring from './monitoring';
import billing from './billing';

import { NetworkManager } from './durable_objects/NetworkManager';
import { PolicyEngine } from './durable_objects/PolicyEngine';
import { SecurityOrchestrator } from './durable_objects/SecurityOrchestrator';
import { PerformanceMonitor } from './durable_objects/PerformanceMonitor';

export interface Env {
  DB: D1Database;
  NETWORK_MANAGER: DurableObjectNamespace;
  POLICY_ENGINE: DurableObjectNamespace;
  SECURITY_ORCHESTRATOR: DurableObjectNamespace;
  PERFORMANCE_MONITOR: DurableObjectNamespace;
  POLICIES: KVNamespace;
  SESSIONS: KVNamespace;
  ASSETS: R2Bucket;
}

const app = new Hono<{ Bindings: Env }>();

app.route('/organizations', organization);
app.route('/networks', network);
app.route('/policies', policy);
app.route('/monitoring', monitoring);
app.route('/billing', billing);

// Durable Object routes
app.get('/do/network-manager', async (c) => {
  const id = c.env.NETWORK_MANAGER.idFromName('network_manager_singleton');
  const obj = c.env.NETWORK_MANAGER.get(id);
  const resp = await obj.fetch(c.req.url);
  return resp;
});

app.get('/do/policy-engine', async (c) => {
  const id = c.env.POLICY_ENGINE.idFromName('policy_engine_singleton');
  const obj = c.env.POLICY_ENGINE.get(id);
  const resp = await obj.fetch(c.req.url);
  return resp;
});

app.get('/do/security-orchestrator', async (c) => {
  const id = c.env.SECURITY_ORCHESTRATOR.idFromName('security_orchestrator_singleton');
  const obj = c.env.SECURITY_ORCHESTRATOR.get(id);
  const resp = await obj.fetch(c.req.url);
  return resp;
});

app.get('/do/performance-monitor', async (c) => {
  const id = c.env.PERFORMANCE_MONITOR.idFromName('performance_monitor_singleton');
  const obj = c.env.PERFORMANCE_MONITOR.get(id);
  const resp = await obj.fetch(c.req.url);
  return resp;
});

export default app;

export { NetworkManager, PolicyEngine, SecurityOrchestrator, PerformanceMonitor };