import React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500 text-white",
      className
    )}
    {...props}
  />
));

Badge.displayName = "Badge";

export { Badge };
