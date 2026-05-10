"use client";

import RequireRole from "../../components/RequireRole";
import { useEffect, useMemo, useState } from "react";

type UserRole = "candidate" | "employee";
type RequestStatus = "pending" | "approved" | "rejected" | "applied";
type StatusFilter = "all" | RequestStatus;

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
  resumeFileName?: string;
  resumeDataUrl?: string;
  linkedinLink?: string;
  status: RequestStatus;
  referralLink?: string;
  employeeMessage?: string;
};

const REQUESTS_PER_PAGE = 5;

const statusFilters: StatusFilter[] = [
  "all",
  "pending",
  "approved",
  "applied",
  "rejected",
];

function getStatusClasses(status: RequestStatus) {
  if (status === "pending") return "bg-yellow-100 text-yellow-700";
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "applied") return "bg-blue-100 text-blue-700";
  return "bg-red-100 text-red-700";
}

export default function CandidateDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allRequests, setAllRequests] = useState<ReferralRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  const visibleRequests = useMemo(() => {
    return allRequests.filter((request) => {
      if (!currentUser) return false;

      const sameCandidateById =
        request.candidateId && request.candidateId === currentUser.id;

      const sameCandidateByEmail =
        request.candidateEmail?.toLowerCase() ===
        currentUser.email.toLowerCase();

      return sameCandidateById || sameCandidateByEmail;
    });
  }, [allRequests, currentUser]);

  const filteredRequests = useMemo(() => {
    if (selectedStatus === "all") {
      return visibleRequests;
    }

    return visibleRequests.filter(
      (request) => request.status === selectedStatus
    );
  }, [visibleRequests, selectedStatus]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / REQUESTS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * REQUESTS_PER_PAGE;
  const endIndex = startIndex + REQUESTS_PER_PAGE;

  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  const showingStart = filteredRequests.length === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(endIndex, filteredRequests.length);

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

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  return (
    <RequireRole role="candidate">
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Candidate Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                My Referral Requests
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                Track your referral requests from pending to approved, rejected,
                or applied.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-sm text-gray-500">Total requests</p>
              <p className="text-2xl font-bold text-gray-950">
                {visibleRequests.length}
              </p>
            </div>
          </div>

          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((status) => {
                const isSelected = selectedStatus === status;

                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-600">
              Showing {showingStart}–{showingEnd} of {filteredRequests.length}{" "}
              request{filteredRequests.length === 1 ? "" : "s"}
            </p>

            {filteredRequests.length > REQUESTS_PER_PAGE && (
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          {filteredRequests.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h2 className="text-lg font-semibold text-gray-950">
                No referral requests found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                {selectedStatus === "all"
                  ? "You have not requested any referrals yet."
                  : `You do not have any ${selectedStatus} referral requests.`}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-4">
                {paginatedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-950">
                          {request.jobTitle}
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
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
                      <p className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                        Waiting for employee response.
                      </p>
                    )}

                    {request.status === "approved" && (
                      <div className="mt-4 space-y-3">
                        {request.employeeMessage && (
                          <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                            {request.employeeMessage}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3">
                          {request.referralLink && (
                            <a
                              href={request.referralLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              View Referral Link
                            </a>
                          )}

                          <button
                            onClick={() => markAsApplied(request.id)}
                            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Mark as Applied
                          </button>
                        </div>
                      </div>
                    )}

                    {request.status === "rejected" && (
                      <div className="mt-4">
                        {request.employeeMessage ? (
                          <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
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
                          <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                            {request.employeeMessage}
                          </p>
                        )}

                        {request.referralLink && (
                          <a
                            href={request.referralLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            View Referral Link
                          </a>
                        )}

                        <p className="text-sm font-medium text-blue-600">
                          You have marked this referral as applied.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredRequests.length > REQUESTS_PER_PAGE && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </RequireRole>
  );
}