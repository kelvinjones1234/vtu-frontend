import { useContext } from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { AuthContext } from "../context/AuthenticationContext";

const About = () => {
  const { user } = useContext(AuthContext);

  return (
    <div
      className={`bg-bg_on ${
        !user && "lg:px-[6rem]"
      } min-h-screen bg-contain lg:px-[6rem] bg-no-repeat justify-center mt-[8rem] sm:bg-cover bg-center px-4 sm:px-6 lg:px-8 xl:px-16`}
    >
      <div className="max-w-7xl mx-auto sm:flex gap-8">
        {user && <GeneralLeft />}
        <div className="min-w-[349.20px] pr-2 mx-auto">
          <div className="mb-8">
            <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
              About Us
            </h2>
            <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
              <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
              <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
              <span className="text-gray-500">About</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Our Mission
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              At Atom Virtual Top-Up, our mission is to simplify and streamline
              the process of mobile top-ups, offering a seamless and reliable
              experience for our customers worldwide.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Our Story
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Founded in [Year], Atom Virtual Top-Up started with a vision to
              revolutionize the way people recharge their mobile accounts. We
              identified a gap in the market for a fast, secure, and
              user-friendly platform that caters to all major mobile networks.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Why Choose Us?
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 mb-4">
              <li>Convenient and easy-to-use platform.</li>
              <li>Supports all major mobile networks.</li>
              <li>Secure payment processing.</li>
              <li>24/7 customer support.</li>
            </ul>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Our Team
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              We are a team of passionate professionals with years of experience
              in the telecom and technology industries. Our combined expertise
              allows us to innovate and improve our services continually.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Get in Touch
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              We value your feedback and are always here to assist you. Feel
              free to reach out to us at{" "}
              <span className="underline">atomvirtualtopup@gmail.com</span> with
              any questions or concerns.
            </p>
          </div>
        </div>
        {user && <GeneralRight />}
      </div>
    </div>
  );
};

export default About;
