'use client';

// Policy Configuration Page - ZTNaaS

import React, { useState, useEffect } from 'react';
import { getPolicies } from '@/services/api'; // Assuming this is the path to your api service
import Link from 'next/link';

export default function PolicyPage() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        // Replace with the actual network ID from your application state
        const networkId = 'YOUR_NETWORK_ID'; 
        const response = await getPolicies(networkId);
        setPolicies(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Policy Configuration</h1>
        <Link href="/policy/create">
          <a className="bg-blue-500 text-white px-4 py-2 rounded">Create Policy</a>
        </Link>
      </div>
      <p>Configure security policies, manage rules, and apply templates to your network.</p>
      
      {loading && <p>Loading policies...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      <div className="mt-6 border rounded p-4 bg-white">
        {policies.length > 0 ? (
          <ul>
            {policies.map((policy) => (
              <li key={policy.id} className="border-b py-2">
                <p className="font-semibold">{policy.name}</p>
                <p className="text-sm text-gray-600">{policy.type}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No policies found.</p>
        )}
      </div>
    </main>
  );
}
