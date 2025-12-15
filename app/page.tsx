import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          SplitEase
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Expense splitting made easy for flatmates
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
