import React from "react";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "destructive"
  | "ghost"
  | "link";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const buttontypes = {
  primary:
    "bg-primary text-white hover:bg-white hover:text-primary border-2 border-primary focus:ring-primary/50  ",
  secondary:
    "bg-secondary text-white hover:bg-white border-2 border-secondary focus:ring-secondary/50 hover:text-secondary",
  gray: " text-gray-500 hover:bg-gray-500 border-2 border-gray-500 focus:ring-gray-300 hover:text-white",
  outline:
    "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white",
  white:
    "bg-white text-primary hover:bg-white/90 border-2 border-white focus:ring-white/50",
  grayTransparent:
    "bg-gray-200/60 text-gray-600 hover:bg-gray-300/70 border-2 border-gray-300/60 focus:ring-gray-300/50 hover:text-gray-900 backdrop-blur-sm",
  tertiary:
    "bg-tertiary text-white text-lg hover:bg-white hover:text-terciary border-2 border-tertiary focus:ring-terciary/50 font-bold",
  green:
    "bg-green-500 text-white hover:bg-white hover:text-green-500 border-2 border-green-500 focus:ring-green-300/50",
};

const sizetypes = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => (
  <button
    className={`
      rounded-xl inline-flex items-center justify-center gap-2 font-medium transition-colors
      focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none
      ${buttontypes[variant]} ${sizetypes[size]} ${className}
    `}
    {...props}
  />
);
