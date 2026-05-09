import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <section className="mx-auto max-w-4xl text-center">
        <p className="mb-4 text-sm font-medium text-blue-600">
          RefConnect Prototype
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-6xl">
          Referrals, organized.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
          RefConnect helps candidates request job referrals and helps employees
          manage referral requests in one clean workflow.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/auth/signup"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Get Started
          </Link>

          <Link
            href="/jobs"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Browse Jobs
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Currently in prototype mode — try the flow and share feedback.
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-950">
              For Candidates
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Browse open roles, request referrals with your profile details,
              and track whether your request is pending, approved, rejected, or
              applied.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-950">
              For Employees
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Post jobs from your company, review referral requests, approve
              with a referral link, or reject with optional feedback.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-4xl rounded-2xl bg-gray-50 p-6">
        <p className="text-sm font-medium text-gray-500">Simple flow</p>

        <div className="mt-4 grid gap-3 text-sm font-medium text-gray-800 md:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">Find job</div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            Request referral
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            Employee reviews
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            Candidate applies
          </div>
        </div>
      </section>
    </main>
  );
}