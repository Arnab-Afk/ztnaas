// src/services/cloudflare/CloudflareService.ts
export class CloudflareService {
  private apiToken: string;
  private baseUrl = 'https://api.cloudflare.com/client/v4';

  constructor(private env: any) {
    this.apiToken = env.CLOUDFLARE_API_TOKEN;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.statusText}`);
    }

    return response.json();
  }

  async createMagicWAN(config: any) {
    return this.request('/accounts/{account_id}/magic/wan', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async enableMagicTransit(config: any) {
    return this.request('/accounts/{account_id}/magic/transit', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async createFirewallRules(config: any) {
    return this.request('/accounts/{account_id}/magic/firewall/rules', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async createTunnel(config: any) {
    return this.request('/accounts/{account_id}/tunnels', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async getZeroTrustPolicies(accountId: string) {
    return this.request(`/accounts/${accountId}/access/policies`);
  }

  async createZeroTrustPolicy(accountId: string, policy: any) {
    return this.request(`/accounts/${accountId}/access/policies`, {
      method: 'POST',
      body: JSON.stringify(policy),
    });
  }
}
