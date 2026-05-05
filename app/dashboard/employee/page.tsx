"use client";

import { useEffect, useState, type SubmitEventHandler } from "react";

type JobStatus = "active" | "expired";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  jobLink: string;
  daysLeft: number;
  status: JobStatus;
};

type RequestStatus = "pending" | "approved" | "rejected" | "applied";

type ReferralRequest = {
  id: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  jobLink: string;
  resumeLink: string;
  linkedinLink: string;
  status: RequestStatus;
  referralLink?: string;
  employeeMessage?: string;
};

const initialJobs: Job[] = [
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
    daysLeft: 0,
    status: "expired",
  },
];

const initialRequests: ReferralRequest[] = [
  {
    id: "1",
    candidateName: "Aarav Sharma",
    jobId: "1",
    jobTitle: "Software Engineer, Backend",
    jobLink: "https://example.com/google-job",
    resumeLink: "https://example.com/aarav-resume",
    linkedinLink: "https://linkedin.com/in/aarav",
    status: "pending",
  },
  {
    id: "2",
    candidateName: "Meera Iyer",
    jobId: "1",
    jobTitle: "Software Engineer, Backend",
    jobLink: "https://example.com/google-job",
    resumeLink: "https://example.com/meera-resume",
    linkedinLink: "https://linkedin.com/in/meera",
    status: "approved",
    referralLink: "https://example.com/google-referral",
    employeeMessage: "Profile looks good. Please apply using this link.",
  },
  {
    id: "3",
    candidateName: "Rohan Verma",
    jobId: "2",
    jobTitle: "SDE I",
    jobLink: "https://example.com/amazon-job",
    resumeLink: "https://example.com/rohan-resume",
    linkedinLink: "https://linkedin.com/in/rohan",
    status: "applied",
    referralLink: "https://example.com/amazon-referral",
    employeeMessage: "Referral shared. Candidate has applied.",
  },
  {
    id: "4",
    candidateName: "Ananya Rao",
    jobId: "2",
    jobTitle: "SDE I",
    jobLink: "https://example.com/amazon-job",
    resumeLink: "https://example.com/ananya-resume",
    linkedinLink: "https://linkedin.com/in/ananya",
    status: "rejected",
    employeeMessage: "This role needs stronger backend experience.",
  },
];

function getRequestStatusClasses(status: RequestStatus) {
  if (status === "pending") return "bg-yellow-100 text-yellow-700";
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "applied") return "bg-blue-100 text-blue-700";
  return "bg-red-100 text-red-700";
}

export default function EmployeeDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [requests, setRequests] = useState<ReferralRequest[]>([]);

  const [selectedFilter, setSelectedFilter] = useState<"all" | RequestStatus>(
    "all"
  );

  const [approveRequest, setApproveRequest] =
    useState<ReferralRequest | null>(null);

  const [rejectRequest, setRejectRequest] =
    useState<ReferralRequest | null>(null);

  const [referralLink, setReferralLink] = useState("");
  const [employeeMessage, setEmployeeMessage] = useState("");

  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
    const [newJobLocation, setNewJobLocation] = useState("");
    const [newJobDescription, setNewJobDescription] = useState("");
    const [newJobLink, setNewJobLink] = useState("");

  useEffect(() => {
  const savedJobs = localStorage.getItem("refconnect_jobs");

  if (savedJobs) {
    setJobs(JSON.parse(savedJobs));
  } else {
    setJobs(initialJobs);
    localStorage.setItem("refconnect_jobs", JSON.stringify(initialJobs));
  }

  const savedRequests = localStorage.getItem("refconnect_requests");

  if (savedRequests) {
    setRequests(JSON.parse(savedRequests));
  } else {
    setRequests(initialRequests);
    localStorage.setItem(
      "refconnect_requests",
      JSON.stringify(initialRequests)
    );
  }
}, []);

const saveJobs = (updatedJobs: Job[]) => {
  setJobs(updatedJobs);
  localStorage.setItem("refconnect_jobs", JSON.stringify(updatedJobs));
};

const saveRequests = (updatedRequests: ReferralRequest[]) => {
  setRequests(updatedRequests);
  localStorage.setItem(
    "refconnect_requests",
    JSON.stringify(updatedRequests)
  );
};

  const submitNewJob: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!newJobTitle || !newJobCompany || !newJobLink) {
      return;
    }

 const newJob: Job = {
  id: Date.now().toString(),
  title: newJobTitle,
  company: newJobCompany,
  location: newJobLocation || "Remote",
  description: newJobDescription,
  jobLink: newJobLink,
  daysLeft: 7,
  status: "active",
};

    saveJobs([newJob, ...jobs]);

setNewJobTitle("");
setNewJobCompany("");
setNewJobLocation("");
setNewJobDescription("");
setNewJobLink("");
setIsAddJobOpen(false);
  };

  const reactivateJob = (jobId: string) => {
    const updatedJobs = jobs.map((job) =>
      job.id === jobId
        ? { ...job, status: "active" as JobStatus, daysLeft: 7 }
        : job
    );

    saveJobs(updatedJobs);
  };

  const deleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    saveJobs(updatedJobs);
  };

  const openApproveModal = (request: ReferralRequest) => {
    setApproveRequest(request);
    setReferralLink(request.jobLink);
    setEmployeeMessage("");
  };

 const submitApprove = () => {
  if (!approveRequest || !referralLink) return;

  const updatedRequests = requests.map((request) =>
    request.id === approveRequest.id
      ? {
          ...request,
          status: "approved" as RequestStatus,
          referralLink,
          employeeMessage,
        }
      : request
  );

  saveRequests(updatedRequests);

  setApproveRequest(null);
  setReferralLink("");
  setEmployeeMessage("");
};

  const openRejectModal = (request: ReferralRequest) => {
    setRejectRequest(request);
    setEmployeeMessage("");
  };

  const submitReject = () => {
  if (!rejectRequest) return;

  const updatedRequests = requests.map((request) =>
    request.id === rejectRequest.id
      ? {
          ...request,
          status: "rejected" as RequestStatus,
          employeeMessage,
        }
      : request
  );

  saveRequests(updatedRequests);

  setRejectRequest(null);
  setEmployeeMessage("");
};

  const filteredRequests =
    selectedFilter === "all"
      ? requests
      : requests.filter((request) => request.status === selectedFilter);

  const activeJobsCount = jobs.filter((job) => job.status === "active").length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const appliedCount = requests.filter((r) => r.status === "applied").length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Employee Dashboard</p>
          <h1 className="text-3xl font-bold">Manage Referrals</h1>
        </div>

        <button
          onClick={() => setIsAddJobOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          + Add Job
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4 shadow-sm">
          <p className="text-sm text-gray-500">Active Jobs</p>
          <p className="text-2xl font-bold">{activeJobsCount}</p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending Requests</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold">{approvedCount}</p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <p className="text-sm text-gray-500">Applied</p>
          <p className="text-2xl font-bold">{appliedCount}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-bold">My Jobs</h2>

        <div className="mt-4 grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border p-5 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  {job.company} • {job.location}
                </p>

                {job.status === "active" ? (
                  <p className="mt-1 text-sm text-green-600">
                    Active • Expires in {job.daysLeft} days
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">Expired</p>
                )}
              </div>

              <div className="flex gap-3">
                <a
                  href={job.jobLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border px-4 py-2 text-sm"
                >
                  View Job
                </a>

                {job.status === "expired" && (
                  <button
                    onClick={() => reactivateJob(job.id)}
                    className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
                  >
                    Reactivate
                  </button>
                )}

                <button
                  onClick={() => deleteJob(job.id)}
                  className="rounded border px-4 py-2 text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Requests Received</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {["all", "pending", "approved", "applied", "rejected"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() =>
                  setSelectedFilter(filter as "all" | RequestStatus)
                }
                className={`rounded-full px-4 py-2 text-sm capitalize ${
                  selectedFilter === filter
                    ? "bg-blue-600 text-white"
                    : "border text-gray-600"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>

        <div className="mt-4 grid gap-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="rounded-lg border p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-semibold">{request.candidateName}</h3>
                  <p className="text-sm text-gray-600">{request.jobTitle}</p>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    <a
                      href={request.resumeLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Resume
                    </a>

                    <a
                      href={request.linkedinLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      LinkedIn
                    </a>

                    <a
                      href={request.jobLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Job Link
                    </a>
                  </div>

                  {request.employeeMessage && (
                    <p className="mt-3 rounded bg-gray-50 p-3 text-sm text-gray-700">
                      {request.employeeMessage}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getRequestStatusClasses(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>

                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openApproveModal(request)}
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontWeight: "bold",
                        }}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => openRejectModal(request)}
                        className="rounded border border-red-600 px-4 py-2 text-sm font-medium text-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status === "approved" && request.referralLink && (
                    <a
                      href={request.referralLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Referral Link
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isAddJobOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
      <h2 className="text-xl font-bold">Add New Job</h2>

      <p className="mt-1 text-sm text-gray-600">
        This job will be active for 7 days.
      </p>

      <form onSubmit={submitNewJob} className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Job Title
          </label>

          <input
            value={newJobTitle}
            onChange={(e) => setNewJobTitle(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Software Engineer, Backend"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Company
          </label>

          <input
            value={newJobCompany}
            onChange={(e) => setNewJobCompany(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Google"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Location
          </label>

          <input
            value={newJobLocation}
            onChange={(e) => setNewJobLocation(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Bangalore / Remote"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Job Description
          </label>

          <textarea
            value={newJobDescription}
            onChange={(e) => setNewJobDescription(e.target.value)}
            className="w-full rounded border px-3 py-2"
            rows={4}
            placeholder="Briefly describe the role, responsibilities, requirements, or eligibility..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Job Link
          </label>

          <input
            type="url"
            value={newJobLink}
            onChange={(e) => setNewJobLink(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="https://..."
            required
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={() => setIsAddJobOpen(false)}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Add Job
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {approveRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold">Approve Referral Request</h2>

            <p className="mt-1 text-sm text-gray-600">
              {approveRequest.candidateName} • {approveRequest.jobTitle}
            </p>

            <div className="mt-4 rounded bg-gray-50 p-3 text-sm">
              Job link:{" "}
              <a
                href={approveRequest.jobLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                open job post
              </a>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">
                Referral Link
              </label>

              <input
                type="url"
                value={referralLink}
                onChange={(e) => setReferralLink(e.target.value)}
                className="w-full rounded border px-3 py-2"
                placeholder="https://..."
                required
              />
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">
                Message (optional)
              </label>

              <textarea
                value={employeeMessage}
                onChange={(e) => setEmployeeMessage(e.target.value)}
                className="w-full rounded border px-3 py-2"
                rows={4}
                placeholder="Write a note to the candidate..."
              />
            </div>

            <div
              style={{
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid #ddd",
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setApproveRequest(null)}
                style={{
                  padding: "10px 16px",
                  border: "1px solid #999",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                Cancel
              </button>

              <button
                onClick={submitApprove}
                style={{
                  padding: "10px 16px",
                  borderRadius: "6px",
                  backgroundColor: "green",
                  color: "white",
                  fontWeight: "bold",
                  border: "2px solid darkgreen",
                }}
              >
                Approve & Send
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold">Reject Referral Request</h2>
            <p className="mt-1 text-sm text-gray-600">
              {rejectRequest.candidateName} • {rejectRequest.jobTitle}
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Message (optional)
              </label>
              <textarea
                value={employeeMessage}
                onChange={(e) => setEmployeeMessage(e.target.value)}
                className="w-full rounded border px-3 py-2"
                rows={4}
                placeholder="Write a reason or helpful note..."
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setRejectRequest(null)}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={submitReject}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                Reject & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}