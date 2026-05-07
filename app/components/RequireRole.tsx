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

type Props = {
  role: UserRole;
  children: React.ReactNode;
};

function getUserRoles(user: User | null): UserRole[] {
  if (!user) return [];

  if (user.roles) {
    return user.roles;
  }

  if (user.role) {
    return [user.role];
  }

  return [];
}

export default function RequireRole({ role, children }: Props) {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("refconnect_current_user");

    if (!savedUser) {
      setLoading(false);
      router.push("/auth/login");
      return;
    }

    setCurrentUser(JSON.parse(savedUser));
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="p-6">Checking access...</div>;
  }

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Login required</h1>

        <p className="mt-2 text-gray-600">
          Please login before accessing this page.
        </p>

        <Link
          href="/auth/login"
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const roles = getUserRoles(currentUser);

  if (!roles.includes(role)) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Access not allowed</h1>

        <p className="mt-2 text-gray-600">
          Your account does not have {role} access.
        </p>

        <div className="mt-4 flex gap-3">
          <Link href="/dashboard" className="rounded border px-4 py-2">
            Go to Dashboard
          </Link>

          <Link href="/auth/signup" className="rounded bg-blue-600 px-4 py-2 text-white">
            Create another account
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}