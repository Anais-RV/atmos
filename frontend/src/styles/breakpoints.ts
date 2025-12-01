// src/styles/breakpoints.ts
export const BREAKPOINTS = {
  mobileXS: 320,
  mobile: 480,
  tablet: 768,
  tabletLandscape: 1024,
  laptop: 1280,
  desktop: 1440,
  wide: 1920,
};

export const MEDIA = {
  mobileXS: `@media (min-width: ${BREAKPOINTS.mobileXS}px)`,
  mobile: `@media (min-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `@media (min-width: ${BREAKPOINTS.tablet}px)`,
  tabletLandscape: `@media (min-width: ${BREAKPOINTS.tabletLandscape}px)`,
  laptop: `@media (min-width: ${BREAKPOINTS.laptop}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.desktop}px)`,
  wide: `@media (min-width: ${BREAKPOINTS.wide}px)`,
};
