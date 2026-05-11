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
  roles: UserRole[];
  company?: string;
  linkedinUrl?: string;
  resumeLink?: string;
};

const usageOptions: {
  value: UsageType;
  title: string;
  description: string;
}[] = [
  {
    value: "candidate",
    title: "I want referrals",
    description: "Browse jobs, request referrals, and track your status.",
  },
  {
    value: "employee",
    title: "I can refer others",
    description: "Post jobs from your company and manage referral requests.",
  },
  {
    value: "both",
    title: "Both",
    description: "Request referrals for yourself and refer candidates too.",
  },
];

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [usageType, setUsageType] = useState<UsageType>("candidate");
  const [employeeIntent, setEmployeeIntent] = useState(false);
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
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const intent = params.get("intent");

  if (intent === "employee") {
    setUsageType("employee");
    setEmployeeIntent(true);
  }
}, []);
  const handleSignup: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (includesEmployee && !company.trim()) {
      alert("Company is required for employee access.");
      return;
    }
    if (employeeIntent && usageType === "candidate") {
  alert("To share a job, please choose Employee or Both.");
  return;
}
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

    localStorage.setItem("refconnect_users", JSON.stringify([newUser, ...users]));
    localStorage.setItem("refconnect_current_user", JSON.stringify(newUser));

    window.dispatchEvent(new Event("refconnect_user_updated"));

    if (employeeIntent && roles.includes("employee")) {
  router.push("/dashboard/employee?openAddJob=true");
} else if (roles.includes("candidate") && roles.includes("employee")) {
  router.push("/dashboard");
} else if (roles.includes("employee")) {
  router.push("/dashboard/employee");
} else {
  router.push("/jobs");
}
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-medium text-blue-600">
            Create your account
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
  {employeeIntent
    ? "Create your account to share a job"
    : "How do you want to use RefConnect?"}
</h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600">
  {employeeIntent
    ? "Set up your employee profile so you can share roles from your company and manage referral requests."
    : "Choose how you want to start. You can request referrals, refer candidates, or do both."}
</p>
        </div>

        <form
          onSubmit={handleSignup}
          className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-900">
              Select your usage
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              {usageOptions.map((option) => {
                const isSelected = usageType === option.value;
                  const isDisabled = employeeIntent && option.value === "candidate";
                return (
                  <button
  key={option.value}
  type="button"
  disabled={isDisabled}
  onClick={() => {
    if (isDisabled) return;
    setUsageType(option.value);
  }}
  className={`rounded-2xl border p-5 text-left transition ${
                      isDisabled
  ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
  : isSelected
    ? "border-blue-600 bg-blue-50 shadow-sm"
    : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {option.value === "candidate" && "C"}
                      {option.value === "employee" && "E"}
                      {option.value === "both" && "B"}
                    </div>

                    <h2 className="font-semibold text-gray-950">
                      {option.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {option.description}
                    </p>

                    {isDisabled && (
  <p className="mt-3 text-xs font-medium text-gray-500">
    Not available when sharing a job.
  </p>
)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-600"
                placeholder="Prithvi"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-600"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {includesEmployee && (
            <div className="mt-5">
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Company
              </label>

              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-600"
                placeholder="Oracle / Google / Amazon"
                required
              />

              <p className="mt-1 text-xs text-gray-500">
                Employees can only post jobs from their profile company.
              </p>
            </div>
          )}

          <div className="mt-5">
            <label className="mb-1 block text-sm font-medium text-gray-900">
              LinkedIn Profile
            </label>

            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-600"
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>

          {includesCandidate && (
            <div className="mt-5">
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Resume Link
              </label>

              <input
                type="url"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-600"
                placeholder="https://drive.google.com/..."
              />

              <p className="mt-1 text-xs text-gray-500">
                Optional for now. You can also add it while requesting a
                referral.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
  href={employeeIntent ? "/auth/login?intent=employee" : "/auth/login"}
  className="text-blue-600 underline"
>
  Login
</Link>
            </p>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {employeeIntent ? "Continue to Share Job" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}