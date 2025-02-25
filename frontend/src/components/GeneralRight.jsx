import { useContext, React } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import { FaBell, FaEdit, FaUserCircle } from "react-icons/fa";

const GeneralRight = () => {
  const { allRead, unreadCount } = useContext(ProductContext);

  return (
    <div className="w-[25rem] z-[] hidden sm:block sticky top-[15vh] self-start font-body_two">
      <div>
        <h1 className="dark:text-white text-primary underline font-bold mb-[2rem] font-heading_two">
          Profile
        </h1>
        <div className="flex justify-center">
          <FaUserCircle className="h-[6rem] w-[6rem] text-gray-400" />
        </div>
        <div className="grid justify-center text-center">
          <p className="pt-3 pb-5 text-link dark:text-link font-bold">
            Godwin Praise
          </p>
          <div className="flex gap-2">
            <div className="notification h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white dark:bg-opacity-20 grid relative justify-center items-center dark:hover:bg-opacity-10 hover:transition hover:duration-300 ease-in-out cursor-pointer">
              <Link to={"/user/notifications"}>
                <FaBell className="w-6 h-6" style={{ color: "#1CCEFF" }} />
              </Link>
              {!allRead && (
                <div className="flex items-center justify-center h-3 w-3 bg-red-600 absolute rounded-full left-3 bottom-6 text-white text-[10px]">
                  {unreadCount}
                </div>
              )}
            </div>
            <div className="notification h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white dark:bg-opacity-20 justify-center flex items-center dark:hover:bg-opacity-10 hover:transition hover:duration-300 ease-in-out cursor-pointer">
              <Link to={"/user/dashboard/profile"}>
                <FaEdit className="w-6 h-6" style={{ color: "#1CCEFF" }} />
              </Link>
            </div>
            <div className="notification h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-300 dark:bg-white dark:bg-opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralRight;
