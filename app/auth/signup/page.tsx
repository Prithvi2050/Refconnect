"use client";

import Link from "next/link";
import { useState, type SubmitEventHandler } from "react";
import { useRouter } from "next/navigation";

type UserRole = "candidate" | "employee";
type UsageType = "candidate" | "employee" | "both";

type User = {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  company?: string;
  linkedinUrl?: string;
  resumeLink?: string;
};

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [usageType, setUsageType] = useState<UsageType>("candidate");

  const [company, setCompany] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  const includesCandidate =
    usageType === "candidate" || usageType === "both";

  const includesEmployee =
    usageType === "employee" || usageType === "both";

  const getRoles = (): UserRole[] => {
    if (usageType === "both") {
      return ["candidate", "employee"];
    }

    return [usageType];
  };

  const handleSignup: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const savedUsers = localStorage.getItem("refconnect_users");
    const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      alert("An account with this email already exists. Please login.");
      return;
    }

    const roles = getRoles();

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      roles,
      company: includesEmployee ? company : undefined,
      linkedinUrl: linkedinUrl || undefined,
      resumeLink: includesCandidate ? resumeLink || undefined : undefined,
    };

    const updatedUsers = [newUser, ...users];

    localStorage.setItem("refconnect_users", JSON.stringify(updatedUsers));
    localStorage.setItem("refconnect_current_user", JSON.stringify(newUser));

    if (roles.includes("candidate") && roles.includes("employee")) {
      router.push("/dashboard");
    } else if (roles.includes("employee")) {
      router.push("/dashboard/employee");
    } else {
      router.push("/jobs");
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-bold">Create your RefConnect account</h1>

        <p className="mt-2 text-sm text-gray-600">
          Tell us how you want to use RefConnect. You can request referrals,
          give referrals, or do both.
        </p>
      </div>

      <form onSubmit={handleSignup} className="mt-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Prithvi"
              required
            />
          </div>

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
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium">
            How do you want to use RefConnect?
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setUsageType("candidate")}
              className={`rounded-lg border p-4 text-left ${
                usageType === "candidate"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <h2 className="font-semibold">I want referrals</h2>
              <p className="mt-1 text-sm text-gray-600">
                Browse jobs and request referrals from employees.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setUsageType("employee")}
              className={`rounded-lg border p-4 text-left ${
                usageType === "employee"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <h2 className="font-semibold">I can refer others</h2>
              <p className="mt-1 text-sm text-gray-600">
                Share open roles and manage referral requests.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setUsageType("both")}
              className={`rounded-lg border p-4 text-left ${
                usageType === "both"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <h2 className="font-semibold">Both</h2>
              <p className="mt-1 text-sm text-gray-600">
                Request referrals and also refer candidates.
              </p>
            </button>
          </div>
        </div>

        {includesEmployee && (
          <div>
            <label className="mb-1 block text-sm font-medium">Company</label>

            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Oracle / Google / Amazon"
              required
            />

            <p className="mt-1 text-xs text-gray-500">
              This is used when you post jobs or give referrals.
            </p>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">
            LinkedIn Profile
          </label>

          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="https://linkedin.com/in/your-profile"
          />
        </div>

        {includesCandidate && (
          <div>
            <label className="mb-1 block text-sm font-medium">
              Resume Link
            </label>

            <input
              type="url"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="https://drive.google.com/..."
            />

            <p className="mt-1 text-xs text-gray-500">
              Optional for now. You can also provide it while requesting a
              referral.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-white"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}