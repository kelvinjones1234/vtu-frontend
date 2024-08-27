import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-bg_on">
      <div className="flex flex-col justify-center items-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
          <div className="w-20 h-20 border-4 border-primary opacity-30 rounded-full absolute top-0 left-0"></div>
        </div>
        <div className="mt-8 text-primary text-5xl font-bold">
          {"MaduPay".split("").map((letter, index) => (
            <span
              key={index}
              className={`inline-block animate-bounce`}
              style={{
                animationDelay: `${index * 100}ms`,
                animationDuration: "1s",
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="mt-4 text-primary text-lg animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
