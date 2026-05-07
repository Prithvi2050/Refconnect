"use client";

import Link from "next/link";
import { useEffect, useState, type SubmitEventHandler } from "react";

type UserRole = "candidate" | "employee";

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
  resumeLink: string;
  linkedinLink: string;
  status: "pending" | "approved" | "rejected" | "applied";
  referralLink?: string;
  employeeMessage?: string;
};

function getUserRoles(user: User | null): UserRole[] {
  if (!user) return [];

  if (user.roles) {
    return user.roles;
  }

  if (user.role) {
    return [user.role];
  }

  return [];
}

export default function RequestReferralModal({
  jobId,
  jobTitle,
  company,
  jobLink,
  jobOwnerId,
  jobOwnerEmail,
}: Props) {

  const [open, setOpen] = useState(false);
  const [resumeLink, setResumeLink] = useState("");
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

      if (parsedUser.resumeLink) {
        setResumeLink(parsedUser.resumeLink);
      }

      if (parsedUser.linkedinUrl) {
        setLinkedinLink(parsedUser.linkedinUrl);
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const savedRequests = localStorage.getItem("refconnect_requests");

    if (!savedRequests) {
      return;
    }

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

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please login or sign up before requesting a referral.");
      return;
    }

    if (isOwnJob) {
  alert("You cannot request a referral for your own job post.");
  return;
}

    if (!canRequestReferral) {
      alert("Your current account is not set up to request referrals.");
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
      resumeLink,
      linkedinLink,
      status: "pending",
    };

    const updatedRequests = [newRequest, ...existingRequests];

    localStorage.setItem(
      "refconnect_requests",
      JSON.stringify(updatedRequests)
    );

    setAlreadyRequested(true);

    alert("Referral request submitted!");

    setOpen(false);
    setMessage("");
  };

  if (!currentUser) {
    return (
      <div className="mt-6 rounded border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        Please{" "}
        <Link href="/auth/login" className="underline">
          login
        </Link>{" "}
        or{" "}
        <Link href="/auth/signup" className="underline">
          sign up
        </Link>{" "}
        to request a referral.
      </div>
    );
  }

  if (!canRequestReferral) {
    return (
      <div className="mt-6 rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        This account is set up for giving referrals only. To request referrals,
        use a candidate or both-role account.
      </div>
    );
  }

  if (isOwnJob) {
  return (
    <div className="mt-6 rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
      You posted this job. You can manage it from your Employee Dashboard.
    </div>
  );
}

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

            <p className="mt-2 text-sm text-gray-500">
              Requesting as:{" "}
              <span className="font-medium text-gray-700">
                {currentUser.name}
              </span>
            </p>

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
                  Message to employee (optional)
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  rows={4}
                  placeholder="Write a short note about why you are a good fit..."
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