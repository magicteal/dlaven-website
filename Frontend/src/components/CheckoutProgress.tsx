import React from "react";

type ProgressProps = { current: "cart" | "checkout" | "confirm" };

export default function CheckoutProgress({ current }: ProgressProps) {
  const steps = ["shopping cart", "shipping & payment", "confirmation"];
  const index = current === "cart" ? 0 : current === "checkout" ? 1 : 2;

  return (
    <div className="flex w-full items-start max-w-2xl mx-auto mb-12">
      {steps.map((step, i) => {
        const active = i <= index;
        const currentStep = i === index;

        return (
          <div key={step} className="flex flex-1 flex-col items-center">
            {/* Line + Dot Row */}
            <div className="flex w-full items-center">
              {/* Left Line */}
              <div
                className="h-[1px] flex-1 transition-colors duration-300"
                style={{
                  backgroundColor: i <= index ? "#431717" : "rgba(67,23,23,0.15)",
                }}
              />

              {/* Dot */}
              <div
                className="mx-3 h-3.5 w-3.5 rounded-full border transition-all duration-300 flex items-center justify-center"
                style={{
                  borderColor: active ? "#431717" : "rgba(67,23,23,0.3)",
                  backgroundColor: active ? "#431717" : "transparent",
                  transform: currentStep ? "scale(1.15)" : "scale(1)",
                }}
              >
                {active && <div className="h-1.5 w-1.5 rounded-full bg-[#F6F4E6]" />}
              </div>

              {/* Right Line */}
              <div
                className="h-[1px] flex-1 transition-colors duration-300"
                style={{
                  backgroundColor: i < index ? "#431717" : "rgba(67,23,23,0.15)",
                }}
              />
            </div>

            {/* Label */}
            <span
              className="mt-3 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-medium transition-colors"
              style={{
                color: "#431717",
                opacity: currentStep ? 0.95 : 0.4,
              }}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
