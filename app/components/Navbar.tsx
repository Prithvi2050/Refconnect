"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "candidate" | "employee";

type User = {
  id: string;
  name: string;
  email: string;
  roles?: UserRole[];
  role?: UserRole;
  company?: string;
};

export default function Navbar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("refconnect_current_user");

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const roles =
    currentUser?.roles || (currentUser?.role ? [currentUser.role] : []);

  const logout = () => {
    localStorage.removeItem("refconnect_current_user");
    setCurrentUser(null);
    router.push("/");
  };

  return (
    <nav className="w-full border-b p-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold">
          RefConnect
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/jobs" className="text-blue-600">
            Jobs
          </Link>

          {currentUser && (
            <Link href="/dashboard">
              Dashboard
            </Link>
          )}

          {roles.includes("candidate") && (
            <Link href="/dashboard/candidate">
              Candidate Dashboard
            </Link>
          )}

          {roles.includes("employee") && (
            <Link href="/dashboard/employee">
              Employee Dashboard
            </Link>
          )}

          {!currentUser ? (
            <>
              <Link href="/auth/login">Login</Link>

              <Link
                href="/auth/signup"
                className="rounded bg-blue-600 px-3 py-2 text-white"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-600">
                Hi, {currentUser.name}
              </span>

              <button
                onClick={logout}
                className="rounded border px-3 py-2 text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}