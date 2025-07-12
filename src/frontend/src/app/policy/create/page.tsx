'use client';

// Create Policy Page - ZTNaaS

import React, { useState } from 'react';
import { createPolicy } from '@/services/api'; // Assuming this is the path to your api service

export default function CreatePolicyPage() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    // Add other form fields as needed
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with the actual network ID from your application state
      const networkId = 'YOUR_NETWORK_ID'; 
      await createPolicy(networkId, formData);
      alert('Policy created successfully!');
      // Optionally, redirect to the policy list page
    } catch (error) {
      alert('Error creating policy: ' + error.message);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create New Policy</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded border">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Policy Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block mb-2">Policy Type</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Policy</button>
      </form>
    </main>
  );
}
