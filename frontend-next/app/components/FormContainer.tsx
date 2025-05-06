import React from "react";

type FormContainerProps = {
  children: React.ReactNode;
};

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <div
      id="FormContainer"
      className="relative w-full max-w-md bg-[#d9d9d9] p-8 rounded-lg shadow-md text-center rounded-l-[40px] rounded-r-sm min-w-[580px] mx-auto items-center justify-center gap-5 text-black"
    >
      {children}
    </div>
  );
};

export default FormContainer;
