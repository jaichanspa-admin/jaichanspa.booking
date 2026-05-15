import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light" | "terracotta";
}

/**
 * JAI CHAN logo — CI 2026
 * Flower mark (4-petal organic clover) + "JAI CHAN" in expanded tracking.
 * Matches the brand guidebook: horizontal lockup, mark left of wordmark.
 */
export function Logo({ className, size = "md", variant = "dark" }: LogoProps) {
  const iconSize = { sm: 20, md: 28, lg: 42 }[size];
  const textSize = { sm: "text-sm", md: "text-base", lg: "text-2xl" }[size];
  const subSize = { sm: "text-[7px]", md: "text-[8px]", lg: "text-[11px]" }[size];

  const colors = {
    dark: { mark: "#1C150D", text: "#1C150D", sub: "#96583A" },
    light: { mark: "#FDFAF7", text: "#FDFAF7", sub: "#E5DDD4" },
    terracotta: { mark: "#FDFAF7", text: "#FDFAF7", sub: "#E5DDD4" },
  }[variant];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Flower mark — 4-petal organic shape matching CI */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Top-left petal */}
        <path
          d="M20 20 C20 20 6 18 6 9 C6 3 12 0 17 4 C19 6 20 10 20 20Z"
          fill={colors.mark}
        />
        {/* Top-right petal */}
        <path
          d="M20 20 C20 20 22 6 31 6 C37 6 40 12 36 17 C34 19 30 20 20 20Z"
          fill={colors.mark}
        />
        {/* Bottom-right petal */}
        <path
          d="M20 20 C20 20 34 22 34 31 C34 37 28 40 23 36 C21 34 20 30 20 20Z"
          fill={colors.mark}
        />
        {/* Bottom-left petal */}
        <path
          d="M20 20 C20 20 18 34 9 34 C3 34 0 28 4 23 C6 21 10 20 20 20Z"
          fill={colors.mark}
        />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={cn("font-semibold tracking-[0.35em] uppercase", textSize)}
          style={{
            fontFamily: '"Josefin Sans", system-ui, sans-serif',
            color: colors.text,
          }}
        >
          JAI CHAN
        </span>
        <span
          className={cn("tracking-[0.4em] uppercase mt-0.5", subSize)}
          style={{
            fontFamily: '"Josefin Sans", system-ui, sans-serif',
            color: colors.sub,
            fontWeight: 300,
          }}
        >
          SPA &amp; MASSAGE
        </span>
      </div>
    </div>
  );
}
