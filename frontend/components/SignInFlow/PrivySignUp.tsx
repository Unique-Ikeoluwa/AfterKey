"use client";

import { useState, useEffect } from "react";
import { FaEnvelope, FaWallet, FaArrowRight, FaCheck } from "react-icons/fa";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import CreateWalletButton from "../Wallet/CreateWalletButton";

export default function PrivySignIn() {
  const { sendCode, loginWithCode } = useLoginWithEmail();
  const { authenticated, ready } = usePrivy();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authenticated) {
      toast.success("Successfully signed in!");
    }
  }, [authenticated]);

  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      await sendCode({ email });
      toast.success(`Verification code sent to ${email}`);
      setStep("code");
    } catch (err) {
      toast.error("Failed to send verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    try {
      await loginWithCode({ code });
    } catch (err) {
      toast.error("Invalid or expired code.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!ready) return null;

  return (
    <div className="max-w-md w-full mx-auto p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-2xl text-gray-200 relative">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1e1b4b",
            color: "#FFFFFF",
            border: "1px solid #312e81",
          },
        }}
      />

      <div className="flex flex-col items-center mb-8 text-center">
        <div className="p-4 bg-indigo-500/10 rounded-2xl mb-4">
          <FaWallet className="text-indigo-400 text-3xl" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          {!authenticated
            ? step === "email"
              ? "Create Account"
              : "Verify Email"
            : "Account Ready"}
        </h2>
        <p className="text-gray-400 mt-2">
          {!authenticated
            ? step === "email"
              ? "Secure your assets with AfterKey"
              : "Enter the code sent to your inbox"
            : "Email verified. Create your wallet below."}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!authenticated ? (
          step === "email" ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="space-y-6">
                <div className="flex items-center border border-slate-700 bg-slate-950/50 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                  <FaEnvelope className="text-slate-500 mr-3" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-transparent flex-1 outline-none text-white placeholder:text-slate-600"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <button
                  onClick={handleSendCode}
                  disabled={!email.includes("@") || isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    email.includes("@") && !isLoading
                      ? "bg-gradient-to-br from-indigo-700 to-indigo-500 font-bold hover:scale-[1.02] shadow-lg shadow-indigo-500/20 text-white"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      Continue <FaArrowRight className="text-xs" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="code-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="space-y-6">
                <div className="flex items-center border border-slate-700 bg-slate-950/50 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                  <input
                    type="text"
                    placeholder="000000"
                    className="bg-transparent w-full flex-1 outline-none text-white text-center text-3xl tracking-[0.3em] md:tracking-[0.5em] pl-[0.5em] md:pl-0 font-mono placeholder:text-slate-800"
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    value={code}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep("email")}
                    className="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800 py-4 rounded-xl font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyCode}
                    disabled={code.length < 6 || isLoading}
                    className={`flex-[2] px-8 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      code.length >= 6 && !isLoading
                        ? "bg-gradient-to-br from-indigo-800 via-indigo-700 to-indigo-800 hover:scale-[1.02] shadow-lg shadow-indigo-500/20 text-white"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      "Verifying..."
                    ) : (
                      <div className="flex items-center gap-2">
                        Verify <FaCheck className="text-xs" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )
        ) : (
          <motion.div
            key="wallet-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="pt-4 border-t border-slate-800">
              <CreateWalletButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 pt-6 border-t border-slate-800/50 text-center space-y-4">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors underline-offset-4 hover:underline"
          >
            Login
          </Link>
        </p>

        <p className="text-xs text-gray-500 leading-relaxed">
          By signing up, you agree to AfterKey's <br />
          <span className="text-indigo-400 cursor-pointer hover:underline">
            Terms of Service
          </span>
        </p>
      </div>
    </div>
  );
}
