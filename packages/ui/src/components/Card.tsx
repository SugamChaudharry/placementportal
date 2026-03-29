import type { HTMLAttributes } from "react";
interface CardProps extends HTMLAttributes<HTMLDivElement> { hover?: boolean; }
export function Card({ hover, className = "", children, ...props }: CardProps) {
  return (
    <div {...props} className={"bg-white rounded-xl border border-gray-100 shadow-sm p-5 " + (hover ? "transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer " : "") + className}>
      {children}
    </div>
  );
}
