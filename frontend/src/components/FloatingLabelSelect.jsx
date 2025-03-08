import { useState } from "react";

const FloatingLabelSelect = ({
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  options = [],
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-3">
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div
        className={`relative border ${
          error
            ? "border-red-500"
            : "border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:focus-within:border-[#1CCEFF]"
        } rounded-2xl transition-all ${
          isFocused || value ? "border-[#1CCEFF]" : ""
        }`}
      >
        <select
          name={name}
          id={name}
          value={value || ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`block w-full h-[3.5rem] text-[1.2rem] pt-6 pl-4 pr-10 pb-2 bg-transparent dark:bg-[#18202F] text-primary dark:text-white rounded-2xl outline-none transition-all appearance-none ${
            disabled ? "opacity-70" : ""
          }`}
        >
          <option value="" disabled></option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={name}
          className={`absolute text-gray-500 duration-300 transform ${
            isFocused || value
              ? "text-xs top-3 scale-75 -translate-y-1 z-10"
              : "text-base top-1/2 -translate-y-1/2"
          } left-4 origin-[0] pointer-events-none`}
        >
          {placeholder}
        </label>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FloatingLabelSelect;
