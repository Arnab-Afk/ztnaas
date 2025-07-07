import { corsHeaders } from '../utils/headers';

// Replace nanoid with a simpler UUID generator to avoid dependency issues
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const handleOrganizations = {
  async list(request, env) {
    try {
      // Add a timeout to ensure we don't hang
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timed out')), 5000);
      });
      
      const queryPromise = env.DB.prepare(
        'SELECT * FROM organizations ORDER BY created_at DESC'
      ).all();
      
      // Race the database query against the timeout
      const { results } = await Promise.race([queryPromise, timeoutPromise]);
      
      return new Response(JSON.stringify({ 
        organizations: results || [],
        count: (results || []).length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Organization list error:', error);
      return new Response(JSON.stringify({ error: 'Failed to list organizations', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async get(request, env) {
    try {
      const { id } = request.params;
      const org = await env.DB.prepare(
        'SELECT * FROM organizations WHERE id = ?'
      ).bind(id).first();
      
      if (!org) {
        return new Response(JSON.stringify({ error: 'Organization not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(org), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to get organization', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async create(request, env) {
    try {
      const data = await request.json();
      
      // Validate required fields
      if (!data.name || !data.domain || !data.adminEmail) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const id = generateId(); // Use our simple UUID generator instead of nanoid
      const timestamp = new Date().toISOString();

      // Insert the organization
      await env.DB.prepare(
        'INSERT INTO organizations (id, name, domain, admin_email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(id, data.name, data.domain, data.adminEmail, timestamp, timestamp).run();

      return new Response(JSON.stringify({ 
        id, 
        name: data.name,
        domain: data.domain,
        adminEmail: data.adminEmail,
        createdAt: timestamp,
        updatedAt: timestamp
      }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Organization create error:', error);
      return new Response(JSON.stringify({ error: 'Failed to create organization', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async update(request, env) {
    try {
      const { id } = request.params;
      const data = await request.json();
      const timestamp = new Date().toISOString();

      // Check if organization exists
      const existingOrg = await env.DB.prepare(
        'SELECT id FROM organizations WHERE id = ?'
      ).bind(id).first();
      
      if (!existingOrg) {
        return new Response(JSON.stringify({ error: 'Organization not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Update the organization
      await env.DB.prepare(
        'UPDATE organizations SET name = ?, domain = ?, admin_email = ?, updated_at = ? WHERE id = ?'
      ).bind(data.name, data.domain, data.adminEmail, timestamp, id).run();

      return new Response(JSON.stringify({ 
        id, 
        ...data,
        updatedAt: timestamp
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to update organization', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async remove(request, env) {
    try {
      const { id } = request.params;

      // Check if organization exists
      const existingOrg = await env.DB.prepare(
        'SELECT id FROM organizations WHERE id = ?'
      ).bind(id).first();
      
      if (!existingOrg) {
        return new Response(JSON.stringify({ error: 'Organization not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Delete the organization
      await env.DB.prepare('DELETE FROM organizations WHERE id = ?').bind(id).run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to delete organization', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};