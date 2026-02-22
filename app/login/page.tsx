"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { loginRequest, type LoginResponse } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { FaUserAlt, FaUnlockAlt } from "react-icons/fa";

interface LoginFormData {
  email: string;
  senha: string;
  remember: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>();

  const mutation = useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: ({ email, senha }) => loginRequest({ email, senha }),
    onSuccess: (data, variables) => {
      if (data.status === 1) {
        loginStore(
          data.token_de_acesso,
          data.dados_usuario,
          variables.remember
        );

        router.push("/produtos");
      } else {
        setError("root", {
          message: "Usuário ou senha inválidos.",
        });
      }
    },
    onError: () => {
      setError("root", {
        message: "Erro ao conectar com o servidor.",
      });
    },
  });

  function onSubmit(data: LoginFormData) {
    mutation.mutate({
      email: data.email,
      senha: data.senha,
      remember: data.remember,
    });
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-6 sm:py-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/man-in-office.jpg)" }}
    >
      <div className="absolute inset-0 bg-white/10" aria-hidden />
      <div className="relative z-10 flex flex-col gap-6 sm:gap-10 items-center justify-center w-full max-w-[100vw] overflow-x-hidden">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[#80bc04] px-2">
          Bem-vindo a Innovation Brindes
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-10 bg-[#80bc04] p-6 sm:p-10 md:p-20 rounded-xl shadow-md w-full max-w-[95vw] sm:max-w-md md:w-[30%] md:max-w-none flex flex-col items-center gap-4 sm:gap-6"
        >
          {/* USER */}
          <div className="w-full max-w-[280px] sm:max-w-none sm:w-[75%] relative">
            <FaUserAlt
              size="1em"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10"
            />
            <input
              type="text"
              placeholder="Usuário"
              className="w-full bg-white text-[#5d5d5d] rounded-4xl pl-10 sm:pl-14 pr-3 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email", {
                required: "O usuário é obrigatório",
              })}
            />
          </div>
          {errors.email && (
            <p className="text-red-600 text-sm">
              {errors.email.message}
            </p>
          )}

          {/* PASSWORD */}
          <div className="w-full max-w-[280px] sm:max-w-none sm:w-[75%] relative">
            <FaUnlockAlt
              size="1em"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10"
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full bg-white text-[#5d5d5d] rounded-4xl pl-10 sm:pl-14 pr-3 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("senha", {
                required: "A senha é obrigatória",
              })}
            />
          </div>
          {errors.senha && (
            <p className="text-red-600 text-sm">
              {errors.senha.message}
            </p>
          )}

          {/* REMEMBER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 w-full max-w-[280px] sm:max-w-none sm:w-[70%]">
            <label className="flex items-center gap-2 text-xs sm:text-sm text-white">
              <input
                type="checkbox"
                {...register("remember")}
                className="appearance-none w-4 h-4 border rounded 
                checked:border-white relative
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

            <a
              href="#"
              className="text-xs sm:text-sm text-white hover:underline whitespace-nowrap"
            >
              Esqueceu a senha?
            </a>
          </div>

          {/* ROOT ERROR */}
          {errors.root && (
            <p className="text-red-600 text-sm">
              {errors.root.message}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full sm:w-[50%] bg-white text-gray-600 py-2.5 sm:py-2 rounded-md hover:bg-gray-100 transition text-sm sm:text-base"
          >
            {mutation.isPending ? "Entrando..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}