import React from "react";

const Button = ({ type, label }: { type: "submit"; label: string }) => {
  return (
    <>
      <button
        type={type}
        className="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        {label}
      </button>
    </>
  );
};

export default Button;
