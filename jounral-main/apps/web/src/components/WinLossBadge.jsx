import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

const WinLossBadge = ({ isWin }) => {
  return (
    <Badge
      variant="secondary"
      className={`gap-1 font-semibold ${
        isWin
          ? 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]'
          : 'bg-destructive text-destructive-foreground hover:bg-destructive'
      }`}
    >
      {isWin ? (
        <>
          <Check className="w-4 h-4" />
          Win
        </>
      ) : (
        <>
          <X className="w-4 h-4" />
          Loss
        </>
      )}
    </Badge>
  );
};

export default WinLossBadge;