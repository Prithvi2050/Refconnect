"use client";

import Link from "next/link";
import { useState, type SubmitEventHandler } from "react";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const getUserRoles = (user: User): UserRole[] => {
    if (user.roles) {
      return user.roles;
    }

    if (user.role) {
      return [user.role];
    }

    return [];
  };

  const handleLogin: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const savedUsers = localStorage.getItem("refconnect_users");
    const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];

    const foundUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (!foundUser) {
      alert("No account found with this email. Please sign up first.");
      return;
    }

    const roles = getUserRoles(foundUser);

    const normalizedUser = {
      ...foundUser,
      roles,
    };

    localStorage.setItem(
      "refconnect_current_user",
      JSON.stringify(normalizedUser)
    );

    if (roles.includes("candidate") && roles.includes("employee")) {
      router.push("/dashboard");
    } else if (roles.includes("employee")) {
      router.push("/dashboard/employee");
    } else {
      router.push("/jobs");
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-3xl font-bold">Login</h1>

      <p className="mt-2 text-sm text-gray-600">
        Enter the email you used during signup.
      </p>

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="you@example.com"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-white"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          New to RefConnect?{" "}
          <Link href="/auth/signup" className="text-blue-600 underline">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}