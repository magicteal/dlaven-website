import React from "react";
import Apostrophe from "./Apostrophe";
import Dash from "./Dash";
import Plus from "./Plus";

// Replace common special characters in a string with styled components
export function stylizeText(text: string): React.ReactNode[] {
  // Split and keep delimiters for mapping. Include plus sign so it can be
  // replaced with the Montserrat-styled Plus component.
  const parts = text.split(/([’'—–\-+])/);
  return parts.map((part, idx) => {
    if (part === "'" || part === "’") {
      return <Apostrophe key={idx} />;
    }
    if (part === "-" || part === "–" || part === "—") {
      return <Dash key={idx} />;
    }
    if (part === "+") {
      return <Plus key={idx} />;
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export default function StyledText({ children }: { children: string }) {
  return <>{stylizeText(children)}</>;
}
