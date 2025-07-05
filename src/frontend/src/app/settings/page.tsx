import React from "react";
import { Settings, AlertTriangle, Save, Globe, Bell, Lock, Database, Server } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg border  mb-6">
        <div className="flex items-start space-x-4">
          <div className="bg-indigo-100 p-2 rounded-full">
            <Settings className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium mb-1">System Settings</h2>
            <p className="text-muted-foreground">
              Configure global settings for your ZTNaaS deployment. These settings affect the entire system.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-indigo-600" />
              <CardTitle>General</CardTitle>
            </div>
            <CardDescription>Basic system configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-md bg-muted/50 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-muted-foreground">General settings configuration will be available in the next release.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Alert and notification settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-md bg-muted/50 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-muted-foreground">Notification settings will be available in the next release.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-indigo-600" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>System security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-md bg-muted/50 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-muted-foreground">Security settings will be available in the next release.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-indigo-600" />
              <CardTitle>Backup & Recovery</CardTitle>
            </div>
            <CardDescription>Data backup configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-md flex flex-col items-center justify-center text-center bg-muted/50">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-muted-foreground">Backup settings will be available in the next release.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-indigo-600" />
              <CardTitle>System Maintenance</CardTitle>
            </div>
            <CardDescription>Maintenance and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-md bg-muted/50 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-muted-foreground">Maintenance settings will be available in the next release.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Details about your ZTNaaS deployment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-sm font-medium mb-1">Version</p>
                <p className="font-medium">ZTNaaS Enterprise v1.0.0</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-sm font-medium mb-1">Last Updated</p>
                <p className="font-medium">June 15, 2023</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-sm font-medium mb-1">License</p>
                <p className="font-medium">Enterprise (Valid until Dec 31, 2023)</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-sm font-medium mb-1">Support</p>
                <p className="font-medium">Premium Support Plan</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}