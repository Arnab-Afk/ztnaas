import { corsHeaders } from '../utils/headers';

// Replace nanoid with a simpler UUID generator to avoid dependency issues
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const handleNetworks = {
  async list(request, env) {
    try {
      const { searchParams } = new URL(request.url);
      const orgId = searchParams.get('orgId');
      
      let query = 'SELECT * FROM networks';
      let params = [];
      
      if (orgId) {
        query += ' WHERE org_id = ?';
        params.push(orgId);
      }
      
      query += ' ORDER BY created_at DESC';
      
      // Add a timeout to ensure we don't hang
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timed out')), 5000);
      });
      
      const queryPromise = env.DB.prepare(query).bind(...params).all();
      
      // Race the database query against the timeout
      const { results } = await Promise.race([queryPromise, timeoutPromise]);
      
      return new Response(JSON.stringify({ networks: results || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Network list error:', error);
      return new Response(JSON.stringify({ error: 'Failed to list networks', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async get(request, env) {
    try {
      const { id } = request.params;
      
      // Add a timeout to ensure we don't hang
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timed out')), 5000);
      });
      
      const queryPromise = env.DB.prepare(
        'SELECT * FROM networks WHERE id = ?'
      ).bind(id).first();
      
      // Race the database query against the timeout
      const network = await Promise.race([queryPromise, timeoutPromise]);
      
      if (!network) {
        return new Response(JSON.stringify({ error: 'Network not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(network), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Network get error:', error);
      return new Response(JSON.stringify({ error: 'Failed to get network', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async create(request, env) {
    try {
      const data = await request.json();
      
      // Validate required fields
      if (!data.orgId || !data.name || !data.config) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Check if organization exists with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timed out')), 5000);
      });
      
      const orgQueryPromise = env.DB.prepare(
        'SELECT id FROM organizations WHERE id = ?'
      ).bind(data.orgId).first();
      
      const org = await Promise.race([orgQueryPromise, timeoutPromise]);
      
      if (!org) {
        return new Response(JSON.stringify({ error: 'Organization not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const id = generateId();
      const timestamp = new Date().toISOString();
      const config = JSON.stringify(data.config);

      // Insert the network
      await env.DB.prepare(
        'INSERT INTO networks (id, org_id, name, status, config, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(id, data.orgId, data.name, data.status || 'active', config, timestamp).run();

      // TODO: Integrate with Cloudflare Magic WAN API to provision the actual network

      return new Response(JSON.stringify({ 
        id, 
        orgId: data.orgId,
        name: data.name,
        status: data.status || 'active',
        config: data.config,
        createdAt: timestamp
      }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to create network', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async update(request, env) {
    try {
      const { id } = request.params;
      const data = await request.json();

      // Check if network exists
      const existingNetwork = await env.DB.prepare(
        'SELECT id FROM networks WHERE id = ?'
      ).bind(id).first();
      
      if (!existingNetwork) {
        return new Response(JSON.stringify({ error: 'Network not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const config = JSON.stringify(data.config);

      // Update the network
      await env.DB.prepare(
        'UPDATE networks SET name = ?, status = ?, config = ? WHERE id = ?'
      ).bind(data.name, data.status, config, id).run();

      // TODO: Update Cloudflare Magic WAN configuration

      return new Response(JSON.stringify({ 
        id,
        name: data.name,
        status: data.status,
        config: data.config
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to update network', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async remove(request, env) {
    try {
      const { id } = request.params;

      // Check if network exists
      const existingNetwork = await env.DB.prepare(
        'SELECT id FROM networks WHERE id = ?'
      ).bind(id).first();
      
      if (!existingNetwork) {
        return new Response(JSON.stringify({ error: 'Network not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // TODO: Remove from Cloudflare Magic WAN

      // Delete the network
      await env.DB.prepare('DELETE FROM networks WHERE id = ?').bind(id).run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to delete network', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};