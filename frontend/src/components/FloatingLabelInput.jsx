import { useState } from "react";

const FloatingLabelInput = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  maxLength,
  margin,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative mb-3 ${margin}`}>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div
        className={`relative border ${
          error
            ? "border-red-500"
            : isFocused
            ? "border-[#1CCEFF]"
            : "border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:focus-within:border-[#1CCEFF]"
        } rounded-2xl transition-all`}
      >
        <input
          type={type}
          name={name}
          id={name}
          value={value || ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          maxLength={maxLength}
          className={`block w-full h-[3.5rem] text-[1.2rem] pt-6 px-4 pb-2 bg-transparent dark:bg-[#18202F] text-primary dark:text-white rounded-2xl outline-none transition-all ${
            disabled ? "opacity-70" : ""
          }`}
        />
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
      </div>
    </div>
  );
};

export default FloatingLabelInput;
