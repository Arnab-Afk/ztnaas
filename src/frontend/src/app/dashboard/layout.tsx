import React from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold  mb-6">Admin Dashboard</h1>
        {children}
      </div>
    </DashboardLayout>
  );
}