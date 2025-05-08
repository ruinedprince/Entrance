import React from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

const BackButton: React.FC = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inset-y-2 inset-x-2 flex items-center gap-1 text-[12px] font-bold font-poppins hover:opacity-50 transition-opacity duration-500 ease-in-out"
    >
      <ArrowLeft size={12} weight="bold" />
      <span>Voltar</span>
    </button>
  );
};

export default BackButton;