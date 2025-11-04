import { Lock, Scale } from "lucide-react";
import clsx from "clsx";

type BrandLogoProps = {
  className?: string;
};

export const BrandLogo = ({ className }: BrandLogoProps) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 select-none text-base-content",
        className,
      )}
    >
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 shadow-inner">
        <Scale className="h-6 w-6 text-primary" strokeWidth={2.25} />
        <Lock
          className="absolute -bottom-1 -right-1 h-4 w-4 text-primary"
          strokeWidth={2.5}
        />
      </div>
      <div className="leading-tight">
        <div className="text-xs font-medium uppercase tracking-[0.32em] text-base-content/60">
          Veiled
        </div>
        <div className="text-2xl font-black">
          Order <span className="text-primary">Hub</span>
        </div>
      </div>
    </div>
  );
};
