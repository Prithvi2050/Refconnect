"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type UserRole = "candidate" | "employee";

type User = {
  id: string;
  name: string;
  email: string;
  roles?: UserRole[];
  role?: UserRole;
  company?: string;
};

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("refconnect_current_user");

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const roles =
    currentUser?.roles || (currentUser?.role ? [currentUser.role] : []);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-3xl font-bold">Welcome to RefConnect</h1>
        <p className="mt-2 text-gray-600">
          Please login or sign up to continue.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/auth/login"
            className="rounded border px-4 py-2"
          >
            Login
          </Link>

          <Link
            href="/auth/signup"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <p className="text-sm text-gray-500">Dashboard</p>
      <h1 className="text-3xl font-bold">Welcome, {currentUser.name}</h1>

      <p className="mt-2 text-gray-600">
        Choose what you want to do today.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {roles.includes("candidate") && (
          <Link
            href="/jobs"
            className="rounded-lg border p-6 shadow-sm hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">Browse Jobs</h2>
            <p className="mt-2 text-sm text-gray-600">
              Find open roles and request referrals from employees.
            </p>
          </Link>
        )}

        {roles.includes("candidate") && (
          <Link
            href="/dashboard/candidate"
            className="rounded-lg border p-6 shadow-sm hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">Track My Requests</h2>
            <p className="mt-2 text-sm text-gray-600">
              View pending, approved, rejected, and applied referrals.
            </p>
          </Link>
        )}

        {roles.includes("employee") && (
          <Link
            href="/dashboard/employee"
            className="rounded-lg border p-6 shadow-sm hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">Manage Referrals</h2>
            <p className="mt-2 text-sm text-gray-600">
              Add jobs, review requests, approve or reject candidates.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}