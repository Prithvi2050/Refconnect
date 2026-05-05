import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">RefConnect</h1>

      <div className="flex gap-4">
        <Link href="/jobs" className="text-blue-600">
          Jobs
        </Link>

        <Link href="/dashboard/candidate">
          Candidate Dashboard
        </Link>

        <Link href="/dashboard/employee">
          Employee Dashboard
        </Link>

        <Link href="/auth/login">
          Login
        </Link>
      </div>
    </nav>
  );
}