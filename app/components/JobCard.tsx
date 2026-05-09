import Link from "next/link";

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
  createdByName?: string;
};

export default function JobCard({ job }: { job: Job }) {
  const expiryText =
    job.daysLeft === 1 ? "Expires in 1 day" : `Expires in ${job.daysLeft} days`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-950">{job.title}</h2>

          <p className="mt-1 text-sm text-gray-600">
            {job.company} • {job.location || "Remote"}
          </p>
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          Active
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-600">
        {job.description ||
          "This role was shared by an employee. Open the details page to review the job and request a referral."}
      </p>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
        <p className="text-sm font-medium text-orange-600">{expiryText}</p>

        <Link
          href={`/jobs/${job.id}`}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          View & Request
        </Link>
      </div>
    </div>
  );
}