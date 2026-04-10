import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
}

export const FormField: React.FC<InputFieldProps> = ({
  label,
  name,
  error,
  required,
  ...props
}) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={name} className="font-semibold text-lg">
      {label}
      {required && <span className="text-primary ml-1">*</span>}
    </label>
    <input
      id={name}
      name={name}
      className={`
        rounded-xl px-4 h-10 border-2 outline-none text-sm
        ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-gray-200 focus:border-primary"
        }
        transition-colors
      `}
      required={required}
      {...props}
    />
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);
