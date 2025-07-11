export class PolicyEngine {
    constructor(state: DurableObjectState, env: Env) {}

    async fetch(request: Request) {
        return new Response("PolicyEngine Durable Object");
    }
}