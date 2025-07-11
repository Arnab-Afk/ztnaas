export class NetworkManager {
    constructor(state: DurableObjectState, env: Env) {}

    async fetch(request: Request) {
        return new Response("NetworkManager Durable Object");
    }
}