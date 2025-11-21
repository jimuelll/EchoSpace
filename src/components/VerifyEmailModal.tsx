import { useState, useEffect } from "react";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";   // ✅ so we can refetch user
const BASE_URL = import.meta.env.VITE_API_URL;

export default function VerifyEmailModal({
  email,
  isOpen,
  onClose,
}: {
  email: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();
  const { refetchUser } = useAuth();   // ✅ get current user after verify

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",   // ✅ send cookies
        body: JSON.stringify({ email, code }),
      });

      const result = await res.json();
      if (result.success || result.id) {
        toast.success("Account verified!");
        onClose();
        await refetchUser();      // ✅ refresh user context
        navigate("/HomePage");    // ✅ redirect
      } else {
        toast.error(result.error || "Verification failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",   // ✅ send cookies
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Resend failed");
      } else {
        toast.success("New code sent!");
        setCooldown(30); // 30-second cooldown
      }
    } catch {
      toast.error("Network error");
    } finally {
      setResending(false);
    }
  };

  return (
    <HeadlessDialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      <HeadlessDialog.Panel className="relative bg-[#0a0a1a] text-white rounded-xl p-6 w-full max-w-md border border-[#3a31d8]/40">
        <HeadlessDialog.Title className="text-xl font-bold mb-2">Verify Your Email</HeadlessDialog.Title>
        <p className="text-sm mb-4">
          Enter the 6-digit code sent to <strong>{email}</strong>.
        </p>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white mb-4"
        />

        <div className="space-y-3">
          <button
            onClick={handleVerify}
            disabled={loading || !code}
            className="w-full py-2 rounded-md bg-[#3a31d8] text-white font-semibold"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <div className="relative">
            <button
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="w-full py-2 rounded-md bg-white/10 border border-white/20 text-white text-sm"
            >
              {resending
                ? "Resending..."
                : cooldown > 0
                ? `Resend available in ${cooldown}s`
                : "Resend Code"}
            </button>

            {cooldown > 0 && (
              <div
                className="absolute bottom-0 left-0 h-1 bg-[#3a31d8] transition-all duration-1000"
                style={{ width: `${(cooldown / 30) * 100}%` }}
              />
            )}
          </div>
        </div>
      </HeadlessDialog.Panel>
    </HeadlessDialog>
  );
}
