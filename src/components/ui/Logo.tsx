
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("relative", className)}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="4" y="4" width="32" height="32" rx="16" className="fill-brand-purple" />
        <path d="M20 12v16M12 20h16" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M14 28L26 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};
