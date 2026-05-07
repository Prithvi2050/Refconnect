"use client";

import RequireRole from "../../components/RequireRole";
import { useEffect, useState } from "react";

type UserRole = "candidate" | "employee";
type RequestStatus = "pending" | "approved" | "rejected" | "applied";

type User = {
  id: string;
  name: string;
  email: string;
  roles?: UserRole[];
  role?: UserRole;
};

type ReferralRequest = {
  id: string;
  candidateId?: string;
  candidateName?: string;
  candidateEmail?: string;
  jobId: string;
  jobTitle: string;
  company?: string;
  jobLink?: string;
  resumeLink?: string;
  linkedinLink?: string;
  status: RequestStatus;
  referralLink?: string;
  employeeMessage?: string;
};

function getStatusClasses(status: RequestStatus) {
  if (status === "pending") return "bg-yellow-100 text-yellow-700";
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "applied") return "bg-blue-100 text-blue-700";
  return "bg-red-100 text-red-700";
}

export default function CandidateDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allRequests, setAllRequests] = useState<ReferralRequest[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("refconnect_current_user");
    const savedRequests = localStorage.getItem("refconnect_requests");

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    if (savedRequests) {
      setAllRequests(JSON.parse(savedRequests));
    }
  }, []);

  const visibleRequests = allRequests.filter((request) => {
    if (!currentUser) return false;

    const sameCandidateById =
      request.candidateId && request.candidateId === currentUser.id;

    const sameCandidateByEmail =
      request.candidateEmail?.toLowerCase() ===
      currentUser.email.toLowerCase();

    return sameCandidateById || sameCandidateByEmail;
  });

  const saveRequests = (updatedRequests: ReferralRequest[]) => {
    setAllRequests(updatedRequests);

    localStorage.setItem(
      "refconnect_requests",
      JSON.stringify(updatedRequests)
    );
  };

  const markAsApplied = (requestId: string) => {
    const updatedRequests = allRequests.map((request) =>
      request.id === requestId
        ? { ...request, status: "applied" as RequestStatus }
        : request
    );

    saveRequests(updatedRequests);
  };

  return (
    <RequireRole role="candidate">
      <div className="p-6 max-w-5xl mx-auto">
        <div>
          <p className="text-sm text-gray-500">Candidate Dashboard</p>
          <h1 className="text-3xl font-bold">My Referral Requests</h1>
        </div>

        {visibleRequests.length === 0 ? (
          <p className="mt-6 text-gray-500">
            You have not requested any referrals yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-4">
            {visibleRequests.map((request) => (
              <div key={request.id} className="rounded-lg border p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {request.jobTitle}
                    </h2>

                    <p className="text-gray-600">
                      {request.company || "Company not available"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClasses(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>

                {request.status === "pending" && (
                  <p className="mt-4 text-sm text-gray-500">
                    Waiting for employee response.
                  </p>
                )}

                {request.status === "approved" && (
                  <div className="mt-4 space-y-3">
                    {request.employeeMessage && (
                      <p className="rounded bg-gray-50 p-3 text-sm text-gray-700">
                        {request.employeeMessage}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {request.referralLink && (
                        <a
                          href={request.referralLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block rounded bg-blue-600 px-4 py-2 text-white"
                        >
                          View Referral Link
                        </a>
                      )}

                      <button
                        onClick={() => markAsApplied(request.id)}
                        className="rounded border px-4 py-2"
                      >
                        Mark as Applied
                      </button>
                    </div>
                  </div>
                )}

                {request.status === "rejected" && (
                  <div className="mt-4">
                    {request.employeeMessage ? (
                      <p className="rounded bg-gray-50 p-3 text-sm text-gray-700">
                        {request.employeeMessage}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No message was provided.
                      </p>
                    )}
                  </div>
                )}

                {request.status === "applied" && (
                  <div className="mt-4 space-y-3">
                    {request.employeeMessage && (
                      <p className="rounded bg-gray-50 p-3 text-sm text-gray-700">
                        {request.employeeMessage}
                      </p>
                    )}

                    {request.referralLink && (
                      <a
                        href={request.referralLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block rounded bg-blue-600 px-4 py-2 text-white"
                      >
                        View Referral Link
                      </a>
                    )}

                    <p className="text-sm text-blue-600">
                      You have marked this referral as applied.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireRole>
  );
}