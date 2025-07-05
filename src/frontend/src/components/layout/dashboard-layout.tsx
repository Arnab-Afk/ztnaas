"use client";

import React, { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { 
  BarChart3, 
  Network, 
  Shield, 
  Building2, 
  Activity, 
  LineChart,
  Settings,
  Users,
  Menu,
  X,
  ChevronRight
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  
  // Navigation items
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "Organization", href: "/organization", icon: <Building2 className="h-5 w-5" /> },
    { name: "Network Wizard", href: "/network-wizard", icon: <Network className="h-5 w-5" /> },
    { name: "Network Visualization", href: "/network-visualization", icon: <Activity className="h-5 w-5" /> },
    { name: "Security Policies", href: "/security-policies", icon: <Shield className="h-5 w-5" /> },
    { name: "Monitoring", href: "/monitoring", icon: <LineChart className="h-5 w-5" /> },
    { name: "Security Analytics", href: "/security-analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "User Management", href: "/users", icon: <Users className="h-5 w-5" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">ZTNaaS</span>
            </div>
          ) : (
            <Shield className="h-6 w-6 text-primary mx-auto" />
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-accent"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} px-3 py-2 rounded-md ${item.href === pathname ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                >
                  {item.icon}
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-border">
          <div className={`flex ${sidebarOpen ? 'justify-between' : 'justify-center'} items-center gap-2`}>
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">A</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@ztnaas.com</p>
                </div>
              </div>
            )}
            {!sidebarOpen && (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">A</div>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Page content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
