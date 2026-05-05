"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RequestReferralModal from "../../components/RequestReferralModal";

type JobStatus = "active" | "expired";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  jobLink: string;
  description?: string;
  daysLeft: number;
  status: JobStatus;
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

export default function JobDetailsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedJobs = localStorage.getItem("refconnect_jobs");

    let jobs: Job[] = [];

    if (savedJobs) {
      jobs = JSON.parse(savedJobs);
    } else {
      jobs = fallbackJobs;
      localStorage.setItem("refconnect_jobs", JSON.stringify(fallbackJobs));
    }

    const foundJob = jobs.find((item) => item.id === id);

    setJob(foundJob || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading job...</div>;
  }

  if (!job) {
    return <div className="p-6">Job not found</div>;
  }

  const isExpired = job.status === "expired" || job.daysLeft <= 0;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{job.title}</h1>

      <p className="text-gray-600 mt-1">{job.company}</p>
      <p className="text-sm text-gray-500">{job.location}</p>

      <p className="mt-4 text-gray-700">
        {job.description ||
          "This role was shared by an employee. Review the job link before requesting a referral."}
      </p>

      <div className="mt-4 rounded border p-4">
        <p className="text-sm font-medium">Job Link</p>

        <a
          href={job.jobLink}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          Open original job post
        </a>
      </div>

      {isExpired ? (
        <p className="mt-6 rounded bg-red-50 p-3 text-sm text-red-600">
          This job is no longer active. Referral requests are closed.
        </p>
      ) : (
        <>
          <p className="mt-4 text-orange-500">
            Expires in {job.daysLeft} days
          </p>

          <RequestReferralModal
            jobId={job.id}
            jobTitle={job.title}
            company={job.company}
            jobLink={job.jobLink}
          />
        </>
      )}
    </div>
  );
}