import { corsHeaders } from '../utils/headers';
import { nanoid } from 'nanoid';

export const handlePolicies = {
  async list(request, env) {
    try {
      const { searchParams } = new URL(request.url);
      const networkId = searchParams.get('networkId');
      
      let query = 'SELECT * FROM policies';
      let params = [];
      
      if (networkId) {
        query += ' WHERE network_id = ?';
        params.push(networkId);
      }
      
      query += ' ORDER BY priority ASC, created_at DESC';
      
      const { results } = await env.DB.prepare(query).bind(...params).all();
      
      return new Response(JSON.stringify({ policies: results || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to list policies', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async get(request, env) {
    try {
      const { id } = request.params;
      const policy = await env.DB.prepare(
        'SELECT * FROM policies WHERE id = ?'
      ).bind(id).first();
      
      if (!policy) {
        return new Response(JSON.stringify({ error: 'Policy not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Parse the JSON config
      policy.config = JSON.parse(policy.config);

      return new Response(JSON.stringify(policy), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to get policy', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async create(request, env) {
    try {
      const data = await request.json();
      
      // Validate required fields
      if (!data.networkId || !data.name || !data.type || !data.config) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Check if network exists
      const network = await env.DB.prepare(
        'SELECT id FROM networks WHERE id = ?'
      ).bind(data.networkId).first();
      
      if (!network) {
        return new Response(JSON.stringify({ error: 'Network not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const id = nanoid();
      const timestamp = new Date().toISOString();
      const config = JSON.stringify(data.config);

      // Insert the policy
      await env.DB.prepare(
        'INSERT INTO policies (id, network_id, name, type, config, priority, enabled, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        id, 
        data.networkId, 
        data.name, 
        data.type, 
        config, 
        data.priority || 100, 
        data.enabled === false ? 0 : 1, 
        timestamp
      ).run();

      // TODO: Apply the policy to the network via Cloudflare API

      return new Response(JSON.stringify({ 
        id, 
        networkId: data.networkId,
        name: data.name,
        type: data.type,
        config: data.config,
        priority: data.priority || 100,
        enabled: data.enabled === false ? false : true,
        createdAt: timestamp
      }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to create policy', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async update(request, env) {
    try {
      const { id } = request.params;
      const data = await request.json();

      // Check if policy exists
      const existingPolicy = await env.DB.prepare(
        'SELECT id FROM policies WHERE id = ?'
      ).bind(id).first();
      
      if (!existingPolicy) {
        return new Response(JSON.stringify({ error: 'Policy not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const config = JSON.stringify(data.config);

      // Update the policy
      await env.DB.prepare(
        'UPDATE policies SET name = ?, type = ?, config = ?, priority = ?, enabled = ? WHERE id = ?'
      ).bind(
        data.name, 
        data.type, 
        config, 
        data.priority, 
        data.enabled ? 1 : 0, 
        id
      ).run();

      // TODO: Update policy in Cloudflare

      return new Response(JSON.stringify({ 
        id,
        name: data.name,
        type: data.type,
        config: data.config,
        priority: data.priority,
        enabled: data.enabled
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to update policy', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async remove(request, env) {
    try {
      const { id } = request.params;

      // Check if policy exists
      const existingPolicy = await env.DB.prepare(
        'SELECT id FROM policies WHERE id = ?'
      ).bind(id).first();
      
      if (!existingPolicy) {
        return new Response(JSON.stringify({ error: 'Policy not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Delete the policy
      await env.DB.prepare('DELETE FROM policies WHERE id = ?').bind(id).run();

      // TODO: Remove policy from Cloudflare

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to delete policy', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};