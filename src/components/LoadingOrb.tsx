import { Loader2 } from 'lucide-react';

export function LoadingOrb({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-lg border border-cyan-300/20 bg-cyan-300/5 px-4 py-3 text-sm text-cyan-100">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}
