"use client";

import { useEffect, useState } from "react";

type Props = {
  jobId: string;
  jobTitle: string;
  company: string;
  jobLink: string;
};

type ReferralRequest = {
  id: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  company: string;
  jobLink: string;
  resumeLink: string;
  linkedinLink: string;
  status: "pending" | "approved" | "rejected" | "applied";
  referralLink?: string;
  employeeMessage?: string;
};

export default function RequestReferralModal({
  jobId,
  jobTitle,
  company,
  jobLink,
}: Props) {
  const [open, setOpen] = useState(false);
  const [resumeLink, setResumeLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [message, setMessage] = useState("");
  const [alreadyRequested, setAlreadyRequested] = useState(false);

  useEffect(() => {
    const savedRequests = localStorage.getItem("refconnect_requests");

    if (!savedRequests) {
      return;
    }

    const existingRequests: ReferralRequest[] = JSON.parse(savedRequests);

    const duplicateRequest = existingRequests.some(
      (request) =>
        request.jobId === jobId && request.candidateName === "Demo Candidate"
    );

    setAlreadyRequested(duplicateRequest);
  }, [jobId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const savedRequests = localStorage.getItem("refconnect_requests");
    const existingRequests: ReferralRequest[] = savedRequests
      ? JSON.parse(savedRequests)
      : [];

    const duplicateRequest = existingRequests.some(
      (request) =>
        request.jobId === jobId && request.candidateName === "Demo Candidate"
    );

    if (duplicateRequest) {
      setAlreadyRequested(true);
      setOpen(false);
      return;
    }

    const newRequest: ReferralRequest = {
      id: Date.now().toString(),
      candidateName: "Demo Candidate",
      jobId,
      jobTitle,
      company,
      jobLink,
      resumeLink,
      linkedinLink,
      status: "pending",
      employeeMessage: message,
    };

    const updatedRequests = [newRequest, ...existingRequests];

    localStorage.setItem(
      "refconnect_requests",
      JSON.stringify(updatedRequests)
    );

    setAlreadyRequested(true);

    alert("Referral request submitted!");

    setOpen(false);
    setResumeLink("");
    setLinkedinLink("");
    setMessage("");
  };

  if (alreadyRequested) {
    return (
      <div className="mt-6 rounded border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        You have already requested a referral for this job. Track the status in
        your Candidate Dashboard.
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 bg-blue-600 text-white px-5 py-2 rounded"
      >
        Request Referral
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold">Request Referral</h2>
            <p className="mt-1 text-sm text-gray-600">{jobTitle}</p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Resume Link
                </label>
                <input
                  type="url"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  LinkedIn Link
                </label>
                <input
                  type="url"
                  value={linkedinLink}
                  onChange={(e) => setLinkedinLink(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  placeholder="https://linkedin.com/in/..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  rows={4}
                  placeholder="Write a short note..."
                />
              </div>

              <div className="text-sm text-gray-500">
                Job link:{" "}
                <a
                  href={jobLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  open job post
                </a>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded border px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}