import Link from "next/link";

function UserPlusIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      className="h-9 w-9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M2 13h20" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22 11 13 2 9 22 2Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

const flowSteps = [
  {
    number: "1",
    title: "Find job",
    description: "Browse jobs posted by employees.",
    icon: <SearchIcon />,
  },
  {
    number: "2",
    title: "Request referral",
    description: "Submit your profile and request a referral.",
    icon: <SendIcon />,
  },
  {
    number: "3",
    title: "Employee reviews",
    description: "Employees review and approve or reject.",
    icon: <UserIcon />,
  },
  {
    number: "4",
    title: "Candidate applies",
    description: "Get the referral link and apply with confidence.",
    icon: <CheckIcon />,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto flex min-h-[430px] max-w-6xl flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 md:text-5xl">
          Referrals,{" "}
          <span className="text-blue-600">organized.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
          A simple way for candidates to request referrals and employees to
          manage them in one clean workflow.
        </p>

       <div className="mt-8 flex w-full max-w-2xl flex-col items-center justify-center gap-4 md:flex-row">
          <Link
            href="/auth/signup"
            className="flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 text-lg font-semibold text-white shadow-sm hover:bg-blue-700 md:w-[300px]"
          >
            <UserPlusIcon />
            Get Started
          </Link>

          <Link
            href="/jobs"
            className="flex h-16 w-full items-center justify-center gap-3 rounded-xl border border-gray-900 bg-white px-6 text-lg font-semibold text-gray-950 hover:bg-gray-50 md:w-[300px]"
          >
            <BriefcaseIcon />
            Browse Jobs
          </Link>
        </div>
      </section>

      <section className="border-t bg-gray-50 px-6 py-10">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.6fr]">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">
              What is RefConnect?
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-600">
              RefConnect helps candidates discover opportunities and request job
              referrals in a structured way. Employees can post roles, review
              requests, and share referral links — all in one place.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <ShieldIcon />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">
                    Structured & Transparent
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    No more messy DMs. Everything is tracked.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <LockIcon />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">
                    Private & Secure
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Candidate details are shared only for referral requests.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-950">Simple flow</h2>

            <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start">
              {flowSteps.map((step, index) => (
                <div key={step.number} className="flex flex-1 flex-col items-center text-center">
                  <div className="flex items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      {step.icon}
                    </div>

                    {index !== flowSteps.length - 1 && (
                      <div className="mx-6 hidden h-px w-16 border-t-2 border-dashed border-gray-300 lg:block" />
                    )}
                  </div>

                  <p className="mt-6 text-xl font-bold text-blue-600">
                    {step.number}
                  </p>

                  <h3 className="mt-4 font-semibold text-gray-950">
                    {step.title}
                  </h3>

                  <p className="mt-2 max-w-40 text-sm leading-6 text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}