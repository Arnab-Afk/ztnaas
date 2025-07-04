import React from "react";
import { Users, UserPlus, Search, Filter, MoreHorizontal, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  // Mock user data
  const users = [
    { id: 1, name: "Admin User", email: "admin@ztnaas.com", role: "Administrator", status: "Active", lastActive: "2 hours ago" },
    { id: 2, name: "John Smith", email: "john@example.com", role: "Network Admin", status: "Active", lastActive: "1 day ago" },
    { id: 3, name: "Sarah Johnson", email: "sarah@example.com", role: "Security Analyst", status: "Active", lastActive: "3 hours ago" },
    { id: 4, name: "Michael Brown", email: "michael@example.com", role: "Read Only", status: "Inactive", lastActive: "2 weeks ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
        <div className="flex items-start space-x-4">
          <div className="bg-indigo-100 p-2 rounded-full">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium mb-1">User Management</h2>
            <p className="text-slate-600">
              Manage users, roles, and permissions for your ZTNaaS deployment.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input 
            type="search" 
            className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Search users..."
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage your organization's users and their access levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Role</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Last Active</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.lastActive}</td>
                    <td className="px-6 py-4">
                      <button className="text-gray-500 hover:text-gray-700">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Role Management</CardTitle>
            <CardDescription>Configure user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-md bg-slate-50 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-slate-600">Role management will be available in the next release.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Access Logs</CardTitle>
            <CardDescription>View user access history and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-md bg-slate-50 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-slate-600">Access logs will be available in the next release.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}