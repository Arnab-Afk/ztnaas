export class PerformanceMonitor {
    state: DurableObjectState;
    env: Env;

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.env = env;
    }

    async fetch(request: Request) {
        const url = new URL(request.url);
        const path = url.pathname;

        if (request.method === 'POST' && path === '/record') {
            const { metric, value, timestamp } = await request.json();
            // Simulate recording performance metrics
            await this.state.storage.put(`metric-${metric}-${timestamp}`, { value, timestamp });
            return new Response(JSON.stringify({ message: `Metric ${metric} recorded` }), { status: 200 });
        } else if (request.method === 'GET' && path === '/metrics') {
            const allMetrics = await this.state.storage.list();
            return new Response(JSON.stringify(Array.from(allMetrics.entries())), { status: 200 });
        } else {
            return new Response("PerformanceMonitor Durable Object - Use /record (POST) or /metrics (GET)", { status: 200 });
        }
    }
}