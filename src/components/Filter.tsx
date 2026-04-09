import { useState } from 'react';

interface Props {
    name: string;
    options: string[];
    onSave: (options: string) => void;
    color: 'primary' | 'secondary' | 'green' | 'red';
    size: 'sm' | 'md' | 'lg';
}


const color = {
    primary: {
        filterColor: 'text-white',
        options: 'bg-primary-100 text-primary hover:bg-primary-200 border border-primary-300',
        selected: 'bg-primary text-white hover:bg-primary-hover'
    },
    secondary: {
        filterColor: 'text-white',
        options: 'bg-secondary-100 text-secondary hover:bg-secondary-200 border border-secondary-300',
        selected: 'bg-secondary text-white hover:bg-secondary-hover'
    },
    green: {
        filterColor: 'text-white',
        options: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300',
        selected: 'bg-emerald-600 text-white hover:bg-emerald-700'
    },
    red: {
        filterColor: 'text-white',
        options: 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300',
        selected: 'bg-red-600 text-white hover:bg-red-700'
    },
};

const size = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg'
};

export default function Filter(props: Props) {
    const [open, setOpen] = useState(false);


    return (
        <div className="relative w-40 ml-4">
            <button
                className={`w-full min-h-10 px-4 py-2 ${color[props.color].selected} ${size[props.size]} rounded-2xl my-2 flex flex-row items-center justify-between`}
                onClick={() => setOpen(!open)}
            >
                {props.name}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button >
            {open && (
                <div className="absolute top-full left-0 z-50 mt-1 w-full flex flex-col gap-1">
                    {props.options.map((option) => (
                        <button
                            key={option}
                            className={`w-full min-h-10 px-4 py-2 ${size[props.size]} rounded-2xl ${props.name === option ? color[props.color].selected : color[props.color].options}`}
                            onClick={() => {
                                props.onSave(option);
                                setOpen(false);
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )
            }
        </div >
    );
}