import React from "react";

interface AuthCardProps {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  bottomText?: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  children,
  bottomText,
  className = "",
}) => (
  <div
    className={`w-full max-w-md bg-white text-black rounded-xl border shadow-lg p-8 ${className}`}
  >
    {/* Logo fijo */}
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
      <span className="text-primary font-bold text-xl">SR</span>
    </div>
    <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
    <p className="text-muted-foreground text-center mb-6">{description}</p>
    {children}
    {bottomText && <div className="pt-4">{bottomText}</div>}
  </div>
);
