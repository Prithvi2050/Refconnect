

"use client";

import RequireRole from "../../components/RequireRole";

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
  expiresAt?: string;
  status: JobStatus;
  createdAt?: string;
  createdById?: string;
  createdByName?: string;
  createdByEmail?: string;
};

type UserRole = "candidate" | "employee";

type User = {
  id: string;
  name: string;
  email: string;
  roles?: UserRole[];
  role?: UserRole;
  company?: string;
};

type RequestStatus = "pending" | "approved" | "rejected" | "applied";

type ReferralRequest = {
  id: string;
  candidateId?: string;
  candidateName: string;
  candidateEmail?: string;
  candidateLinkedin?: string;
  candidateMessage?: string;
  jobId: string;
  jobTitle: string;
  jobLink: string;
  resumeLink?: string;
resumeFileName?: string;
resumeDataUrl?: string;
  linkedinLink: string;
  status: RequestStatus;
  referralLink?: string;
  employeeMessage?: string;
};
const JOBS_PER_PAGE = 5;
const REQUESTS_PER_PAGE = 8;
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
  if (status === "approved") return "bg-green-100 text-green-0";
  if (status === "applied") return "bg-blue-100 text-blue-700";
  return "bg-red-100 text-red-700";
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const createExpiryDate = () => {
  return new Date(Date.now() + SEVEN_DAYS_MS).toISOString();
};

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

export default function EmployeeDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [requests, setRequests] = useState<ReferralRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<"all" | RequestStatus>(
    "all"
  );
const [currentJobsPage, setCurrentJobsPage] = useState(1);
const [currentRequestsPage, setCurrentRequestsPage] = useState(1);
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
    const savedUser = localStorage.getItem("refconnect_current_user");
useEffect(() => {
  setCurrentRequestsPage(1);
}, [selectedFilter]);
if (savedUser) {
  setCurrentUser(JSON.parse(savedUser));
}
const savedJobs = localStorage.getItem("refconnect_jobs");

const loadedJobs: Job[] = savedJobs ? JSON.parse(savedJobs) : initialJobs;
const normalizedJobs = normalizeJobs(loadedJobs);

setJobs(normalizedJobs);
localStorage.setItem("refconnect_jobs", JSON.stringify(normalizedJobs));

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
  const normalizedJobs = normalizeJobs(updatedJobs);

  setJobs(normalizedJobs);
  localStorage.setItem("refconnect_jobs", JSON.stringify(normalizedJobs));
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

   if (!newJobTitle || !newJobLink) {
  return;
}

if (!currentUser || !currentUser.company) {
  alert("Please add your company in Profile before posting a job.");
  return;
}

const employeeCompany = currentUser.company;

const newJob: Job = {
  id: Date.now().toString(),
  title: newJobTitle,
  company: employeeCompany,
  location: newJobLocation || "Remote",
  description: newJobDescription,
  jobLink: newJobLink,
  daysLeft: 7,
  expiresAt: createExpiryDate(),
  status: "active",
  createdAt: new Date().toISOString(),
  createdById: currentUser.id,
  createdByName: currentUser.name,
  createdByEmail: currentUser.email,
};
    saveJobs([newJob, ...jobs]);
setCurrentJobsPage(1);
setNewJobTitle("");
setNewJobCompany(currentUser.company);
setNewJobLocation("");
setNewJobDescription("");
setNewJobLink("");
setIsAddJobOpen(false);
  };

 const reactivateJob = (jobId: string) => {
  const updatedJobs = jobs.map((job) =>
    job.id === jobId
      ? {
          ...job,
          status: "active" as JobStatus,
          daysLeft: 7,
          expiresAt: createExpiryDate(),
        }
      : job
  );

  saveJobs(updatedJobs);
};

  const deleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    saveJobs(updatedJobs);
    setCurrentJobsPage(1);
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

const myJobs = jobs.filter((job) => {
  if (!currentUser) return true;

  // Older demo jobs may not have createdById, so keep them visible for now.
  if (!job.createdById) return true;

  return job.createdById === currentUser.id;
});

const myJobIds = new Set(myJobs.map((job) => job.id));

const visibleRequests = requests.filter((request) =>
  myJobIds.has(request.jobId)
);

const filteredRequests =
  selectedFilter === "all"
    ? visibleRequests
    : visibleRequests.filter((request) => request.status === selectedFilter);

const activeJobsCount = myJobs.filter((job) => job.status === "active").length;

const pendingCount = visibleRequests.filter(
  (request) => request.status === "pending"
).length;

const approvedCount = visibleRequests.filter(
  (request) => request.status === "approved"
).length;

const appliedCount = visibleRequests.filter(
  (request) => request.status === "applied"
).length;

// My Jobs pagination
const totalJobPages = Math.max(1, Math.ceil(myJobs.length / JOBS_PER_PAGE));
const safeJobsPage = Math.min(currentJobsPage, totalJobPages);

const jobsStartIndex = (safeJobsPage - 1) * JOBS_PER_PAGE;
const jobsEndIndex = jobsStartIndex + JOBS_PER_PAGE;

const paginatedJobs = myJobs.slice(jobsStartIndex, jobsEndIndex);

const jobsShowingStart = myJobs.length === 0 ? 0 : jobsStartIndex + 1;
const jobsShowingEnd = Math.min(jobsEndIndex, myJobs.length);

// Requests pagination
const totalRequestPages = Math.max(
  1,
  Math.ceil(filteredRequests.length / REQUESTS_PER_PAGE)
);

const safeRequestsPage = Math.min(currentRequestsPage, totalRequestPages);

const requestsStartIndex = (safeRequestsPage - 1) * REQUESTS_PER_PAGE;
const requestsEndIndex = requestsStartIndex + REQUESTS_PER_PAGE;

const paginatedRequests = filteredRequests.slice(
  requestsStartIndex,
  requestsEndIndex
);

const requestsShowingStart =
  filteredRequests.length === 0 ? 0 : requestsStartIndex + 1;

const requestsShowingEnd = Math.min(
  requestsEndIndex,
  filteredRequests.length
);

const goToPreviousJobsPage = () => {
  setCurrentJobsPage((page) => Math.max(1, page - 1));
};

const goToNextJobsPage = () => {
  setCurrentJobsPage((page) => Math.min(totalJobPages, page + 1));
};

const goToPreviousRequestsPage = () => {
  setCurrentRequestsPage((page) => Math.max(1, page - 1));
};

const goToNextRequestsPage = () => {
  setCurrentRequestsPage((page) => Math.min(totalRequestPages, page + 1));
};

 return (
  <RequireRole role="employee">
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Employee Dashboard</p>
          <h1 className="text-3xl font-bold">Manage Referrals</h1>
        </div>

        <button
  onClick={() => {
    if (!currentUser?.company) {
      alert("Please add your company in Profile before posting a job.");
      return;
    }

    setNewJobCompany(currentUser.company);
    setIsAddJobOpen(true);
  }}
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
        <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
  <p className="text-sm text-gray-600">
    Showing {jobsShowingStart}–{jobsShowingEnd} of {myJobs.length} job
    {myJobs.length === 1 ? "" : "s"}
  </p>

  {myJobs.length > JOBS_PER_PAGE && (
    <p className="text-sm text-gray-500">
      Page {safeJobsPage} of {totalJobPages}
    </p>
  )}
</div>

{myJobs.length > JOBS_PER_PAGE && (
  <div className="mt-5 flex items-center justify-center gap-3">
    <button
      onClick={goToPreviousJobsPage}
      disabled={safeJobsPage === 1}
      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Previous
    </button>

    <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600">
      Page {safeJobsPage} of {totalJobPages}
    </div>

    <button
      onClick={goToNextJobsPage}
      disabled={safeJobsPage === totalJobPages}
      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}
        <div className="mt-4 grid gap-4">
          {paginatedJobs.map((job) => (
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
<div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
  <p className="text-sm text-gray-600">
    Showing {requestsShowingStart}–{requestsShowingEnd} of{" "}
    {filteredRequests.length} request
    {filteredRequests.length === 1 ? "" : "s"}
  </p>

  {filteredRequests.length > REQUESTS_PER_PAGE && (
    <p className="text-sm text-gray-500">
      Page {safeRequestsPage} of {totalRequestPages}
    </p>
  )}
</div>
{request.candidateEmail && (
  <p className="text-sm text-gray-500">{request.candidateEmail}</p>
)}
{filteredRequests.length > REQUESTS_PER_PAGE && (
  <div className="mt-5 flex items-center justify-center gap-3">
    <button
      onClick={goToPreviousRequestsPage}
      disabled={safeRequestsPage === 1}
      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Previous
    </button>

    <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600">
      Page {safeRequestsPage} of {totalRequestPages}
    </div>

    <button
      onClick={goToNextRequestsPage}
      disabled={safeRequestsPage === totalRequestPages}
      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}
<p className="text-sm text-gray-600">{request.jobTitle}</p>
                  

                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    {request.resumeDataUrl ? (
  <a
    href={request.resumeDataUrl}
    download={request.resumeFileName || "resume.pdf"}
    target="_blank"
    rel="noreferrer"
    className="text-blue-600 underline"
  >
    Resume PDF
  </a>
) : request.resumeLink ? (
  <a
    href={request.resumeLink}
    target="_blank"
    rel="noreferrer"
    className="text-blue-600 underline"
  >
    Resume Link
  </a>
) : (
  <span className="text-gray-400">No resume</span>
)}

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

                  {request.candidateMessage && (
  <p className="mt-3 rounded bg-blue-50 p-3 text-sm text-blue-800">
    Candidate note: {request.candidateMessage}
  </p>
)}

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

          <div className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-700">
            {currentUser?.company || "Company not set"}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Company is locked from your profile because employees can only post roles
            from their own company.
          </p>

          {!currentUser?.company && (
            <a
              href="/profile"
              className="mt-2 inline-block text-sm text-blue-600 underline"
            >
              Update company in Profile
            </a>
          )}
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
  </RequireRole>
  );
}