import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getPostById } from "../services/posts";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function PostDetailsPage() {
  const { id } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostById(Number(id)).then((res) => res.data),
  });

  return (
    <div className="p-5 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl mb-5">Post details</h1>

      <div className="bg-gray-700 rounded-lg p-3 max-w-[600px]">
        {isLoading && <LoadingSpinner blur />}

        <div>
          <h1 className="text-2xl mb-4">{post?.title}</h1>
          <p>{post?.body}</p>
        </div>
      </div>

      <Link className="mt-10 block underline text-blue-500" to={"/"}>
        Back to posts
      </Link>
    </div>
  );
}
