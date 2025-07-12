'use client';

// Network Creation Wizard Page - ZTNaaS

import React, { useState } from 'react';

export default function NetworkWizardPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    networkName: '',
    region: '',
    // Add other form fields as needed
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 1: Network Details</h2>
            <label htmlFor="networkName" className="block mb-2">Network Name</label>
            <input
              type="text"
              id="networkName"
              name="networkName"
              value={formData.networkName}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 2: Region Selection</h2>
            <label htmlFor="region" className="block mb-2">Region</label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="">Select a region</option>
              <option value="us-east-1">US East (N. Virginia)</option>
              <option value="us-west-2">US West (Oregon)</option>
              {/* Add other regions */}
            </select>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 3: Confirmation</h2>
            <p>Review your network configuration before creation.</p>
            <pre className="bg-gray-100 p-4 rounded mt-4">{JSON.stringify(formData, null, 2)}</pre>
          </div>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Network Creation Wizard</h1>
      <p>Step through the process to create and configure a new Zero-Trust network.</p>
      
      <div className="mt-6 border rounded p-4 bg-white">
        {renderStep()}
      </div>

      <div className="mt-4 flex justify-between">
        {step > 1 && <button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded">Previous</button>}
        {step < 3 && <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>}
        import { createNetwork } from '@/services/api';

// ... (rest of the component)

  const handleCreateNetwork = async () => {
    try {
      // Replace with the actual organization ID from your application state
      const orgId = 'YOUR_ORGANIZATION_ID'; 
      await createNetwork(orgId, formData);
      alert('Network created successfully!');
      // Optionally, redirect to the network list page
    } catch (error) {
      alert('Error creating network: ' + error.message);
    }
  };

// ... (rest of the component)

        {step === 3 && <button onClick={handleCreateNetwork} className="bg-green-500 text-white px-4 py-2 rounded">Create Network</button>}

      </div>
    </main>
  );
}
