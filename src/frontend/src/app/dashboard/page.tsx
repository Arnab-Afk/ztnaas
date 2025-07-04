// Dashboard Page - ZTNaaS

import React from "react";

export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome to the ZTNaaS Admin Dashboard. Select a section to get started.</p>
      <ul className="list-disc ml-6 mt-4 space-y-2">
        <li>Organization Management</li>
        <li>Network Creation Wizard</li>
        <li>Network Visualization</li>
        <li>Policy Configuration</li>
        <li>Real-time Monitoring</li>
        <li>Security Analytics</li>
      </ul>
    </main>
  );
}
