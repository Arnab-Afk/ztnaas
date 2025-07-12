"use client";

// Organization Management Page - ZTNaaS

import React, { useState, useEffect } from "react";
import { getOrganizations } from "@/services/api"; // Assuming this is the path to your api service

export default function OrganizationPage() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getOrganizations();
        setOrganizations(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Organization Management</h1>
      <p>Manage your organizations, view details, and add new organizations here.</p>
      
      {loading && <p>Loading organizations...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      <div className="mt-6 border rounded p-4 bg-white">
        {organizations.length > 0 ? (
          <ul>
            {organizations.map((org) => (
              <li key={org.id} className="border-b py-2">
                <p className="font-semibold">{org.name}</p>
                <p className="text-sm text-gray-600">{org.domain}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No organizations found.</p>
        )}
      </div>
    </main>
  );
}
