import Link from "next/link";

export default async function Home() {

  return (
    <div>
      <h1 className="text-3xl font-bold">EHR Dashboard</h1>
      <p className="mt-2 text-gray-600">Mock integration with Patients, Appointments, and Billing</p>
      <ul className="mt-6 space-y-4">
        <li><Link href="/patient" className="text-blue-600">Manage Patients</Link></li>
        <li><Link href="/appointment" className="text-blue-600">Manage Appointments</Link></li>
        <li><Link href="/billing" className="text-blue-600">Billing & Reports</Link></li>
      </ul>
    </div>
  );
}

