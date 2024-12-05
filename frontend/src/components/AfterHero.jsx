import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import fast from "../assets/fast.svg";
import secured from "../assets/secured.svg";
import available from "../assets/available.svg";
import easy from "../assets/easy.svg";
import services from "../assets/services.svg";

const features = [
  {
    icon: fast,
    title: "Lightning-Fast Transactions",
    description:
      "Get your top-ups in a flash. With MaduPay, you’ll never be out of credit.",
  },
  {
    icon: secured,
    title: "Safe and Secure",
    description:
      "Your security is our top priority. We use cutting-edge encryption to protect your data and transactions.",
  },
  {
    icon: available,
    title: "24/7 Availability",
    description:
      "Need to top up at midnight? No problem. MaduPay is available round the clock, just like your need to stay connected.",
  },
  {
    icon: services,
    title: "Wide Range of Services",
    description:
      "From mobile airtime to digital subscriptions, MaduPay covers all your top-up needs in one place.",
  },
  {
    icon: easy,
    title: "Easy to Use",
    description:
      "Our intuitive design makes it simple for anyone to use. Top up with just a few clicks!",
  },
];

const AfterHero = () => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Only trigger the animation once
    threshold: 0.1, // Percentage of the element in view to trigger the animation
  });

  return (
    <div className="px-[1rem] ss:px-[6rem] mb-[8vh] mt-[2vh] font-body_two">
      <div className="image flex justify-center">
        <h1 className="text-link py-4 sm:pb-8 text-[1.2rem] font-bold font-heading_two">
          Why Choose Us?
        </h1>
      </div>
      <motion.div
        ref={ref}
        className="grid md:grid-cols-2 gap-5"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          visible: { transition: { staggerChildren: 0.5 } },
          hidden: {},
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="py-10 bg-primary bg-opacity-90 px-4 rounded-xl text-white text-center shadow-lg shadow-indigo-900/10"
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 50 },
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="icon grid justify-center pb-[2rem]">
              <img
                src={feature.icon}
                alt={feature.title}
                className="h-[2rem]"
              />
            </div>
            <h3 className="text-[1rem] uppercase pb-4 font-heading_two">
              {feature.title}
            </h3>
            <p className="max-w-[450px] mx-auto">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
      <div className="contact-us text-center mt-[13vh] text-white">
        <div className="text mx-4">
          <h3 className="text-white text-green-500 font-heading_two py-4 text-[1.2rem] font-bold">
            Have Questions?
          </h3>
          <p className="max-w-[450px] mx-auto">
            Reach out to our customer service assistant for complaints and
            assistance.
          </p>
        </div>
        <div className="register p-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="transition text-black duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg bg-link rounded-2xl hover:bg-sky-500 py-[.46rem] transition duration-500 ease-in-out mx-4 px-6"
          >
            Contact Us
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AfterHero;
