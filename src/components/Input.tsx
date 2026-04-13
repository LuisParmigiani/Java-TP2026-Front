import { cn } from './../lib/utils';
import { Upload } from 'lucide-react';
import { useState } from 'react';

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
};

export default function Input(props: Props) {
    const color = props.color ?? 'primary';
    const size = props.size ?? 'md';
    const [preview, setPreview] = useState<string | null>(props.value || null);
    const [isDragOver, setIsDragOver] = useState(false);

    if (props.type === 'image') {
        const handleImageChange = (file: File) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setPreview(result);
                props.onChange?.(result);
            };
            reader.readAsDataURL(file);
        };

        const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.[0]) {
                handleImageChange(e.target.files[0]);
            }
        };

        const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragOver(true);
        };

        const handleDragLeave = () => {
            setIsDragOver(false);
        };

        const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files?.[0]) {
                handleImageChange(e.dataTransfer.files[0]);
            }
        };

        return (
            <div className="w-full">
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        'relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed',
                        'py-8 px-4 cursor-pointer transition-all duration-300',
                        isDragOver
                            ? 'border-primary/80 bg-primary/10'
                            : 'border-primary/40 bg-primary/5 hover:border-primary/60 hover:bg-primary/10'
                    )}
                >
                    <input
                        type="file"
                        name={props.name}
                        id={props.name}
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                    />
                    <label
                        htmlFor={props.name}
                        className="flex flex-col items-center justify-center w-full cursor-pointer"
                    >
                        {preview ? (
                            <div className="relative w-full">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-h-48 object-contain mx-auto rounded-md"
                                />
                                <div className="mt-3 text-center">
                                    <p className="text-sm text-primary font-medium">Cambiar imagen</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 text-primary/60 mb-2" />
                                <p className="text-sm font-medium text-gray-700">
                                    Arrastra una imagen aquí
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    o haz clic para seleccionar
                                </p>
                            </>
                        )}
                    </label>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <input
                type={props.type}
                name={props.name}
                id={props.name}
                placeholder={props.placeholder}
                value={props.value}
                onChange={(e) => props.onChange && props.onChange(e.target.value)}
                className={`block w-full rounded-md border-2 py-1 px-3 focus:ring-2 focus:ring-offset-1 transition-colors duration-300 ${colors[color]} ${sizes[size]}`}
            />
        </div>
    );
}