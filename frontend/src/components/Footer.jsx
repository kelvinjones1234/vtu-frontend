import React from "react";
import { useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import whatsapp from "../assets/whatsapp.png";
import twitter from "../assets/twitter1.png";
import instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";
import { AuthContext } from "../context/AuthenticationContext"; // Assuming AuthContext provides the user

const socials = [
  { src: twitter, alt: "Twitter" },
  { src: facebook, alt: "Facebook" },
  { src: instagram, alt: "Instagram" },
  { src: whatsapp, alt: "Whatsapp" },
];

const Footer = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext); // Access user from context

  // Check if the current path is the homepage
  const isHomepage = location.pathname === "/";

  return (
    <div
      className={`text-center sm:text-start mt-10 brder-t border-link ${
        user
          ? "bg-gray-50 dark:bg-primary dark:text-white text-primary bg-opacity-80"
          : "bg-primary"
      }  w-full mx-auto font-body_two ss:px-20 px-4`}
    >
      <div className="sm:flex sm:justify-between max-w-[1000px] mx-auto">
        <div className="legals sm:mt-16 sm:mx-3 ">
          <h3 className="text-link font-heading_two pt-4 text-2xl font-bold">
            Legals
          </h3>
          <Link to={"/terms-and-conditions"}>
            <p className="underline hover:text-link duration-400 transition-all ease-in-out">
              Terms and Condition
            </p>
          </Link>
          <Link to={"/privacy-and-policy"}>
            <p className="underline hover:text-link duration-400 transition-all ease-in-out">
              Privacy Policy
            </p>
          </Link>
        </div>
        <div className="contact mt-16 text-center">
          <h3 className="text-link font-heading_two pt-4 text-2xl font-bold">
            Contact
          </h3>
          <p>madupay@madupay.com</p>
          <p className="tell">+234 814 177 1672</p>
        </div>
        <div className="socials my-16">
          <h3 className="text-link font-heading_two pt-4 text-2xl font-bold">
            Socials
          </h3>
          <div className="icons flex justify-center mt-2">
            {socials.map((social, index) => (
              <img
                key={index}
                src={social.src}
                alt={social.alt}
                className="h-10 mx-3 sm:ml-0 transition-all duration-300 ease-in-out transform hover:scale-110 hover:-translate-y-1 hover:filter hover:brightness-110"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="copyright pt-8 pb-4 border-t border-gray-700">
        <div className="logo">
          <div className="flex justify-center items-center gap-1">
            <Link to={"/"}>
              <div className="logo font-heading_one text-transparent bg-clip-text px-2 text-[.7rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 border-white">
                MaduPay
              </div>
            </Link>
          </div>
        </div>
        <p className="text-[.8rem] text-center mt-2">
          Copyright © 2024 PraiseMedia.
          <br />
          All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
