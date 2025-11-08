import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signUpSchema } from "@/lib/zodSchemas";
import { z } from "zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
const BASE_URL = import.meta.env.VITE_API_URL;

import VerifyEmailModal from "@/components/VerifyEmailModal";

type Mode = "login" | "signup";
type LoginFormType = z.infer<typeof loginSchema>;
type SignUpFormType = z.infer<typeof signUpSchema>;

export const AuthCard = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const isSignUp = mode === "signup";
  const { refetchUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormType | SignUpFormType>({
    resolver: zodResolver(isSignUp ? signUpSchema : loginSchema),
  });

  const onSubmit = async (data: any) => {
  const endpoint =
    mode === "signup"
      ? `${BASE_URL}/api/auth/signup`
      : `${BASE_URL}/api/auth/login`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      if (result.unverified) {
        setSignupEmail(data.email);

        if (mode === "signup") {
          toast("Email already in use. Head to the Login Section and verify your email.");
        } else {
          // Optional: auto-resend code
          await fetch(`${BASE_URL}/api/auth/resend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email }),
          });

          toast("Please verify your email to continue.");
          setShowVerifyModal(true);
        }

        return;
      }

      toast.error(result.error || "Something went wrong");
      return;
    }

    if (mode === "signup") {
      setSignupEmail(data.email);
      setShowVerifyModal(true);
      toast.success("Verification code sent!");
    } else {
      toast.success("Login successful!");
      await refetchUser();
      navigate("/HomePage");
    }
  } catch (err) {
    console.error(err);
    toast.error("Network error. Please try again.");
  }
};


  const bgGradient = isDark
    ? "bg-gradient-to-br from-[#19183B] to-[#2C2B5A]"
    : "bg-gradient-to-br from-[#E7F2EF] to-[#A1C2BD]";
  const cardBg = isDark
    ? "bg-[#2C2B5A] text-white border border-[#3C3B63]"
    : "bg-white text-[#19183B] border border-[#A1C2BD]";
  const inputBg = isDark ? "bg-[#19183B]" : "bg-white";
  const inputBorder = isDark ? "border-[#3C3B63]" : "border-[#A1C2BD]";
  const subtextColor = isDark ? "text-[#AAB3D0]" : "text-[#708993]";
  const buttonPrimary = isDark
    ? "bg-[#3a31d8] text-white hover:bg-[#C4C4F0]"
    : "bg-[#19183B] text-white hover:text-white hover:bg-[#708993]";

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgGradient} px-4`}>
      <div className={`w-full max-w-md rounded-xl shadow-xl p-8 ${cardBg}`}>
        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          {["login", "signup"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setMode(tab as Mode);
                reset();
              }}
              className={`px-4 py-2 rounded-md font-medium transition ${
                mode === tab
                  ? buttonPrimary
                  : `${inputBg} ${subtextColor} border ${inputBorder}`
              }`}
            >
              {tab === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Heading */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <img className="w-10 h-10" src="/logo.svg" alt="EchoSpace logo" />
          <h2 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-[#00FFD1] via-[#00BFFF] to-[#6A5ACD] text-transparent bg-clip-text font-orbitron">
            EchoSpace
          </h2>
        </div>
        <p className={`text-sm text-center mb-6 ${subtextColor}`}>
          {isSignUp ? "Create your account" : "Log in to continue"}
        </p>

        {/* Animated Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {isSignUp && (
              <div>
                <input
                  {...register("name")}
                  placeholder="Name"
                  className={`w-full px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-[#A1C2BD] ${inputBg} ${inputBorder} border`}
                />
                {"name" in errors && (
                  <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
                )}
              </div>
            )}

            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className={`w-full px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-[#A1C2BD] ${inputBg} ${inputBorder} border`}
              />
              {"email" in errors && (
                <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className={`w-full px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-[#A1C2BD] ${inputBg} ${inputBorder} border`}
              />
              {"password" in errors && (
                <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
              )}
            </div>

            {isSignUp && (
              <div>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-[#A1C2BD] ${inputBg} ${inputBorder} border`}
                />
                {"confirmPassword" in errors && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword?.message}
                  </p>
                )}
              </div>
            )}

            <button type="submit" className={`w-full py-2 rounded-md transition ${buttonPrimary}`}>
              {isSignUp ? "Sign Up" : "Log In"}
            </button>
          </motion.form>
        </AnimatePresence>

        {/* Switch Link */}
        <p className={`text-sm mt-6 text-center ${subtextColor}`}>
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  reset();
                }}
                className="text-[#A1C2BD] underline hover:text-[#708993]"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  reset();
                }}
                className="text-[#A1C2BD] underline hover:text-[#708993]"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>

      {/* Verification Modal */}
      <VerifyEmailModal
        email={signupEmail}
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
      />
    </div>
  );
};
