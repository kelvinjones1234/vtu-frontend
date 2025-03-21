import React from "react";
import { Link } from "react-router-dom";
import whatsapp from "../assets/whatsapp.png";
import twitter from "../assets/twitter1.png";
import instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";

const socials = [
  { src: twitter, alt: "Twitter" },
  { src: facebook, alt: "Facebook" },
  { src: instagram, alt: "Instagram" },
  { src: whatsapp, alt: "Whatsapp" },
];

const Footer = () => {
  return (
    <div className="text-center relative sm:text-start mt-[10rem] sm:mt-[5rem] border-t border-link bg-white dark:bg-primary w-full mx-auto font-body_two px-4">
      <div className="sm:flex sm:justify-between max-w-[1000px] mx-auto">
        <div className="legals sm:mt-16 sm:mx-3 ">
          <h3 className="text-blue-600 font-heading_two pt-4 text-2xl font-bold">
            Legals
          </h3>
          <Link to={"/terms-and-conditions"}>
            <p className="underline hover:text-blue-600 duration-400 transition-all ease-in-out text-gray-800 dark:text-white">
              Terms and Condition
            </p>
          </Link>
          <Link to={"/privacy-and-policy"}>
            <p className="underline hover:text-blue-600 duration-400 transition-all ease-in-out text-gray-800 dark:text-white">
              Privacy Policy
            </p>
          </Link>
        </div>
        <div className="contact mt-16 text-center">
          <h3 className="text-blue-600 font-heading_two pt-4 text-2xl font-bold">
            Contact
          </h3>
          <p className="text-gray-800 dark:text-white">
            MaduConnect@MaduConnect.com
          </p>
          <p className="text-gray-800 dark:text-white">+234 814 177 1672</p>
        </div>
        <div className="socials my-16">
          <h3 className="text-blue-600 font-heading_two pt-4 text-2xl font-bold">
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
                MaduConnect
              </div>
            </Link>
          </div>
        </div>
        <p className="text-[.8rem] text-center mt-2 text-gray-800 dark:text-white">
          Copyright © 2024 PraiseMedia.
          <br />
          All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
