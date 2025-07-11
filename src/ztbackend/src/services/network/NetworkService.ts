// src/services/network/NetworkService.ts
import { CloudflareService } from '../cloudflare/CloudflareService';
import { generateId } from '../../utils/id';

interface NetworkConfig {
  name: string;
  locations: string[];
  subnets: string[];
  policies: any[];
}

export class NetworkService {
  private cloudflare: CloudflareService;
  
  constructor(private env: any) {
    this.cloudflare = new CloudflareService(env);
  }

  async createNetwork(orgId: string, config: NetworkConfig) {
    const networkId = generateId();
    
    try {
      // 1. Create Magic WAN configuration
      const magicWanConfig = await this.cloudflare.createMagicWAN({
        name: config.name,
        locations: config.locations,
        subnets: config.subnets,
      });

      // 2. Set up Magic Transit for DDoS protection
      const magicTransitConfig = await this.cloudflare.enableMagicTransit({
        networkId,
        prefixes: config.subnets,
      });

      // 3. Configure Magic Firewall rules
      const firewallRules = await this.cloudflare.createFirewallRules({
        networkId,
        policies: config.policies,
      });

      // 4. Store in database
      const networkData = {
        id: networkId,
        org_id: orgId,
        name: config.name,
        status: 'provisioning',
        config: JSON.stringify({
          magicWan: magicWanConfig,
          magicTransit: magicTransitConfig,
          firewall: firewallRules,
        }),
        cloudflare_network_id: magicWanConfig.id,
      };

      await this.env.DB.prepare(
        'INSERT INTO networks VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        networkData.id,
        networkData.org_id,
        networkData.name,
        networkData.status,
        networkData.config,
        networkData.cloudflare_network_id,
        new Date().toISOString()
      ).run();

      // 5. Initialize Durable Object for network management
      const networkManager = this.env.NETWORK_MANAGER.get(
        this.env.NETWORK_MANAGER.idFromName(networkId)
      );
      
      await networkManager.fetch('http://internal/initialize', {
        method: 'POST',
        body: JSON.stringify(networkData),
      });

      return {
        id: networkId,
        status: 'provisioning',
        message: 'Network provisioning started',
      };
    } catch (error) {
      console.error('Network creation failed:', error);
      throw new Error('Failed to create network');
    }
  }

  async getNetworks(orgId: string) {
    const results = await this.env.DB.prepare(
      'SELECT * FROM networks WHERE org_id = ?'
    ).bind(orgId).all();

    return results.results.map(row => ({
      ...row,
      config: JSON.parse(row.config),
    }));
  }

  async getNetwork(networkId: string) {
    const result = await this.env.DB.prepare(
      'SELECT * FROM networks WHERE id = ?'
    ).bind(networkId).first();

    if (!result) {
      throw new Error('Network not found');
    }

    return {
      ...result,
      config: JSON.parse(result.config),
    };
  }
}
