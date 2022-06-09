module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: {
        900: "#00041A",
        800: "#000836",
        700: "#000C52",
        600: "#00106E",
        500: "#001489",
        400: "#3949A7",
        300: "#727EC5",
        200: "#ABB3E3",
        100: "#E5E9FF",
      },
      neutral: {
        900: "#0D0A10",
        800: "#403C45",
        700: "#736E7A",
        600: "#A6A0AF",
        500: "#DAD2E2",
        400: "#E0D9E7",
        300: "#E6E0EC",
        200: "#ECE7F1",
        100: "#F2EFF5",
      },
      yellow: {
        900: "#1A1600",
        800: "#534800",
        700: "#8C7A00",
        600: "#C5AC00",
        500: "#FEDD00",
        400: "#FEE539",
        300: "#FEED72",
        200: "#FEF5AB",
        100: "#FFFCE5",
      },
      red: {
        900: "#190301",
        800: "#511009",
        700: "#891D11",
        600: "#C12A19",
        500: "#F93822",
        400: "#FA6453",
        300: "#FB9084",
        200: "#FCBCB5",
        100: "#FEE9E6",
      },
      green: {
        900: "#001A14",
        800: "#003E30",
        700: "#00624C",
        600: "#008668",
        500: "#00AB84",
        400: "#39C0A1",
        300: "#39C0A1",
        200: "#ABEADB",
        100: "#E5FFF9",
      },
    },
    fontFamily: {
      soehne: ["soehne, apple-system, sans-serif"],
      soehneBreit: ["soehne breit, apple-system, sans-serif"],
      soehneMono: [
        "soehne mono, Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace;",
      ],
    },
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {},
        },
        brand: {
          css: {
            "--tw-prose-body": theme("colors.primary[700]"),
            "--tw-prose-headings": theme("colors.primary[500]"),
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
