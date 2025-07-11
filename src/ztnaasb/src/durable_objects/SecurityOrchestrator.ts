export class SecurityOrchestrator {
    constructor(state: DurableObjectState, env: Env) {}

    async fetch(request: Request) {
        return new Response("SecurityOrchestrator Durable Object");
    }
}