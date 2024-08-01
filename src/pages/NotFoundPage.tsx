import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center flex-col gap-4">
      <h1 className="text-xl">404 Not found</h1>
      <Link className="underline" to={"/"}>
        Go to home page
      </Link>
    </div>
  );
}
