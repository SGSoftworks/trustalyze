import { NavLink } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <NavLink to="/" className={`flex items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt="Trustalyze Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <span
          className={`font-semibold tracking-tight ${textSizeClasses[size]}`}
        >
          Trustalyze
        </span>
      )}
    </NavLink>
  );
}
