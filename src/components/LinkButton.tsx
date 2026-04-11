import { Link } from "react-router-dom";

interface ButtonProps {
  name: string;
  size: keyof typeof sizetypes;
  variant: keyof typeof buttontypes;
  url: string;
}

const buttontypes = {
  primary:
    'bg-primary text-white hover:bg-primary-hover border-2 border-primary focus:ring-primary/40 shadow-sm hover:shadow-md',
  secondary:
    'bg-secondary text-white hover:bg-secondary-hover border-2 border-secondary focus:ring-secondary/40 shadow-sm hover:shadow-md',
  gray:
    'bg-gray-100 text-gray-700 hover:bg-gray-700 border-2 border-gray-300 focus:ring-gray-300/50 hover:text-white',
  outline:
    'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/35',
  white:
    'bg-white text-primary hover:bg-white/90 border-2 border-white focus:ring-white/50 shadow-sm hover:shadow-md',
  grayTransparent:
    'bg-gray-200/60 text-gray-700 hover:bg-gray-300/70 border-2 border-gray-300/70 focus:ring-gray-300/50 hover:text-gray-900 backdrop-blur-sm',
  tertiary:
    'bg-tertiary text-white text-lg hover:bg-tertiary-hover border-2 border-tertiary focus:ring-tertiary/35 font-bold',
  green:
    'bg-green-500 text-white hover:bg-green-600 border-2 border-green-500 focus:ring-green-300/50 shadow-sm hover:shadow-md',
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
      rel="noopener noreferrer"
      className={`${buttontypes[variant]} ${sizetypes[size]} rounded-xl transition-all duration-200 inline-flex items-center justify-center text-center font-semibold focus:outline-none focus:ring-4 focus:ring-offset-1 active:scale-[0.98]`}
    >
      {name}
    </Link>
  );
}