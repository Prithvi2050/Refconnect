"use client";

import { useEffect, useMemo, useState } from "react";
import JobCard from "../components/JobCard";

type JobStatus = "active" | "expired";
type SortOption = "newest" | "expiring" | "company";

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

function getUniqueValues(jobs: Job[], field: "location" | "company") {
  return Array.from(
    new Set(
      jobs
        .map((job) => job[field])
        .filter(Boolean)
        .map((value) => value.trim())
    )
  ).sort((a, b) => a.localeCompare(b));
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    const savedJobs = localStorage.getItem("refconnect_jobs");

    const loadedJobs: Job[] = savedJobs ? JSON.parse(savedJobs) : fallbackJobs;
    const normalizedJobs = normalizeJobs(loadedJobs);

    localStorage.setItem("refconnect_jobs", JSON.stringify(normalizedJobs));

    setJobs(normalizedJobs.filter((job) => job.status === "active"));
  }, []);

  const locations = useMemo(() => getUniqueValues(jobs, "location"), [jobs]);
  const companies = useMemo(() => getUniqueValues(jobs, "company"), [jobs]);

  const filteredJobs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = jobs.filter((job) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          job.title,
          job.company,
          job.location,
          job.description,
          job.createdByName,
          job.createdByEmail,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesLocation =
        selectedLocation === "all" || job.location === selectedLocation;

      const matchesCompany =
        selectedCompany === "all" || job.company === selectedCompany;

      return matchesSearch && matchesLocation && matchesCompany;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "expiring") {
        return a.daysLeft - b.daysLeft;
      }

      if (sortBy === "company") {
        return a.company.localeCompare(b.company);
      }

      const aTime = a.createdAt
        ? new Date(a.createdAt).getTime()
        : Number(a.id) || 0;

      const bTime = b.createdAt
        ? new Date(b.createdAt).getTime()
        : Number(b.id) || 0;

      return bTime - aTime;
    });
  }, [jobs, searchTerm, selectedLocation, selectedCompany, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("all");
    setSelectedCompany("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm || selectedLocation !== "all" || selectedCompany !== "all";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Referral opportunities
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
              Browse Jobs
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
              Find roles shared by employees and request referrals from the
              referrer who posted the opportunity.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm text-gray-500">Showing</p>
            <p className="text-2xl font-bold text-gray-950">
              {filteredJobs.length}
              <span className="ml-1 text-sm font-medium text-gray-500">
                of {jobs.length}
              </span>
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Search
            </label>

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600"
              placeholder="Search by role, company, employee, location, or keyword..."
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Location
              </label>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-600"
              >
                <option value="all">All locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Company
              </label>

              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-600"
              >
                <option value="all">All companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Sort
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-600"
              >
                <option value="newest">Newest</option>
                <option value="expiring">Expiring soon</option>
                <option value="company">Company A-Z</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear filters
              </button>
            </div>
          </div>
        </section>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredJobs.length} active referral{" "}
            {filteredJobs.length === 1 ? "opportunity" : "opportunities"}
          </p>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-950">
              No matching jobs found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              Try changing your search or filters. You can also browse all
              active referral opportunities.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}