import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
      <p className="text-2xl md:text-3xl font-semibold text-gray-600 mt-4">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go back home
      </Link>
    </div>
  );
};
export default Error;
