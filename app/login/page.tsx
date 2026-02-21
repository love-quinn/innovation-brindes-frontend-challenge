"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { FaUserAlt, FaUnlockAlt } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      if (data.status === 1) {
        loginStore(data.token_de_acesso, data.dados_usuario, remember);

        router.push("/produtos");
      } else {
        setErrorMessage("Email ou senha inválidos.");
      }
    },
    onError: () => {
      setErrorMessage("Erro ao conectar com o servidor.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    mutation.mutate({
      email,
      senha,
    });
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/man-in-office.jpg)" }}
    >
      <div className="absolute inset-0 bg-white/10" aria-hidden />
      <div className="flex flex-col gap-10 items-center justify-center w-screen">
        <h1 className="text-3xl font-bold text-center text-[#80bc04]">
          Bem-vindo a Innovation Brindes
        </h1>
        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-[#80bc04] p-20 rounded-xl shadow-md w-[30%] flex flex-col items-center justify-center gap-6"
        >
          <div className="w-[75%] relative">
            <FaUserAlt size={"1em"} className="absolute left-6 top-1/2 -translate-y-1/2  text-gray-500 pointer-events-none z-10" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white text-[#5d5d5d] rounded-4xl pl-14 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
              required
              placeholder="Usuário"
            />
          </div>

          <div className="w-[75%] my-0 py-0 mb-0 relative">
            <FaUnlockAlt size={"1em"} className="absolute left-6 top-1/2 -translate-y-1/2  text-gray-500 pointer-events-none z-10" />
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-white text-[#5d5d5d] rounded-4xl pl-14 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
              required
              placeholder="Senha"
            />
          </div>

          <div className="flex items-center justify-between w-[70%]">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="appearance-none w-4 h-4 border rounded 
                checked:bg-transparent
                checked:border-white
                relative
                after:content-['✔']
                after:absolute
                after:text-white
                after:opacity-0
                checked:after:opacity-100
                after:inset-0
                after:flex
                after:items-center
                after:justify-center"

                
              />
              Manter logado
            </label>

            <a href="#" className="text-sm text-white hover:underline">
              Esqueceu a senha?
            </a>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-[50%] bg-white text-gray-600 py-2 rounded-md hover:bg-gray-100 transition"
          >
            {mutation.isPending ? "Entrando..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
