import { cn } from './../lib/utils';

interface Props {
  name: string;
  type: string;
  placeholder?: string;
  value?: string;
  color?: keyof typeof colors;
  size?: keyof typeof sizes;
  className?: string;
  disabled?: boolean;
  onChange?: (value: string | FileList) => void;
}

const colors = {
  primary:
    cn('bg-white text-gray-900 border-primary/80 placeholder:text-gray-400 focus:border-primary focus:ring-primary/25',
      'hover:bg-primary/20 hover:border-primary transition-all transition-colors duration-500 focus:bg-primary/5'),

  secondary: 'bg-secondary-100 text-secondary border-secondary-300 placeholder:text-secondary/60 focus:border-secondary focus:ring-secondary/25',
  gray: 'bg-gray-100 text-gray-800 border-gray-300 placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-400/25',
  white: 'bg-white text-primary border-white/70 placeholder:text-primary/50 focus:border-white focus:ring-white/40',
  grayTransparent: 'bg-gray-200/55 text-gray-700 border-gray-300/70 placeholder:text-gray-500 focus:border-gray-400 focus:ring-gray-300/40 backdrop-blur-sm',
};

const sizes = {
  xs: 'h-9 text-sm font-medium ',
  sm: 'max-w-xs text-sm',
  md: 'max-w-md text-base',
  lg: 'max-w-xl text-lg',
  full: 'w-full text-base',
  md_full: 'md:max-w-md w-full text-base',
};

export default function Input(props: Props) {
  const color = props.color ?? 'primary';
  const size = props.size ?? 'md';

  return (
    <div className="w-full">
      <input
        type={props.type}
        name={props.name}
        id={props.name}
        placeholder={props.placeholder}
        value={props.type === 'file' ? '' : props.value}
        onChange={(e) => {
          if (props.type === 'file') {
            props.onChange?.(e.target.files as FileList); // Pasa FileList
          } else {
            props.onChange?.(e.target.value); // Pasa string
          }
        }}
        disabled={props.disabled}
        className={`block w-full rounded-md border-2 py-1 px-3 focus:ring-2 focus:ring-offset-1 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${colors[color]} ${sizes[size]} ${props.className}`}
      />
    </div>
  );
}