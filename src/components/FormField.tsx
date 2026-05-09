import React from "react";

interface Option {
  value: string;
  label: string;
}

interface BaseProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  type?: string;
  options?: Option[];
}

type InputFieldProps =
  | (BaseProps &
      React.InputHTMLAttributes<HTMLInputElement> & {
        type?: Exclude<string, "select">;
        options?: undefined;
      })
  | (BaseProps &
      React.SelectHTMLAttributes<HTMLSelectElement> & {
        type: "select";
        options: Option[];
      });

export const FormField: React.FC<InputFieldProps> = ({
  label,
  name,
  error,
  required,
  type = "text",
  options,
  ...props
}) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={name} className="font-semibold text-md">
      {label}
      {required && <span className="text-primary ml-1">*</span>}
    </label>
    {type === "select" && options ? (
      <select
        id={name}
        name={name}
        className={`
          rounded-xl px-4 h-10 border-2 outline-none text-sm
          ${error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-primary"}
          transition-colors
        `}
        required={required}
        {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        <option value="">Selecciona una opción</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        className={`
          rounded-xl px-4 h-10 border-2 outline-none text-sm
          ${error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-primary"}
          transition-colors
        `}
        required={required}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    )}
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);
