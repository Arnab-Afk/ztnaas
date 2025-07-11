export class PerformanceMonitor {
    constructor(state: DurableObjectState, env: Env) {}

    async fetch(request: Request) {
        return new Response("PerformanceMonitor Durable Object");
    }
}