import React from "react";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  type: "left-side" | "bottom16";
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text, type }) => {
  const tooltipPosition = () => {
    switch (type) {
      case "left-side":
        return (
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 hidden group-hover:block pl-[8px]" style={{ zIndex: 1000 }}>
            <div className="bg-black text-white text-xs rounded py-1 px-3">
              {text}
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 -translate-x-full">
                <svg className="h-2 w-2 text-black" viewBox="0 0 255 255">
                  <polygon className="fill-current" points="0,127.5 127.5,255 127.5,0" />
                </svg>
              </div>
            </div>
          </div>
        );
      case "bottom16":
        return (
          <div className="absolute -left-8 -bottom-16 transform translate-y-full hidden group-hover:block pb-[8px]" style={{ zIndex: 1000 }}>
            <div className="bg-gray-500 text-white text-xs rounded py-1 px-3">
              {text}
              <div className="absolute top-full left-1/2 transform -translate-x -translate-y-[45px]">
                <svg className="h-2 w-2 text-gray-500" viewBox="0 0 255 255">
                  <polygon className="fill-current" points="0,127.5 127.5,255 127.5,0" />
                </svg>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex items-center group">
      {tooltipPosition()}
      {children}
    </div>
  );
};

export default Tooltip;
