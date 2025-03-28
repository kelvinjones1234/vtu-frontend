// import React, { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import { RiMenu4Line, RiCloseLargeLine } from "react-icons/ri";
// import authenticate from "../assets/authenticate.svg";
// import about from "../assets/about.svg";
// import right from "../assets/right_arrow.svg";
// import bottom from "../assets/bottom_arrow.svg";
// import { useGeneral } from "../context/GeneralContext";
// const HomePageNavbar = () => {
//   const [isScrolled, setIsScrolled] = useState(false);

//   const {
//     handleHomeMenuToggle,
//     sideBarAuthToggle,
//     handleSideBarAuthToggle,
//     homeMenuToggle,
//   } = useGeneral();

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 60) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <>
//       <div
//         className={`p-4 lg:px-0 flex justify-between py-[1rem] lg:px-[6rem] fixed top-0 w-full transition-colors duration-200 z-50 ${
//           isScrolled
//             ? "dark:bg-gray-900 dark:bg-opacity-95 bg-opacity-95 bg-gray-50 shadow"
//             : "bg-transparent"
//         }`}
//       >
//         <div className="flex items-center">
//           <Link to={"/"}>
//             <div className="logo font-heading_one text-transparent bg-clip-text pr-2 text-[.8rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 border-white">
//               MaduConnect
//             </div>
//           </Link>
//         </div>
//         <div className="right">
//           <div className={`small-screen flex items-center sm:hidden`}>
//             <div className="get-started">
//               <button className="bg-blue-500 py-[.4rem] mr-9 px-4 text-[.9rem] bg-opacity-[90%] text-white rounded-2xl font-bold">
//                 <Link to={"/authentication/register"}>Get Started</Link>
//               </button>
//             </div>
//             <div className="hamburger">
//               <div
//                 onClick={handleHomeMenuToggle}
//                 className="text-[25px] text-link"
//               >
//                 {homeMenuToggle ? <RiCloseLargeLine /> : <RiMenu4Line />}
//               </div>
//             </div>
//           </div>
//           <div className="large-screen hidden sm:flex lg:pr-[6rem]">
//             <div className="button">
//               <button className="bg-sky-500 rounded-2xl py-[.3rem] hover:bg-green-600 font-bold transition-all duration-500 ease-in-out text-white mx-4 px-6">
//                 <Link to={"/authentication/register"}>Get Started</Link>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {homeMenuToggle && (
//         <div
//           className="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 sm:hidden pointer-events-auto z-40"
//           onClick={handleHomeMenuToggle}
//         ></div>
//       )}

//       <div
//         className={`harmburger-dropdown fixed top-0 left-0 h-screen p-[1.5rem] sm:hidden bg-white dark:bg-primary dark:bg-opacity-95 text-gray-900 dark:text-white transform transition-transform rounded-r-xl duration-200 ease-in-out z-50 ${
//           homeMenuToggle ? "translate-x-0" : "-translate-x-full"
//         }`}
//         onClick={(e) => e.stopPropagation()} // Prevent click event propagation to overlay
//       >
//         <ul className="w-[13rem] mt-">
//           <div className="flex items-center mb-9">
//             {/* <img src={logo} alt="" className="h-7 mb-1" /> */}
//             <Link to={"/"}>
//               <div className="logo font-heading_one text-transparent bg-clip-text pr-2 text-[.9rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500">
//                 MaduConnect
//               </div>
//             </Link>
//           </div>
//           <ul>
//             <li
//               onClick={handleSideBarAuthToggle}
//               className="bg-white dark:bg-opacity-20 flex py-3 px-2 rounded-xl"
//             >
//               <img
//                 src={authenticate}
//                 alt=""
//                 className="h-[1.2rem] w-[1.5rem] mr-3"
//               />
//               <div className="flex items-center">
//                 <div className="mr-6">Authentication</div>
//                 {sideBarAuthToggle ? (
//                   <img src={bottom} alt="" className="h-[1.2rem]" />
//                 ) : (
//                   <img src={right} alt="" className="h-[1.2rem]" />
//                 )}
//               </div>
//             </li>
//             <ul
//               className={`dropdown transition-all duration-200 ease-in-out overflow-hidden ${
//                 sideBarAuthToggle ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
//               }`}
//             >
//               <div className="sidebar-auth-dropdown">
//                 <li className="mt-4 pl-11 bg-opacity-25 flex py-2 px-2 rounded-xl">
//                   <Link to={"/authentication/login"}>Login</Link>
//                 </li>
//                 <li className="mt-4 pl-11 bg-opacity-25 flex py-2 px-2 rounded-xl">
//                   <Link to={"/authentication/register"}>Register</Link>
//                 </li>
//                 <li className="mt-4 pl-11 bg-opacity-25 flex py-2 px-2 rounded-xl">
//                   <Link to={"/user/get-password-reset-link"}>
//                     Reset Password
//                   </Link>
//                 </li>
//               </div>
//             </ul>
//           </ul>
//           <li className="mt-4 bg-white dark:bg-opacity-20 py-3 px-2 rounded-xl">
//             <Link to={"/dashboard/about"} className="items-center flex">
//               <img
//                 src={about}
//                 alt=""
//                 className="h-[1.2rem] w-[1.1rem] ml-[.2rem] mr-[1rem]"
//               />
//               <div>About</div>
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// };

// export default HomePageNavbar;



import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { RiMenu4Line, RiCloseLargeLine } from "react-icons/ri";
import authenticate from "../assets/authenticate.svg";
import about from "../assets/about.svg";
import right from "../assets/right_arrow.svg";
import bottom from "../assets/bottom_arrow.svg";
import { useGeneral } from "../context/GeneralContext";
const HomePageNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    handleHomeMenuToggle,
    sideBarAuthToggle,
    handleSideBarAuthToggle,
    homeMenuToggle,
  } = useGeneral();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`p-4 lg:px-0 flex justify-between py-[1rem] lg:px-[6rem] fixed top-0 w-full transition-colors duration-200 z-50 ${
          isScrolled
            ? "dark:bg-gray-900 dark:bg-opacity-95 bg-opacity-95 bg-gray-50 shadow"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center">
          <Link to={"/"}>
            <div className="logo font-heading_one text-transparent bg-clip-text pr-2 text-[.8rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 border-white">
              MaduConnect
            </div>
          </Link>
        </div>
        <div className="right">
          <div className={`small-screen flex items-center sm:hidden`}>
            <div className="get-started">
              <button className="bg-blue-600 py-[.4rem] mr-9 px-4 text-[.9rem] bg-opacity-[90%] text-white rounded-2xl font-bold">
                <Link to={"/authentication/register"}>Get Started</Link>
              </button>
            </div>
            <div className="hamburger">
              <div
                onClick={handleHomeMenuToggle}
                className="text-[25px] text-blue-600"
              >
                {homeMenuToggle ? <RiCloseLargeLine /> : <RiMenu4Line />}
              </div>
            </div>
          </div>
          <div className="large-screen hidden sm:flex lg:pr-[6rem]">
            <div className="button">
              <button className="bg-blue-500 rounded-2xl py-[.3rem] hover:bg-blue-500 font-bold transition-all duration-500 ease-in-out text-white mx-4 px-6">
                <Link to={"/authentication/register"}>Get Started</Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      {homeMenuToggle && (
        <div
          className="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 sm:hidden pointer-events-auto z-40"
          onClick={handleHomeMenuToggle}
        ></div>
      )}

      <div
        className={`harmburger-dropdown fixed top-0 left-0 h-screen p-[1.5rem] sm:hidden bg-white dark:bg-primary dark:bg-opacity-95 text-gray-900 dark:text-white transform transition-transform rounded-r-xl duration-200 ease-in-out z-50 ${
          homeMenuToggle ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent click event propagation to overlay
      >
        <ul className="w-[13rem] mt-">
          <div className="flex items-center mb-9">
            {/* <img src={logo} alt="" className="h-7 mb-1" /> */}
            <Link to={"/"}>
              <div className="logo font-heading_one text-transparent bg-clip-text pr-2 text-[.9rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500">
                MaduConnect
              </div>
            </Link>
          </div>
          <ul>
            <li
              onClick={handleSideBarAuthToggle}
              className="bg-indigo-50 dark:bg-indigo-900/20 flex py-3 px-2 rounded-xl"
            >
              <img
                src={authenticate}
                alt=""
                className="h-[1.2rem] w-[1.5rem] mr-3"
              />
              <div className="flex items-center">
                <div className="mr-6">Authentication</div>
                {sideBarAuthToggle ? (
                  <img src={bottom} alt="" className="h-[1.2rem]" />
                ) : (
                  <img src={right} alt="" className="h-[1.2rem]" />
                )}
              </div>
            </li>
            <ul
              className={`dropdown transition-all duration-200 ease-in-out overflow-hidden ${
                sideBarAuthToggle ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="sidebar-auth-dropdown">
                <li className="mt-4 pl-11 bg-opacity-25 flex py-2 px-2 rounded-xl hover:text-indigo-700">
                  <Link to={"/authentication/login"}>Login</Link>
                </li>
                <li className="mt-4 pl-11 bg-opacity-25 flex py-2 px-2 rounded-xl hover:text-indigo-700">
                  <Link to={"/authentication/register"}>Register</Link>
                </li>
                <li className="mt-4 pl-11 bg-opacity-25 flex py-2 px-2 rounded-xl hover:text-indigo-700">
                  <Link to={"/user/get-password-reset-link"}>
                    Reset Password
                  </Link>
                </li>
              </div>
            </ul>
          </ul>
          <li className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 py-3 px-2 rounded-xl">
            <Link to={"/dashboard/about"} className="items-center flex">
              <img
                src={about}
                alt=""
                className="h-[1.2rem] w-[1.1rem] ml-[.2rem] mr-[1rem]"
              />
              <div>About</div>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default HomePageNavbar;