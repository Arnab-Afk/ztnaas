import React from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function SecurityAnalyticsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Security Analytics</h1>
        {children}
      </div>
    </DashboardLayout>
  );
}