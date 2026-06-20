// components/account/OrderProgress.tsx
import { cn } from "@/lib/utils";
import { Check, Truck, Home, Package } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

const steps = [
  { key: "placed", label: "Placed", icon: Check },
  { key: "packed", label: "Packed", icon: Package },
  { key: "transit", label: "In transit", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
] as const;

function stepIndexForStatus(status: OrderStatus): number {
  switch (status) {
    case "processing":
      return 0; // placed done, packed in progress
    case "shipped":
      return 2; // placed + packed done, in transit current
    case "delivered":
      return 3; // all done
    case "cancelled":
      return -1;
  }
}

export function OrderProgress({ status }: { status: OrderStatus }) {
  if (status === "cancelled") return null;

  const currentIndex = stepIndexForStatus(status);

  return (
    <div className="px-16 pb-16 pt-3 border-t border-[var(--border-subtle)]">
      <div className="flex items-center">
        {steps.map((step, i) => {
          const isDone = i < currentIndex || (status === "delivered" && i <= currentIndex);
          const isCurrent = i === currentIndex && status !== "delivered";
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-10 shrink-0",
                    isDone && "bg-wine border-wine text-white",
                    isCurrent && "bg-gold-pale border-gold text-gold",
                    !isDone && !isCurrent && "bg-white border-[var(--border-strong)] text-ink-muted"
                  )}
                >
                  <StepIcon size={10} />
                </div>
                <span
                  className={cn(
                    "text-[9px] mt-1 text-center text-ink-muted",
                    isCurrent && "text-wine font-semibold",
                    isDone && "text-ink-secondary"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 -mt-3.5",
                    i < currentIndex ? "bg-wine" : "bg-[var(--border-subtle)]"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}