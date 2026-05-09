"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type SubmitEventHandler,
} from "react";

type UserRole = "candidate" | "employee";
type ResumeMode = "file" | "link";

type User = {
  id: string;
  name: string;
  email: string;
  roles?: UserRole[];
  role?: UserRole;
  company?: string;
  linkedinUrl?: string;
  resumeLink?: string;
};

type Props = {
  jobId: string;
  jobTitle: string;
  company: string;
  jobLink: string;
  jobOwnerId?: string;
  jobOwnerEmail?: string;
};

type ReferralRequest = {
  id: string;
  candidateId?: string;
  candidateName: string;
  candidateEmail?: string;
  candidateLinkedin?: string;
  candidateMessage?: string;
  jobId: string;
  jobTitle: string;
  company: string;
  jobLink: string;
  resumeLink?: string;
  resumeFileName?: string;
  resumeDataUrl?: string;
  linkedinLink: string;
  status: "pending" | "approved" | "rejected" | "applied";
  referralLink?: string;
  employeeMessage?: string;
};

function getUserRoles(user: User | null): UserRole[] {
  if (!user) return [];
  if (user.roles) return user.roles;
  if (user.role) return [user.role];
  return [];
}

const MAX_RESUME_SIZE_MB = 2;
const MAX_RESUME_SIZE_BYTES = MAX_RESUME_SIZE_MB * 1024 * 1024;

export default function RequestReferralModal({
  jobId,
  jobTitle,
  company,
  jobLink,
  jobOwnerId,
  jobOwnerEmail,
}: Props) {
  const [loadingUser, setLoadingUser] = useState(true);
  const [open, setOpen] = useState(false);

  const [resumeMode, setResumeMode] = useState<ResumeMode>("file");
  const [resumeLink, setResumeLink] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeDataUrl, setResumeDataUrl] = useState("");
  const [resumeError, setResumeError] = useState("");

  const [linkedinLink, setLinkedinLink] = useState("");
  const [message, setMessage] = useState("");

  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const roles = getUserRoles(currentUser);
  const canRequestReferral = roles.includes("candidate");

  const isOwnJob =
    currentUser &&
    ((jobOwnerId && currentUser.id === jobOwnerId) ||
      (jobOwnerEmail &&
        currentUser.email.toLowerCase() === jobOwnerEmail.toLowerCase()));

  useEffect(() => {
    const savedUser = localStorage.getItem("refconnect_current_user");

    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);

      setCurrentUser(parsedUser);

     setResumeLink(parsedUser.resumeLink || "");
setLinkedinLink(parsedUser.linkedinUrl || "");

if (parsedUser.resumeLink) {
  setResumeMode("link");
}
    }

    setLoadingUser(false);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const savedRequests = localStorage.getItem("refconnect_requests");

    if (!savedRequests) return;

    const existingRequests: ReferralRequest[] = JSON.parse(savedRequests);

    const duplicateRequest = existingRequests.some((request) => {
      const sameJob = request.jobId === jobId;

      const sameCandidateById =
        request.candidateId && request.candidateId === currentUser.id;

      const sameCandidateByEmail =
        request.candidateEmail?.toLowerCase() ===
        currentUser.email.toLowerCase();

      return sameJob && (sameCandidateById || sameCandidateByEmail);
    });

    setAlreadyRequested(duplicateRequest);
  }, [currentUser, jobId]);

  const handleResumeFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setResumeError("");
    setResumeFileName("");
    setResumeDataUrl("");

    if (!file) return;

    if (file.type !== "application/pdf") {
      setResumeError("Please upload a PDF file.");
      return;
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      setResumeError(
        `For this prototype, please upload a PDF smaller than ${MAX_RESUME_SIZE_MB}MB.`
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setResumeFileName(file.name);
      setResumeDataUrl(String(reader.result));
    };

    reader.onerror = () => {
      setResumeError("Could not read this file. Please try another PDF.");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please login or sign up before requesting a referral.");
      return;
    }

    if (!canRequestReferral) {
      alert("Your current account is not set up to request referrals.");
      return;
    }

    if (isOwnJob) {
      alert("You cannot request a referral for your own job post.");
      return;
    }

    const hasResumeFile = resumeMode === "file" && resumeFileName && resumeDataUrl;
    const hasResumeLink = resumeMode === "link" && resumeLink.trim();

    if (!hasResumeFile && !hasResumeLink) {
      alert("Please upload a resume PDF or paste a resume link.");
      return;
    }

    const savedRequests = localStorage.getItem("refconnect_requests");
    const existingRequests: ReferralRequest[] = savedRequests
      ? JSON.parse(savedRequests)
      : [];

    const duplicateRequest = existingRequests.some((request) => {
      const sameJob = request.jobId === jobId;

      const sameCandidateById =
        request.candidateId && request.candidateId === currentUser.id;

      const sameCandidateByEmail =
        request.candidateEmail?.toLowerCase() ===
        currentUser.email.toLowerCase();

      return sameJob && (sameCandidateById || sameCandidateByEmail);
    });

    if (duplicateRequest) {
      setAlreadyRequested(true);
      setOpen(false);
      return;
    }

    const newRequest: ReferralRequest = {
      id: Date.now().toString(),
      candidateId: currentUser.id,
      candidateName: currentUser.name,
      candidateEmail: currentUser.email,
      candidateLinkedin: linkedinLink,
      candidateMessage: message,
      jobId,
      jobTitle,
      company,
      jobLink,
      resumeLink: resumeMode === "link" ? resumeLink : undefined,
      resumeFileName: resumeMode === "file" ? resumeFileName : undefined,
      resumeDataUrl: resumeMode === "file" ? resumeDataUrl : undefined,
      linkedinLink,
      status: "pending",
    };

    try {
      localStorage.setItem(
        "refconnect_requests",
        JSON.stringify([newRequest, ...existingRequests])
      );
    } catch {
      alert(
        "Could not save the resume file in this prototype. Try using a resume link instead."
      );
      return;
    }

    setAlreadyRequested(true);

    alert("Referral request submitted!");

    setOpen(false);
    setMessage("");
  };

  if (loadingUser) {
    return (
      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        Checking account access...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-medium">Login required</p>

        <p className="mt-1 leading-6">
          Please{" "}
          <Link href="/auth/login" className="font-medium underline">
            login
          </Link>{" "}
          or{" "}
          <Link href="/auth/signup" className="font-medium underline">
            sign up
          </Link>{" "}
          to request a referral.
        </p>
      </div>
    );
  }

  if (!canRequestReferral) {
    return (
      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        This account is set up for giving referrals only. To request referrals,
        update your profile to candidate or both-role access.
      </div>
    );
  }

  if (isOwnJob) {
    return (
      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        You posted this job. You can manage it from your Employee Dashboard.
      </div>
    );
  }

  if (alreadyRequested) {
    return (
      <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        <p className="font-medium">Referral already requested</p>

        <p className="mt-1 leading-6">
          You have already requested a referral for this job. Track the status
          in your Candidate Dashboard.
        </p>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
      >
        Request Referral
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  Request Referral
                </h2>

                <p className="mt-1 text-sm text-gray-600">{jobTitle}</p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
              Requesting as{" "}
              <span className="font-semibold">{currentUser.name}</span>
              {currentUser.email && (
                <span className="text-blue-700"> · {currentUser.email}</span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Resume
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setResumeMode("file")}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                      resumeMode === "file"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Upload PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => setResumeMode("link")}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                      resumeMode === "link"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Paste Link
                  </button>
                </div>

                {resumeMode === "file" ? (
                  <div className="mt-3">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleResumeFileChange}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      PDF only. Prototype limit: {MAX_RESUME_SIZE_MB}MB.
                    </p>

                    {resumeFileName && (
                      <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                        Selected: {resumeFileName}
                      </p>
                    )}

                    {resumeError && (
                      <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                        {resumeError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-3">
                    <input
                      type="url"
                      value={resumeLink || ""}
                      onChange={(e) => setResumeLink(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-600"
                      placeholder="https://drive.google.com/..."
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Paste a public resume link if you prefer not to upload.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">
                  LinkedIn Profile
                </label>

                <input
                  type="url"
                  value={linkedinLink}
                  onChange={(e) => setLinkedinLink(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-600"
                  placeholder="https://linkedin.com/in/your-profile"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">
                  Message to employee{" "}
                  <span className="text-gray-500">(optional)</span>
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-600"
                  rows={4}
                  placeholder="Write a short note about why you are a good fit..."
                />
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
                <p className="font-medium text-gray-900">Original job post</p>

                <a
                  href={jobLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-blue-600 underline"
                >
                  Open original job post
                </a>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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