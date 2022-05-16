import { createStitches } from "@stitches/react";

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      gray500: "hsl(206,10%,76%)",
      blue500: "hsl(206,100%,50%)",
      purple500: "hsl(252,78%,60%)",
      green500: "hsl(148,60%,60%)",
      red500: "hsl(352,100%,62%)",
      pmsBrightWhite: "hsl(72,20%,95%)",
      reflexBlue: "hsl(231, 100%, 27%)",
    },
    space: {
      1: "0.5rem",
      2: "0.75rem",
      3: "1rem",
      4: "1.125rem",
      5: "1.5rem",
      6: "2.25rem",
    },
    fontSizes: {
      1: "0.5rem",
      2: "0.75rem",
      3: "1rem",
      4: "1.125rem",
      5: "1.5rem",
      6: "2.25rem",
    },
    fonts: {
      untitled: "Untitled Sans, apple-system, sans-serif",
      mono: "Söhne Mono, menlo, monospace",
    },
    fontWeights: {},
    lineHeights: {},
    letterSpacings: {},
    sizes: {
      1: "16rem",
      2: "24rem",
      3: "32rem",
      4: "36rem",
      5: "48rem",
      6: "72rem",
    },
    borderWidths: {},
    borderStyles: {},
    radii: {},
    shadows: {},
    zIndices: {},
    transitions: {},
  },
  media: {
    bp1: "(min-width: 480px)",
  },
  utils: {
    marginX: (value: string) => ({ marginLeft: value, marginRight: value }),
  },
});
