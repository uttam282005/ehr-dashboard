"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-6 text-center">
        <h1 className="text-2xl font-semibold mb-6">EHR Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Choose a module to continue:
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/appointment"
            className="block w-full px-4 py-3 rounded-lg bg-sky-600 text-white font-medium shadow hover:bg-sky-700"
          >
            Appointments
          </Link>

          <Link
            href="/patient"
            className="block w-full px-4 py-3 rounded-lg bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700"
          >
            Patients
          </Link>
        </div>
      </div>
    </div>
  );
}
