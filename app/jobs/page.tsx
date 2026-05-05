"use client";

import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  jobLink: string;
  daysLeft: number;
  expiresAt?: string;
  status: "active" | "expired";
};

const fallbackJobs: Job[] = [
  {
    id: "1",
    title: "Software Engineer, Backend",
    company: "Google",
    location: "Bangalore",
    jobLink: "https://example.com/google-job",
    daysLeft: 3,
    status: "active",
  },
  {
    id: "2",
    title: "SDE I",
    company: "Amazon",
    location: "Hyderabad",
    jobLink: "https://example.com/amazon-job",
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

const normalizeJobs = (jobList: Job[]) => {
  return jobList.map((job) => {
    const daysLeft = getDaysLeft(job);

    return {
      ...job,
      daysLeft,
      status: daysLeft <= 0 ? "expired" as const : "active" as const,
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No active jobs available right now.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}