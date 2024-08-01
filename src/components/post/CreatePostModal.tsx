import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createPost } from "../../services/posts";
import toast from "react-hot-toast";

type FormData = {
  title: string;
  body: string;
};

export default function CreatePostModal({
  onAddPost,
}: {
  onAddPost: (post: { id: number; title: string; body: string }) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      const storeData = { ...data?.data, id: Math.random() };
      onAddPost(storeData);
      toast.success("Post created successfully");
    },
    onError: () => {
      toast.error("Something went wrong with post creation");
    },
  });

  const submitHandler = (data: FormData) => {
    mutate(data);
  };

  return (
    <div className="p-5 text-white ">
      <h1 className="text-3xl mb-5">Create post</h1>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-6 max-w-[600px]"
      >
        <div>
          <label className="block mb-2">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            type="text"
            name="title"
            id="title"
            className="input-with-no-bg"
          />
          <p className="text-red-500 mt-1 h-5">
            {(errors.title?.message as string) || ""}
          </p>
        </div>

        <div>
          <label className="block mb-2" htmlFor="body">
            Body
          </label>
          <textarea
            {...register("body", { required: "Body is required" })}
            rows={5}
            name="body"
            id="body"
            className="input-with-no-bg resize-none"
          ></textarea>
          <p className="text-red-500 h-5">
            {(errors.body?.message as string) || ""}
          </p>
        </div>

        <button className="bg-gray-600 p-3 rounded-lg font-bold">
          {isPending ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
