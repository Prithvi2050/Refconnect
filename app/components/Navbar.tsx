"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type UserRole = "candidate" | "employee";

type User = {
  id: string;
  name: string;
  email: string;
  roles?: UserRole[];
  role?: UserRole;
  company?: string;
};

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const loadCurrentUser = () => {
      const savedUser = localStorage.getItem("refconnect_current_user");

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        setCurrentUser(null);
      }
    };

    loadCurrentUser();

    window.addEventListener("refconnect_user_updated", loadCurrentUser);
    window.addEventListener("storage", loadCurrentUser);

    return () => {
      window.removeEventListener("refconnect_user_updated", loadCurrentUser);
      window.removeEventListener("storage", loadCurrentUser);
    };
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("refconnect_current_user");
    setCurrentUser(null);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-950">
          RefConnect
        </Link>

        <div className="flex items-center gap-2">
          <NavLink href="/jobs" label="Jobs" active={pathname === "/jobs"} />

          {currentUser && (
            <>
              <NavLink
                href="/dashboard"
                label="Dashboard"
                active={pathname.startsWith("/dashboard")}
              />

              <NavLink
                href="/profile"
                label="Profile"
                active={pathname === "/profile"}
              />
            </>
          )}

          {!currentUser ? (
            <div className="ml-2 flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-950"
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="ml-3 flex items-center gap-3 border-l border-gray-200 pl-4">
              <span className="hidden text-sm text-gray-600 sm:inline">
                Hi, {currentUser.name}
              </span>

              <button
                onClick={logout}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}