import React from "react";

const Input = ({
  type,
  placeholder,
  label,
  name,
}: {
  type: string;
  placeholder: string;
  label: string;
  name: string;
}) => {
  return (
    <>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={type}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder={placeholder}
          required={true}
        />
      </div>
    </>
  );
};

export default Input;
