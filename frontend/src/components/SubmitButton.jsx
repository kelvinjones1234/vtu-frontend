// import React from "react";

// const SubmitButton = ({ label, loading, className = "", ...props }) => {
//   const baseButtonStyles =
//     "text-[1rem] my-2 w-full outline-none text-white p-1 h-[3.2rem] bg-blue-600 text-black rounded-2xl bg-opacity-[90%] font-semibold hover:bg-sky-500 transition duration-400 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

//   const loadingContainerStyles = "grid justify-center";
//   const spinnerStyles = "w-5 h-5 text-gray-200 animate-spin fill-white";

//   return (
//     <button
//       className={`${baseButtonStyles} ${className}`}
//       type="submit"
//       disabled={loading}
//       {...props}
//     >
//       {loading ? (
//         <div role="status" className={loadingContainerStyles}>
//           <svg
//             aria-hidden="true"
//             className={spinnerStyles}
//             viewBox="0 0 100 101"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50..." />
//           </svg>
//         </div>
//       ) : (
//         label
//       )}
//     </button>
//   );
// };

// export default SubmitButton;

import React from "react";

const SubmitButton = ({ label, loading, className = "", ...props }) => {
  const baseButtonStyles =
    "text-white my-2 w-full outline-none p-1 h-12 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      className={`${baseButtonStyles} ${className}`}
      type="submit"
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        label
      )}
    </button>
  );
};

export default SubmitButton;
