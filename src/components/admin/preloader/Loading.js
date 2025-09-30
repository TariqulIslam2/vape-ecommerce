import React from "react";
// import ScaleLoader from "react-spinners/ScaleLoader";

const Loading = ({ loading }) => {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="w-10 h-10 border-4 border-teal-400 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
