import React from "react";
import { useForm } from "react-hook-form";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Heading from "../ui/Heading";
import { postLogin } from "../services/authentication";
import toast from "react-hot-toast";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function AuthenticationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      const response = await postLogin(data);
      console.log(response);
      if (response.status === 200) {
        toast.success(response.message);
        sessionStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        navigate("/");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ebebeb]">
      <div className="w-full max-w-md transform rounded bg-white p-6 shadow-lg transition duration-300 hover:scale-105">
        <div className="mb-6 flex items-center justify-center">
          <Heading level={1} text="Welcome Back" />
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <PersonOutlineIcon className="absolute top-2 left-3 text-gray-400" />
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full rounded bg-gray-100 py-3 pl-10 text-gray-700 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="Email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="relative">
            <LockOutlinedIcon className="absolute top-2 left-3 text-gray-400" />
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full rounded bg-gray-100 py-3 pl-10 text-gray-700 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded bg-gradient-to-r from-[#001D3D] to-[#FFC300] py-3 text-white shadow-lg transition duration-300 hover:opacity-90"
          >
            Login
          </button>
          <button
            type="button"
            className="w-full rounded bg-gray-100 py-3 text-indigo-600 shadow-lg transition duration-300 hover:bg-gray-200"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Forgot password?{" "}
          <a
            href="#"
            className="text-indigo-500 transition hover:text-indigo-700 hover:underline"
          >
            Reset it here
          </a>
        </p>
      </div>
    </div>
  );
}

export default AuthenticationPage;
