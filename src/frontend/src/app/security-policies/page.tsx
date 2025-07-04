import React from "react";
import { Shield, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityPoliciesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
        <div className="flex items-start space-x-4">
          <div className="bg-indigo-100 p-2 rounded-full">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium mb-1">Enterprise Security Policies</h2>
            <p className="text-slate-600">
              Configure and manage security policies for your Zero Trust Network. These policies determine how users and devices access your resources.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Access Policies</CardTitle>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Enterprise</span>
            </div>
            <CardDescription>Define who can access what resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-md bg-slate-50 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-slate-600">Access policy configuration will be available in the next release.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Device Policies</CardTitle>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Enterprise</span>
            </div>
            <CardDescription>Set requirements for device compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-md bg-slate-50 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-slate-600">Device policy configuration will be available in the next release.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Authentication Policies</CardTitle>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Enterprise</span>
            </div>
            <CardDescription>Configure MFA and authentication requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-md bg-slate-50 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-slate-600">Authentication policy configuration will be available in the next release.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Network Policies</CardTitle>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Enterprise</span>
            </div>
            <CardDescription>Define network-level security controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-md bg-slate-50 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-slate-600">Network policy configuration will be available in the next release.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-1">Coming Soon</h3>
            <p className="text-sm text-blue-600">
              Advanced policy configuration, policy templates, and compliance reporting features will be available in upcoming releases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}