"use client";

import Link from "next/link";
import { useEffect, useState, type SubmitEventHandler } from "react";
import { useRouter } from "next/navigation";

type UserRole = "candidate" | "employee";
type UsageType = "candidate" | "employee" | "both";

type User = {
  id: string;
  name: string;
  email: string;
  roles?: UserRole[];
  role?: UserRole;
  company?: string;
  linkedinUrl?: string;
  resumeLink?: string;
};

function getUserRoles(user: User): UserRole[] {
  if (user.roles) {
    return user.roles;
  }

  if (user.role) {
    return [user.role];
  }

  return [];
}

function getUsageTypeFromRoles(roles: UserRole[]): UsageType {
  if (roles.includes("candidate") && roles.includes("employee")) {
    return "both";
  }

  if (roles.includes("employee")) {
    return "employee";
  }

  return "candidate";
}

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [usageType, setUsageType] = useState<UsageType>("candidate");
  const [company, setCompany] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  const includesCandidate =
    usageType === "candidate" || usageType === "both";

  const includesEmployee =
    usageType === "employee" || usageType === "both";

  useEffect(() => {
    const savedUser = localStorage.getItem("refconnect_current_user");

    if (!savedUser) {
      setLoading(false);
      router.push("/auth/login");
      return;
    }

    const parsedUser: User = JSON.parse(savedUser);
    const roles = getUserRoles(parsedUser);

    setCurrentUser(parsedUser);
    setName(parsedUser.name);
    setUsageType(getUsageTypeFromRoles(roles));
    setCompany(parsedUser.company || "");
    setLinkedinUrl(parsedUser.linkedinUrl || "");
    setResumeLink(parsedUser.resumeLink || "");

    setLoading(false);
  }, [router]);

  const getRoles = (): UserRole[] => {
    if (usageType === "both") {
      return ["candidate", "employee"];
    }

    return [usageType];
  };

  const handleSave: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!currentUser) {
      return;
    }

    if (includesEmployee && !company.trim()) {
      alert("Company is required for employee access.");
      return;
    }

    const roles = getRoles();

    const updatedUser: User = {
      ...currentUser,
      name,
      roles,
      company: includesEmployee ? company : undefined,
      linkedinUrl: linkedinUrl || undefined,
      resumeLink: includesCandidate ? resumeLink || undefined : undefined,
    };

    const savedUsers = localStorage.getItem("refconnect_users");
    const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];

    const userExists = users.some(
      (user) =>
        user.id === currentUser.id ||
        user.email.toLowerCase() === currentUser.email.toLowerCase()
    );

    const updatedUsers = userExists
      ? users.map((user) =>
          user.id === currentUser.id ||
          user.email.toLowerCase() === currentUser.email.toLowerCase()
            ? updatedUser
            : user
        )
      : [updatedUser, ...users];

    localStorage.setItem("refconnect_users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "refconnect_current_user",
      JSON.stringify(updatedUser)
    );

    window.dispatchEvent(new Event("refconnect_user_updated"));

    alert("Profile updated successfully.");
    router.push("/dashboard");
  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Login required</h1>

        <p className="mt-2 text-gray-600">
          Please login to update your profile.
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

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      <p className="mt-2 text-sm text-gray-600">
        Update how you want to use RefConnect.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>

            <input
              value={currentUser.email}
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-500"
              disabled
            />

            <p className="mt-1 text-xs text-gray-500">
              Email editing is disabled in this frontend demo.
            </p>
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
                Browse jobs and request referrals.
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
                Add jobs and manage referral requests.
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
                Request referrals and refer candidates.
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
          </div>
        )}

        <div className="flex justify-end gap-3 border-t pt-4">
          <Link href="/dashboard" className="rounded border px-4 py-2">
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}