import React from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function MonitoringLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Real-time Monitoring</h1>
        {children}
      </div>
    </DashboardLayout>
  );
}