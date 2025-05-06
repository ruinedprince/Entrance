import React from "react";

interface SocialButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

const SocialButton: React.FC<SocialButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 text-[12px] font-bold font-poppins bg-transparent border border-[#171717] rounded hover:bg-[#171717] hover:text-[#d9d9d9] transition-all duration-500 ease-in-out flex items-center gap-5 justify-center"
    >
      <span className="flex items-center gap-5">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && typeof child.type !== "string") {
            return React.cloneElement(child as React.ReactElement<any>, { style: { color: "currentColor" }, fill: "currentColor" });
          }
          return child;
        })}
      </span>
    </button>
  );
};

export default SocialButton;