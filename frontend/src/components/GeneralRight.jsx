import { useContext, React } from "react";
import notification from "../assets/notification.svg";
import edit from "../assets/edit.svg";
import { Link } from "react-router-dom";

const GeneralRight = () => {
  return (
    <div className="w-[25rem] z-[] hidden sm:block sticky top-[15vh] self-start font-body_two">
      <div>
        <h1 className="dark:text-white text-primary underline font-bold mb-[2rem] font-heading_two">
          Profile
        </h1>
        <div className="flex justify-center">
          <img
            src=""
            alt=""
            className="image h-[6rem] w-[6rem] rounded-full bg-white"
          />
        </div>
        <div className="grid justify-center text-center">
          <p className="pt-3 pb-5 text-primary dark:text-secondary font-bold">
            Godwin Praise
          </p>
          <div className="flex gap-4">
            <div className="notification h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white dark:bg-opacity-20 grid relative justify-center items-center dark:hover:bg-opacity-10 transition duration-300 ease-in-out cursor-pointer">
              <img src={notification} alt="" className="w-6" />
              <div className="red-point h-3 w-3 bg-red-600 absolute bottom-3 rounded-full left-5 bottom-6"></div>
            </div>
            <div className="notification h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white dark:bg-opacity-20 justify-center flex items-center dark:hover:bg-opacity-10 transition duration-300 ease-in-out cursor-pointer">
              <Link to={"/user/dashboard/profile"}>
                <div className="edit ">
                  <img src={edit} alt="" className="w-6" />
                </div>
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
