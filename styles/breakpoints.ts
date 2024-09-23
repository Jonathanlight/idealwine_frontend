export const breakpointSmall = "768px";
export const breakpointMedium = "1024px";
export const breakpointLarge = "1280px";
export const breakpointExtraLarge = "1600px";

export const isMobile =
  typeof window !== "undefined"
    ? window.matchMedia(`(max-width: calc(${breakpointSmall} - 1px))`).matches
    : null;

export const isDesktop =
  typeof window !== "undefined"
    ? window.matchMedia(`(min-width: ${breakpointMedium})`).matches
    : null;

export const isExtraLargeDesktop =
  typeof window !== "undefined"
    ? window.matchMedia(`(min-width: ${breakpointExtraLarge})`).matches
    : null;

export const isTablet = typeof window !== "undefined" ? !isMobile && !isDesktop : null;

export const device =
  typeof window !== "undefined" ? (isMobile ? "mobile" : isDesktop ? "desktop" : "tablet") : null;
