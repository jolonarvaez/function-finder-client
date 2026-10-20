import * as React from "react";

const MOBILE_BREAKPOINT = 768;

function getIsMobile() {
  return typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
}

export function useIsMobile() {
  // Lazy initializer computes the real value on the client's first render
  // (SSR-safe via the typeof guard above) — no need to set it again on mount.
  const [isMobile, setIsMobile] = React.useState(getIsMobile);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(getIsMobile());
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
