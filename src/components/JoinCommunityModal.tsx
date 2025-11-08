import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
const BASE_URL = import.meta.env.VITE_API_URL;

interface JoinCommunityResponse {
  community?: any;
  error?: string;
}

interface JoinCommunityModalProps {
  children?: React.ReactNode;
  onJoined?: (community: any) => void;
}

export function JoinCommunityModal({ children, onJoined }: JoinCommunityModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgColor = isDark ? 'bg-[#19183B]' : 'bg-[#F9FAFA]';
  const textColor = isDark ? 'text-white' : 'text-[#19183B]';
  const inputBorder = isDark ? 'border-[#3C3B63]' : 'border-[#C4D6D3]';
  const inputBg = isDark ? 'bg-[#2C2B5A]' : 'bg-white';
  const buttonPrimary = isDark
    ? 'bg-[#3a31d8] text-white hover:bg-[#C4C4F0]'
    : 'bg-[#3a31d8] text-white hover:bg-[#C4C4F0]';
  const subtextColor = isDark ? 'text-[#AAB3D0]' : 'text-[#708993]';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) return toast.error('Please enter a community code');
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/community/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });

      const data = (await res.json()) as JoinCommunityResponse;

      if (res.ok) {
        toast.success('Joined community!');
        onJoined?.(data.community);
        setOpen(false);
        setCode('');
      } else {
        toast.error(data.error || 'Invalid code');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <button className="flex items-center gap-2 hover:text-[#E7F2EF]">
            <UserPlus className="w-4 h-4" /> Join Community
          </button>
        )}
      </DialogTrigger>
      <DialogContent className={`${bgColor} ${textColor} border ${inputBorder}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Enter Community Code</DialogTitle>
          <DialogDescription className={`text-sm ${subtextColor}`}>
            Enter the code of the community you want to join.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Enter code..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`mt-2 ${inputBg} ${inputBorder} border ${inputBorder} text-sm px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#A1C2BD]`}
        />

        <DialogFooter>
          <Button
            onClick={handleJoin}
            disabled={loading}
            className={`w-full mt-4 py-2 rounded transition disabled:opacity-50 ${buttonPrimary}`}
          >
            {loading ? 'Joining...' : 'Join'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
