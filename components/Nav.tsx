"use client"

import Link from "next/link";

export function NavBar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold">EHR Dashboard</Link>
      <ul className="flex space-x-6">
        <li>
          <Link href="/home" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/patient" className="hover:underline">
            Patient
          </Link>
        </li>
        <li>
          <Link href="/appointment" className="hover:underline">
            Appointment
          </Link>
        </li>
      </ul>
    </nav>
  );
}

