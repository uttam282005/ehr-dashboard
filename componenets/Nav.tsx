import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-white shadow p-4 flex gap-6">
      <Link href="/" className="font-bold">Dashboard</Link>
      <Link href="/patients">Patients</Link>
      <Link href="/appointments">Appointments</Link>
      <Link href="/billing">Billing</Link>
    </nav>
  );
}
