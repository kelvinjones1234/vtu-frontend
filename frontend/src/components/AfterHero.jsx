import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import fast from "../assets/fast.svg";
import secured from "../assets/secured.svg";
// import available from "../assets/available.svg";
import easy from "../assets/easy.svg";
// import services from "../assets/services.svg";

// Using React.memo to prevent unnecessary re-renders of FeatureCard
const FeatureCard = React.memo(
  ({ feature, index, animationVariants, transition }) => {
    return (
      <motion.div
        key={index}
        className="py-10 bg-white dark:bg-primary bg-opacity-90 dark:bg-opacity-90 px-6 rounded-xl text-gray-800 dark:text-white text-center shadow-lg shadow-indigo-900/10 border border-gray-200 dark:border-indigo-900/10"
        variants={animationVariants}
        transition={transition}
        whileHover={{ y: -5 }}
      >
        <div className="icon grid justify-center pb-[2rem]">
          <motion.img
            src={feature.icon}
            alt={feature.title}
            className="h-[2.5rem]"
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <h3 className="text-[1rem] uppercase pb-4 font-heading_two font-bold text-sky-600 dark:text-link">
          {feature.title}
        </h3>
        <p className="max-w-[450px] mx-auto text-gray-700 dark:text-gray-200">
          {feature.description}
        </p>
      </motion.div>
    );
  }
);

const features = [
  {
    icon: fast,
    title: "Lightning-Fast Transactions",
    description:
      "Get your top-ups in a flash. With MaduPay, you'll never be out of credit.",
  },
  {
    icon: secured,
    title: "Safe and Secure",
    description:
      "Your security is our top priority. We use cutting-edge encryption to protect your data and transactions.",
  },
  {
    // icon: available,
    title: "24/7 Availability",
    description:
      "Need to top up at midnight? No problem. MaduPay is available round the clock, just like your need to stay connected.",
  },
  {
    // icon: services,
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
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    visible: { transition: { staggerChildren: 0.2 } },
    hidden: {},
  };

  const itemVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 50 },
  };

  return (
    <div className="px-[1rem] ss:px-[6rem] mt-[15vh] font-body_two">
      <div className="image flex justify-center">
        <motion.h1
          className="text-sky-600 dark:text-link py-4 sm:pb-8 text-[1.5rem] font-bold font-heading_two"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose Us?
        </motion.h1>
      </div>

      <motion.div
        ref={ref}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            feature={feature}
            index={index}
            animationVariants={itemVariants}
            transition={{ duration: 0.5 }}
          />
        ))}
      </motion.div>

      <motion.div
        className="contact-us text-center mt-[13vh] bg-white dark:bg-primary bg-opacity-90 dark:bg-opacity-90 rounded-xl p-8 shadow-lg shadow-indigo-900/10 border border-gray-200 dark:border-indigo-900/10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="text mx-4">
          <h3 className="text-sky-600 dark:text-link font-heading_two py-4 text-[1.2rem] font-bold">
            Have Questions?
          </h3>
          <p className="max-w-[450px] mx-auto text-gray-700 dark:text-gray-200">
            Reach out to our customer service assistant for complaints and
            assistance. We're available 24/7 to help you with any issues.
          </p>
        </div>
        <div className="register p-3 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="transition text-gray-800 dark:text-black duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg bg-sky-600 rounded-2xl hover:bg-sky-500 py-[.46rem] transition duration-500 ease-in-out mx-4 px-6 font-medium"
          >
            Contact Us
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AfterHero;
