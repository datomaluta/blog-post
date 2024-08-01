import { useMutation, useQuery } from "@tanstack/react-query";
import { deletePost, getPosts } from "../services/posts";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ModalWrapper from "../components/ui/ModalWrapper";
import CreatePostModal from "../components/post/CreatePostModal";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Pagination from "../components/ui/Pagination";

const HomePage = () => {
  const [createPostModalIsOpen, setCreatePostModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [chosenPost, setChosenPost] = useState<{
    id: number;
    title: string;
    body: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<
    { id: number; title: string; body: string }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["posts", currentPage, searchParams.get("search")],
    queryFn: () =>
      getPosts({ page: searchParams.get("search") ? "" : currentPage }).then(
        (res) => res.data
      ),
  });

  useEffect(() => {
    if (isSuccess) {
      setPosts(data);
    }
  }, [isSuccess, data]);

  const { mutate: deletePostMutate, isPending: deletePostIsPending } =
    useMutation({
      mutationFn: deletePost,
      onSuccess: () => {
        setDeleteModalIsOpen(false);
        setPosts(posts.filter((post) => post.id !== chosenPost?.id));
        toast.success("Post deleted successfully");
      },
      onError: () => {
        toast.error("Something went wrong with post delete!");
      },
    });

  const handleAddPost = (post: { id: number; title: string; body: string }) => {
    setCreatePostModalIsOpen(false);
    setPosts([post, ...posts]);
  };

  const filteredPosts = searchParams.get("search")
    ? posts?.filter((post: { title: string; body: string }) =>
        post.title
          .toLowerCase()
          .includes(searchParams.get("search")?.toLowerCase() || "")
      )
    : posts;

  return (
    <>
      <Toaster position="bottom-right" />{" "}
      <div className="p-5 bg-gray-900 text-white min-h-screen">
        <div className="flex justify-between items-center  mb-6">
          <button
            onClick={() => {
              setSearchParams({});
              setSearchTerm("");
            }}
            className="text-3xl md:text-xl"
          >
            List of posts
          </button>
          <button
            onClick={() => setCreatePostModalIsOpen(true)}
            className="bg-blue-800 px-4 py-2 rounded-lg"
          >
            Add post
          </button>
        </div>

        <div className="mb-12 flex gap-3">
          <input
            placeholder="Search here..."
            type="text"
            className="input-with-no-bg"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button
            onClick={() => {
              if (searchTerm) {
                setSearchParams({ search: searchTerm });
              }
            }}
            className="border border-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </div>

        <AnimatePresence>
          {createPostModalIsOpen && (
            <ModalWrapper setModalIsVisible={setCreatePostModalIsOpen}>
              <CreatePostModal onAddPost={handleAddPost} />
            </ModalWrapper>
          )}

          {deleteModalIsOpen && (
            <ModalWrapper setModalIsVisible={setDeleteModalIsOpen}>
              <p className="text-center text-xl">
                Are you sure you want to delete this post?
              </p>
              <div className="flex justify-center gap-6 mt-6">
                <button
                  onClick={() => deletePostMutate(chosenPost?.id as number)}
                  className="bg-red-500 px-3 py-2 rounded-lg"
                >
                  {deletePostIsPending ? "Deleting..." : "Delete"}
                </button>
                <button>Cancel</button>
              </div>
            </ModalWrapper>
          )}
        </AnimatePresence>

        {isLoading && <LoadingSpinner blur />}

        <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 min-h-screen ">
          {filteredPosts?.length > 0 && !isLoading ? (
            filteredPosts?.map(
              (post: { id: number; title: string; body: string }) => (
                <div
                  key={post.id}
                  className="group relative flex flex-col h-full  justify-center items-center overflow-hidden m"
                >
                  <Link
                    to={`${
                      post.id?.toString().startsWith("0") ? "/" : "posts"
                    }/${post.id}`}
                    className="border flex-1 border-gray-500 max-w-[300px] w-full p-2 m-2  bg-gray-700 rounded-lg flex flex-col  group overflow-hidden group-hover:bg-gray-500 hover:bg-opacity-95"
                  >
                    <p className="font-bold mb-4">{post.title}</p>
                    <p className="line-clamp-2 mt-auto">{post?.body}</p>
                  </Link>
                  <button
                    className=" bg-red-500 text-white px-3 py-1 rounded-lg transition-all duration-300 translate-y-full group-hover:translate-y-0 md:translate-y-0"
                    onClick={() => {
                      setChosenPost(post);
                      setDeleteModalIsOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )
            )
          ) : (
            <p className="text-center  col-span-3">No posts found</p>
          )}
        </div>

        {!searchParams.get("search") && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default HomePage;
