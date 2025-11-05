import { ReactNode } from "react";

type TooltipProps = {
  children: ReactNode;
  element: ReactNode;
};

const Tooltip = ({ children, element }: TooltipProps) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute max-w-90 left-2 top-11 transform mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        {element}
      </div>
      <div className="absolute left-0 w-20 h-4 top-11 pointer-events-auto"></div>
    </div>
  );
};

export default Tooltip;
