"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RequestReferralModal from "../../components/RequestReferralModal";

type JobStatus = "active" | "expired";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  jobLink: string;
  daysLeft: number;
  expiresAt?: string;
  status: JobStatus;
  createdAt?: string;
  createdById?: string;
  createdByName?: string;
  createdByEmail?: string;
};

const fallbackJobs: Job[] = [
  {
    id: "1",
    title: "Software Engineer, Backend",
    company: "Google",
    location: "Bangalore",
    jobLink: "https://example.com/google-job",
    description:
      "Build scalable backend systems and APIs for internal and external products.",
    daysLeft: 3,
    status: "active",
    createdAt: "2026-05-01T10:00:00.000Z",
    createdByName: "Rahul Sharma",
  },
  {
    id: "2",
    title: "SDE I",
    company: "Amazon",
    location: "Hyderabad",
    jobLink: "https://example.com/amazon-job",
    description:
      "Work on customer-facing systems and improve product reliability.",
    daysLeft: 5,
    status: "active",
    createdAt: "2026-05-02T10:00:00.000Z",
    createdByName: "Ananya Rao",
  },
];

const getDaysLeft = (job: Job) => {
  if (!job.expiresAt) {
    return job.daysLeft;
  }

  const diffMs = new Date(job.expiresAt).getTime() - Date.now();

  return Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
};

const normalizeJobs = (jobList: Job[]): Job[] => {
  return jobList.map((job): Job => {
    const daysLeft = getDaysLeft(job);

    return {
      ...job,
      daysLeft,
      status: (daysLeft <= 0 ? "expired" : "active") as JobStatus,
    };
  });
};

export default function JobDetailsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedJobs = localStorage.getItem("refconnect_jobs");

    const loadedJobs: Job[] = savedJobs ? JSON.parse(savedJobs) : fallbackJobs;
    const normalizedJobs = normalizeJobs(loadedJobs);

    localStorage.setItem("refconnect_jobs", JSON.stringify(normalizedJobs));

    const foundJob = normalizedJobs.find((item) => item.id === id);

    setJob(foundJob || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          Loading job...
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-950">Job not found</h1>

          <p className="mt-2 text-sm text-gray-600">
            This job may have been deleted or is no longer available.
          </p>

          <Link
            href="/jobs"
            className="mt-5 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Browse Jobs
          </Link>
        </div>
      </main>
    );
  }

  const isExpired = job.status === "expired" || job.daysLeft <= 0;
  const referrerName = job.createdByName || "RefConnect referrer";

  const expiryText =
    job.daysLeft === 1 ? "Expires in 1 day" : `Expires in ${job.daysLeft} days`;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/jobs"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Browse Jobs
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    {isExpired ? "Expired" : "Active"}
                  </span>

                  {!isExpired && (
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                      {expiryText}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-gray-950">
                  {job.title}
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                  {job.company} • {job.location || "Remote"}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  Shared by{" "}
                  <span className="font-medium text-gray-800">
                    {referrerName}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-950">
                About this role
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                {job.description ||
                  "This role was shared by an employee. Review the original job post and request a referral if your profile matches the opportunity."}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="text-sm font-semibold text-gray-950">
                Original job post
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Open the official job link to review the full description before
                requesting a referral.
              </p>

              <a
                href={job.jobLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-medium text-blue-600 underline"
              >
                Open original job post
              </a>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-950">
                Referral request
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Send your resume, LinkedIn profile, and a short note to request
                a referral from the employee who shared this role.
              </p>

              {isExpired ? (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  This job is no longer active. Referral requests are closed.
                </div>
              ) : (
                <RequestReferralModal
                  jobId={job.id}
                  jobTitle={job.title}
                  company={job.company}
                  jobLink={job.jobLink}
                  jobOwnerId={job.createdById}
                  jobOwnerEmail={job.createdByEmail}
                />
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-950">
                About the referrer
              </h2>

              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="font-medium text-gray-950">{referrerName}</p>

                <p className="mt-1 text-sm text-gray-600">
                  Shared this role at {job.company}.
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                RefConnect keeps the referral request structured so employees
                can review candidate details without messy DMs.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
