
interface Props {
    name: string;
    type: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    color?: keyof typeof colors;
    size?: keyof typeof sizes;
}

const colors = {
    primary: 'bg-white text-gray-900 border-primary/40 placeholder:text-gray-400 focus:border-primary focus:ring-primary/25',
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
                value={props.value}
                onChange={(e) => props.onChange && props.onChange(e.target.value)}
                className={`block w-full rounded-md border-2 focus:ring-2 focus:ring-offset-1 transition-colors duration-300 ${colors[color]} ${sizes[size]}`}
            />
        </div>
    );
}