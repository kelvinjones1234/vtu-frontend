import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-bg_on">
      <div className="flex flex-col justify-center items-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <div className="animate-ping h-5 w-5 rounded-full bg-primary"></div>
          </div>
        </div>
        <div className="mt-8 text-primary text-4xl font-bold">
          {"MaduPay".split("").map((letter, index) => (
            <span
              key={index}
              className={`inline-block animate-bounce`}
              style={{
                animationDelay: `${index * 200}ms`,
                animationDuration: "1s",
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
