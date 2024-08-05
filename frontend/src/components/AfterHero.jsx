import React from "react";
import fast from "../assets/fast.svg";
import secured from "../assets/secured.svg";
import available from "../assets/available.svg";
import easy from "../assets/easy.svg";
import services from "../assets/services.svg";

const AfterHero = () => {
  return (
    <div className="">
      <div className="px-[1rem] ss:px-[6rem] mb-[8vh] mt-[2vh] font-body_two">
        <div className="image flex justify-center">
          <h1 className="text-link py-4 sm:pb-8 text-[1.2rem] font-bold font-heading_two">
            Why Choose Atom?
          </h1>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="py-10 bg-primary bg-opacity-90 px-4 rounded-xl text-white text-center shadow-lg shadow-indigo-900/10">
            <div className="icon grid justify-center pb-[2rem]">
              <img src={fast} alt="fast-transaction" className="h-[2rem]" />
            </div>
            <h3 className="text-[1rem] uppercase pb-4 font-heading_two">
              Lightning-Fast Transactions
            </h3>
            <p className="max-w-[450px] mx-auto">
              Get your top-ups in a flash. With Atom, you’ll never be out of
              credit.
            </p>
          </div>
          <div className="py-10 bg-primary bg-opacity-90 px-4 rounded-xl text-white text-center shadow-lg shadow-indigo-900/10">
            <div className="icon grid justify-center pb-[2rem]">
              <img src={secured} alt="fast-transaction" className="h-[2rem]" />
            </div>
            <h3 className="text-[1rem] uppercase pb-4 font-heading_two">
              Safe and Secure
            </h3>
            <p className="max-w-[450px] mx-auto">
              Your security is our top priority. We use cutting-edge encryption
              to protect your data and transactions.
            </p>
          </div>
          <div className="py-10 bg-primary bg-opacity-90 px-4 rounded-xl text-white text-center shadow-lg shadow-indigo-900/10">
            <div className="icon grid justify-center pb-[2rem]">
              <img
                src={available}
                alt="fast-transaction"
                className="h-[2rem]"
              />
            </div>
            <h3 className="text-[1rem] uppercase pb-4 font-heading_two">
              24/7 Availability
            </h3>
            <p className="max-w-[450px] mx-auto">
              Need to top up at midnight? No problem. Atom is available round
              the clock, just like your need to stay connected.
            </p>
          </div>
          <div className="py-10 bg-primary bg-opacity-90 px-4 rounded-xl text-white text-center shadow-lg shadow-indigo-900/10">
            <div className="icon grid justify-center pb-[2rem]">
              <img src={services} alt="fast-transaction" className="h-[2rem]" />
            </div>
            <h3 className="text-[1rem] uppercase pb-4 font-heading_two">
              Wide Range of Services
            </h3>
            <p className="max-w-[450px] mx-auto">
              From mobile airtime to digital subscriptions, Atom covers all your
              top-up needs in one place.
            </p>
          </div>
          <div className="md:col-span-2 flex justify-center">
            <div className="py-10 bg-primary bg-opacity-90 mb-[1rem] px-4 rounded-xl text-white text-center shadow-lg shadow-indigo-900/20 w-full">
              <div className="icon grid justify-center pb-[2rem]">
                <img src={easy} alt="fast-transaction" className="h-[2rem]" />
              </div>
              <h3 className="text-[1rem] uppercase pb-4 font-heading_two">
                Easy to Use
              </h3>
              <p className="max-w-[450px] mx-auto">
                Our intuitive design makes it simple for anyone to use. Top up
                with just a few clicks!
              </p>
            </div>
          </div>
        </div>
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
          <div className="contact-button p-3">
            <button className="bg-link hover:bg-sky-500 transition duration-500 ease-in-out text-primary rounded-2xl py-[.4rem] px-6">
              Contact us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterHero;
