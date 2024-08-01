import { Dispatch, SetStateAction } from "react";

const Pagination = ({
  currentPage,
  setCurrentPage,
}: {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className="flex justify-center items-center mt-10 gap-4">
      <button
        className="bg-gray-600 py-2 px-3 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <p className="border border-gray-600 px-4 py-2 rounded-lg">
        {currentPage}
      </p>
      <button
        className="bg-gray-600 py-2 px-3 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === 10}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
