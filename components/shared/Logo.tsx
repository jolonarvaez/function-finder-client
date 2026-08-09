import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import { cn } from "@/lib/utils";

const logoVariants = cva("relative shrink-0", {
  variants: {
    size: {
      sm: "size-8",
      regular: "size-12",
      lg: "size-20",
    },
  },
  defaultVariants: {
    size: "regular",
  },
});

const SIZE_PX = {
  sm: 32,
  regular: 48,
  lg: 80,
} as const;

export type LogoProps = Readonly<
  {
    src?: string;
    alt?: string;
    priority?: boolean;
    className?: string;
  } & VariantProps<typeof logoVariants>
>;

export function Logo({
  src = "/logo.png",
  alt = "Function Finder",
  size = "regular",
  priority,
  className,
}: LogoProps) {
  return (
    <div className={cn(logoVariants({ size }), className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${SIZE_PX[size ?? "regular"]}px`}
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}
