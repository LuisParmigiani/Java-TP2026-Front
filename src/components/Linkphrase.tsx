import { Link } from "react-router-dom";

const sizetypes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
};
const colortypes = {
    primary: 'text-primary hover:text-primary/80',
    secondary: 'text-secondary hover:text-secondary/80',
    gray: 'text-gray-500 hover:text-gray-700',
    grayPrimary: 'text-gray-500 hover:text-primary',
    secundaryPrimary: 'text-secondary hover:text-primary',
    black: 'text-black hover:text-gray-800',
    blackPrimary: 'text-black hover:text-primary',

};


export default function LinkPhrase({ text, url, size, color }: { text: string; url: string, size: 'sm' | 'md' | 'lg', color: 'primary' | 'secondary' | 'gray' | 'grayPrimary' | 'secundaryPrimary' | 'black' | 'blackPrimary' }) {
    return (
        <Link to={url} className={`${sizetypes[size]} ${colortypes[color]} transition-colors duration-200`}>
            {text}
        </Link>
    );
}