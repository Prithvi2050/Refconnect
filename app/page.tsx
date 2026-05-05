export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">
        Get Referred. <span className="text-blue-600">Get Hired.</span>
      </h1>

      <p className="text-gray-600 mb-6">
        A platform to request and manage job referrals easily.
      </p>

      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          I’m a Candidate
        </button>

        <button className="border px-6 py-2 rounded-lg">
          I’m an Employee
        </button>
      </div>
    </main>
  );
}
