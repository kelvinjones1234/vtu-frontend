// import React, { useContext } from "react";
// import logo from "../assets/4.svg";
// import { motion } from "framer-motion";

// const LoadingSpinner = () => {
//   return (
//     <div className="flex flex-col justify-center items-center h-screen">
//       <motion.div
//         className="relative"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         <motion.div
//           className="md:text-[5rem] text-[2.2rem] sm:text-[2.4] font-medium"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3, duration: 0.6 }}
//         >
//           {" "}
//           <motion.span
//             className="logo font-heading_one text-transparent bg-clip-text pr-2 text-xl md:text-[5rem] text-[2.2rem] sm:text-[2.4] rounded-lg font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500"
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//             transition={{
//               delay: 0.6,
//               duration: 0.5,
//               type: "spring",
//               stiffness: 200,
//             }}
//           >
//             MaduConnect
//           </motion.span>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default LoadingSpinner;

import React, { useContext } from "react";
import logo from "../assets/4.svg";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="md:text-[5rem] text-[2.2rem] sm:text-[2.4] font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {" "}
          <motion.span
            className="logo font-heading_one text-transparent bg-clip-text pr-2 text-xl md:text-[5rem] text-[2.2rem] sm:text-[2.4] rounded-lg font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.6,
              duration: 0.5,
              type: "spring",
              stiffness: 200,
            }}
          >
            MaduConnect
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
