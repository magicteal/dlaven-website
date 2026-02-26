import React from "react";

type ProgressProps = { current: "cart" | "checkout" | "confirm" };

export default function CheckoutProgress({ current }: ProgressProps) {
  const steps = ["cart", "checkout", "confirmation"];
  const index = current === "cart" ? 0 : current === "checkout" ? 1 : 2;

  return (
    <div className="flex w-full items-start">
      {steps.map((step, i) => {
        const active = i <= index;
        const currentStep = i === index;

        return (
          <div key={step} className="flex flex-1 flex-col items-center">
            {/* Line + Dot Row */}
            <div className="flex w-full items-center">
              {/* Left Line */}
              <div
                className={`h-[2px] flex-1 ${
                  i <= index ? "bg-black" : "bg-black/25"
                }`}
              />

              {/* Dot */}
              <div
                className={`mx-2 h-3 w-3 rounded-full border-2 transition-all ${
                  active
                    ? "border-black bg-black"
                    : "border-black/30 bg-white"
                } ${currentStep ? "scale-110" : ""}`}
              />

              {/* Right Line */}
              <div
                className={`h-[2px] flex-1 ${
                  i < index
                    ? "bg-black"
                    : "bg-black/25"
                }`}
              />
            </div>

            {/* Label */}
            <span
              className={`mt-3 text-[11px] tracking-[0.25em] uppercase ${
                currentStep ? "text-black" : "text-black/50"
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
