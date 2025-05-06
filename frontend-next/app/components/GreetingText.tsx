import React from "react";

interface GreetingTextProps {
  text: string; // Prop to allow customizable text
}

const GreetingText: React.FC<GreetingTextProps> = ({ text }) => {
  return (
    <h1 className="font-black text-2xl mb-5 text-[#171717]">
      {text}
    </h1>
  );
};

export default GreetingText;