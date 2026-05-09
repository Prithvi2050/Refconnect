"use client";

import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";

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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const savedJobs = localStorage.getItem("refconnect_jobs");

    const loadedJobs: Job[] = savedJobs ? JSON.parse(savedJobs) : fallbackJobs;
    const normalizedJobs = normalizeJobs(loadedJobs);

    localStorage.setItem("refconnect_jobs", JSON.stringify(normalizedJobs));

    setJobs(normalizedJobs.filter((job) => job.status === "active"));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Open roles</p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
              Browse Jobs
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
              Explore active job posts shared by employees and request a
              referral with your resume, LinkedIn, and a short message.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm text-gray-500">Active jobs</p>
            <p className="text-2xl font-bold text-gray-950">{jobs.length}</p>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-950">
              No active jobs available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              There are no active job posts right now. Please check again later
              or ask an employee to add a role.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}