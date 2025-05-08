import React from "react";

type FormContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <div
      id="FormContainer"
      className="relative w-full max-w-md bg-[#d9d9d9] p-8 rounded-lg shadow-md text-center rounded-l-[40px] rounded-r-sm mx-auto flex flex-col gap-5"
      style={{ width: '100%' }}
    >
      {children}
    </div>
  );
};

export default FormContainer;
