// Dashboard Page - ZTNaaS

import React from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Network, 
  Shield, 
  Building2, 
  ChevronRight 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  // Mock data for dashboard metrics
  const metrics = [
    { title: "Active Networks", value: "5", change: "+1", trend: "up" },
    { title: "Connected Users", value: "128", change: "+12%", trend: "up" },
    { title: "Security Events", value: "24", change: "-8%", trend: "down" },
    { title: "Avg. Response Time", value: "42ms", change: "-5ms", trend: "down" },
  ];

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.title} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {metric.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Network Status</CardTitle>
            <CardDescription>Current status of all networks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border rounded bg-muted/50">
              <p className="text-muted-foreground">Network status visualization will appear here</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last updated: 5 minutes ago</span>
            <Button variant="link" asChild>
              <Link href="/network-visualization" className="flex items-center">
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Security Events</CardTitle>
            <CardDescription>Recent security alerts and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border rounded bg-muted/50">
              <p className="text-muted-foreground">Security events visualization will appear here</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last updated: 2 minutes ago</span>
            <Button variant="link" asChild>
              <Link href="/security-analytics" className="flex items-center">
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mb-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: "Add Organization", icon: <Building2 className="h-5 w-5" />, href: "/organization" },
                { name: "Create Network", icon: <Network className="h-5 w-5" />, href: "/network-wizard" },
                { name: "Configure Security", icon: <Shield className="h-5 w-5" />, href: "/security-policies" },
                { name: "View Analytics", icon: <BarChart3 className="h-5 w-5" />, href: "/security-analytics" },
              ].map((action) => (
                <Link 
                  key={action.name} 
                  href={action.href}
                  className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium">{action.name}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
