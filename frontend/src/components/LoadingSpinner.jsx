import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-bg_on">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="text-center">
          <svg width="200" height="80" viewBox="0 0 200 80" className="mx-auto">
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="text-4xl font-bold fill-primary"
            >
              <tspan className="animate-pulse-1">A</tspan>
              <tspan dx="10" className="animate-pulse-2">
                T
              </tspan>
              <tspan dx="10" className="animate-pulse-3">
                O
              </tspan>
              <tspan dx="10" className="animate-pulse-4">
                M
              </tspan>
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
