import React, { useState } from "react";
import { User, MagnifyingGlass, Heart, Ticket,CalendarPlus, Calendar, SignOut } from "phosphor-react";
import FormContainer from "./FormContainer";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between w-full max-w-[1230px] mx-auto relative mt-2">
      <div className="flex">
        <a href="/" className="logo">
          <img
            src="/images/logo-branca.png.webp"
            alt="Logo"
            className="w-40 object-contain"
          />
        </a>
        <div className="search-bar flex ml-5 h-full w-[380px] relative flex items-center backdrop-blur-lg">
          <div className="absolute inset-y-0 left-4 flex items-center">
            <MagnifyingGlass size={16} color="#21CF63" weight="bold" />
          </div>
          <input
            type="text"
            placeholder="Procure sua festa"
            className="w-full h-[40px] pl-10 rounded-full focus:outline-none focus:ring-0 font-bold font-poppins text-xs text-[#f9f9f9] placeholder-[#f9f9f9] bg-[rgba(40,40,40,0.5)]"
            style={{ border: "none" }}
          />
        </div>
      </div>
      <div
        className="profile-icon relative flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[#21CF63] cursor-pointer"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <User size={16} color="#171717" />
      </div>
      {menuOpen && (
        <div
          className="bg-[#d9d9d9] absolute right-0 top-0 mt-[40px] shadow-custom-double rounded-md rounded-l-[40px] rounded-r-sm py-8"
          style={{ zIndex: 1000 }}
        >
          <ul className="flex flex-col w-full font-poppins font-bold text-xs">
            <li className="px-8 py-2 hover:bg-[rgba(40,40,40,0.5)] cursor-pointer flex items-center">
             <Ticket className= "mr-5"size={24} color="#131211" weight="bold"/> Meus Ingressos
            </li>
            <li className="px-8 py-2 hover:bg-[rgba(40,40,40,0.5)] cursor-pointer flex items-center">
             <Heart className="mr-5" size={24} color="#131211" weight="bold" /> Eventos favoritos
            </li>
            <div
              className="h-px border-t px-4"
              style={{
                borderImage: "linear-gradient(to right, #21CF63, #8A35CE) 1",
              }}
            ></div>
            <li className="px-8 py-2 hover:bg-[rgba(40,40,40,0.5)] cursor-pointer flex items-center">
             <CalendarPlus className="mr-5"size={24} color="#131211" weight="bold" /> Publicar evento
            </li>
            <li className="px-8 py-2 hover:bg-[rgba(40,40,40,0.5)] cursor-pointer flex items-center">
             <Calendar className="mr-5" size={24} color="#131211" weight="bold" /> Meus eventos publicados
            </li>
            <div
              className="h-px gap-5 border-t"
              style={{
                borderImage: "linear-gradient(to right, #21CF63, #8A35CE) 1",
              }}
            ></div>
            <li
              className="px-8 py-2 hover:bg-[rgba(40,40,40,0.5)] cursor-pointer text-red-500 flex items-center"
              onClick={() => {
                localStorage.removeItem("token"); // Remove o token de autenticação
                window.location.href = "/auth/login"; // Redireciona para a página de login
              }}
            >
             <SignOut className="mr-5"size={24} color="#ff0000" weight="bold" /> Sair
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
