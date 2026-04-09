
import type { ReactNode } from "react";

interface MiniCardProps {
    svg: ReactNode;
    title: string;
    description: string;
}

export default function MiniCard({ svg, title, description }: MiniCardProps) {
return (
    <div className="group bg-card rounded-xl p-7 flex flex-col items-center text-center sm:items-start md:text-left border-2 border-black shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:border-primary">
        <div className="h-20 w-20 mb-2 py-2 justify-center self-center md:self-start bg-primary-300 rounded-4xl transition-all duration-300 group-hover:scale-105 group-hover:bg-primary-400">{svg}</div>
        <h3 className="text-xl font-semibold mb-2 w-full text-center md:text-left">{title}</h3>
        <p className="text-muted-foreground w-full text-center md:text-left">{description}</p>
    </div>
);
}