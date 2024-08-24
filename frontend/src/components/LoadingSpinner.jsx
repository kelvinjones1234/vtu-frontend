import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-bg_on">
      <div className="flex flex-col justify-center items-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-primary border-opacity-50"></div>
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="rounded-full h-28 w-28 border-t-4 border-primary border-opacity-75"></div>
          </div>
        </div>
        <svg
          width="200"
          height="80"
          viewBox="0 0 200 80"
          className="mx-auto mt-4"
        >
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-4xl font-bold fill-primary"
          >
            <tspan className="animate-pulse">A</tspan>
            <tspan dx="10" className="animate-pulse delay-100">
              T
            </tspan>
            <tspan dx="10" className="animate-pulse delay-200">
              O
            </tspan>
            <tspan dx="10" className="animate-pulse delay-300">
              M
            </tspan>
          </text>
        </svg>
      </div>
    </div>
  );
};

export default LoadingSpinner;
