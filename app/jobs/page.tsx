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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const savedJobs = localStorage.getItem("refconnect_jobs");

    if (savedJobs) {
      const parsedJobs: Job[] = JSON.parse(savedJobs);
      setJobs(parsedJobs.filter((job) => job.status === "active"));
    } else {
      localStorage.setItem("refconnect_jobs", JSON.stringify(fallbackJobs));
      setJobs(fallbackJobs);
    }
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