import { React } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import { useAuth } from "../context/AuthenticationContext";
import { FaBell, FaEdit, FaUserCircle } from "react-icons/fa";

const GeneralRight = () => {
  const { allRead, unreadCount } = useProduct();
  const { user } = useAuth();

  return (
    <div className="w-[25rem] hidden sm:block sticky top-[15vh] self-start font-body_two">
      <div>
        <h1 className="dark:text-white text-primary underline font-bold mb-[2rem] font-heading_two">
          Profile
        </h1>
        <div className="flex justify-center">
          <FaUserCircle className="h-[6rem] w-[6rem] text-gray-400" />
        </div>
        <div className="grid justify-center text-center">
          <p className="pt-3 pb-5 text-sky-600 font-bold">
            {user.user.first_name} {user.user.last_name}
          </p>
          <div className="flex gap-2 justify-around">
            <div className="notification h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white dark:bg-opacity-20 grid relative justify-center items-center dark:hover:bg-opacity-10 hover:transition hover:duration-300 ease-in-out cursor-pointer">
              <Link to={"/user/notifications"}>
                <FaBell className="w-6 h-6 text-blue-600" />
              </Link>
              {!allRead && (
                <div className="flex items-center justify-center h-3 w-3 bg-red-600 absolute rounded-full left-3 bottom-6 text-white text-[10px]">
                  {unreadCount}
                </div>
              )}
            </div>
            <div className="notification h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white dark:bg-opacity-20 justify-center flex items-center dark:hover:bg-opacity-10 hover:transition hover:duration-300 ease-in-out cursor-pointer">
              <Link to={"/user/dashboard/profile"}>
                <FaEdit className="w-6 h-6 text-blue-600" />
              </Link>
            </div>
            {/* <div className="notification h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-300 dark:bg-white dark:bg-opacity-20"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralRight;
