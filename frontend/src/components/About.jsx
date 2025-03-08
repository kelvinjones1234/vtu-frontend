import { useContext } from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { useProduct } from "../context/ProductContext";
import { useAuth } from "../context/AuthenticationContext";
const About = ({ style }) => {
  const { user } = useAuth();
  const { about } = useProduct();

  return (
    <div className={`${!user && "lg:px-[6rem]"} ${user ? "" : "dark"}`}>
      <div className="pt-[15vh] sm:bg-cover px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
        {user && <GeneralLeft />}
        <div className="mx-auto w-full max-w-[800px]">
          {/* Mobile Header */}
          {user && (
            <div className="text-primary text-[1.5rem] font-bold dark:text-white pb-8 text-center xs:hidden">
              Hi,{" "}
              <span className="bg-gradient-to-r uppercase from-purple-400 via-sky-500 to-red-500 text-transparent bg-clip-text">
                {user.username}
              </span>
            </div>
          )}

          {/* About Content */}
          <div className="mb-8">
            <h2
              className={`${
                user
                  ? "font-bold font-heading_two text-primary dark:text-white text-3xl mb-4"
                  : "font-bold font-heading_two text-white text-3xl mb-4"
              }`}
            >
              About Us
            </h2>
            <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
              <Link to={"/user/dashboard"}>Dashboard</Link>
              <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
              <span className="text-gray-500">About</span>
            </div>
          </div>

          {/* About Details */}
          {about && about.length > 0 ? (
            about.map((abt, index) => (
              <div
                key={index}
                className="bg-white text-black dark:text-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
              >
                <div
                  className={`${style}`}
                  dangerouslySetInnerHTML={{
                    __html: abt.about,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <p>No information available at the moment.</p>
            </div>
          )}
        </div>
        {user && <GeneralRight />}
      </div>
    </div>
  );
};

export default About;