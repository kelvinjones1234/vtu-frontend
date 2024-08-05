import whatsapp from "../assets/whatsapp.png";
import twitter from "../assets/twitter1.png";
import instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";
import { Link } from "react-router-dom";

const socials = [
  { src: twitter, alt: "Twitter" },
  { src: facebook, alt: "Facebook" },
  { src: instagram, alt: "Instagram" },
  { src: whatsapp, alt: "Whatsapp" },
];

const Footer = () => {
  return (
    <div className="text-center mt-10 brder-t border-link bg-gray-50 dark:bg-primary dark:text-white text-primary bg-opacity-80 w-full mx-auto font-body_two ss:px-20 px-4">
      <div className="sm:flex sm:justify-between max-w-[1000px] mx-auto">
        <div className="legals sm:mt-16 sm:mx-3">
          <h3 className="text-primary dark:text-link font-heading_two pt-4 text-2xl font-bold">
            Legals
          </h3>
          <p>Terms and Condition</p>
          <p>Privacy Policy</p>
        </div>
        <div className="contact mt-16">
          <h3 className="text-primary dark:text-link font-heading_two pt-4 text-2xl font-bold">
            Contact
          </h3>
          <p>atom@atom.com</p>
          <p className="tell">+234 814 177 1672</p>
        </div>
        <div className="socials my-16">
          <h3 className="text-primary dark:text-link font-heading_two pt-4 text-2xl font-bold">
            Socials
          </h3>
          <div className="icons flex justify-center mt-2">
            {socials.map((social, index) => (
              <img
                key={index}
                src={social.src}
                alt={social.alt}
                className="h-10 mx-3"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="copyright pt-8 pb-4">
        <div className="logo">
          <div className="flex justify-center items-center gap-1">
            <Link to={"/"}>
              <div className="logo font-heading_one text-green-500 border dark:border-white border-primary px-2 text-[.7rem] px-2 rounded-[.5rem] font-bold">
                Atom
              </div>
            </Link>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <p className="text-[.8rem] mt-2">
          Copyright © 2024 PraiseMedia.
          <br />
          All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
