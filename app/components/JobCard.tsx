import Link from "next/link";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  daysLeft: number;
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h2 className="font-semibold text-lg">{job.title}</h2>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500">{job.location}</p>

      <p className="text-sm text-orange-500 mt-2">
        Expires in {job.daysLeft} days
      </p>

      <Link
        href={`/jobs/${job.id}`}
        className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        View & Request
      </Link>
    </div>
  );
}