import { Link } from "react-router-dom";

interface ButtonProps {
  name: string;
  size: keyof typeof sizetypes;
  variant: keyof typeof buttontypes;
  url: string;
}

const buttontypes = {
  primary:
    'bg-primary text-white hover:bg-white hover:text-primary border-2 border-primary focus:ring-primary/50',
  secondary:
    'bg-secondary text-white hover:bg-secondary-dark border-2 border-secondary',
  gray: 
    ' text-gray-500 hover:bg-gray-500 border-2 border-gray-500 focus:ring-gray-300 hover:text-white',
  outline:
    'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
  white:
    'bg-white text-primary hover:bg-white/90 border-2 border-white focus:ring-white/50',
  grayTransparent:
    'bg-gray-200/60 text-gray-600 hover:bg-gray-300/70 border-2 border-gray-300/60 focus:ring-gray-300/50 hover:text-gray-900 backdrop-blur-sm',
};

const sizetypes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

export default function LinkButton({ name, size, variant, url }: ButtonProps) {
  return (
    <Link
      to={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${buttontypes[variant]} ${sizetypes[size]} rounded-lg transition-colors duration-200 inline-block text-center font-medium`}
    >
      {name}
    </Link>
  );
}