// Root Page - ZTNaaS

import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to ZTNaaS</h1>
        <p className="mb-8">Zero-Trust Network-as-a-Service Platform</p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
