/* eslint-disable no-dupe-keys */
import { globalCss } from "./stitches.config";

export const cssReset = globalCss({
  "html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, main, menu, nav, output, ruby, section, summary, time, mark, audio, video":
    {
      margin: "0",
      padding: "0",
      border: "0",
      fontSize: "100%",
      font: "inherit",
      verticalAlign: "baseline",
    },
  "article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section":
    {
      display: "block",
    },
  "*[hidden]": {
    display: "none",
  },
  body: {
    lineHeight: "1",
  },
  "ol, ul": {
    listStyle: "none",
  },
  "blockquote, q": {
    quotes: "none",
  },
  "blockquote:before, blockquote:after, q:before, q:after": {
    content: "",
    // @ts-ignore
    content: "none", // eslint-disable-line
  },
  table: {
    borderSpacing: "0",
  },
});

export const baseTypography = globalCss({
  "@font-face": [
    {
      fontFamily: "soehne",
      src: "url('/fonts/soehne-web-buch.woff2') format('woff2'), url('/fonts/soehne-web-buch.woff') format('woff'), url('/fonts/soehne-web-buch.eot') format('embedded-opentype')",
      fontWeight: "normal",
      fontStyle: "normal",
    },
    {
      fontFamily: "soehne",
      src: "url('/fonts/soehne-web-buch-kursiv.woff2') format('woff2'), url('/fonts/soehne-web-buch-kursiv.woff') format('woff'), url('/fonts/soehne-web-buch-kursiv.eot') format('embedded-opentype')",
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      fontFamily: "soehne",
      src: "url('/fonts/soehne-web-halbfett.woff2') format('woff2'), url('/fonts/soehne-web-halbfett.woff') format('woff'), url('/fonts/soehne-web-halbfett.eot') format('embedded-opentype')",
      fontWeight: "600",
      fontStyle: "normal",
    },
    {
      fontFamily: "soehne",
      src: "url('/fonts/soehne-web-fett.woff2') format('woff2'), url('/fonts/soehne-web-fett.woff') format('woff'), url('/fonts/soehne-web-fett.eot') format('embedded-opentype')",
      fontWeight: "700",
      fontStyle: "normal",
    },
    {
      fontFamily: "soehne breit",
      src: "url('/fonts/soehne-breit-web-buch.woff2') format('woff2'), url('/fonts/soehne-breit-web-buch.woff') format('woff'), url('/fonts/soehne-breit-web-buch.eot') format('embedded-opentype')",
      fontWeight: "normal",
      fontStyle: "normal",
    },
    {
      fontFamily: "soehne breit",
      src: "url('/fonts/soehne-breit-web-fett.woff2') format('woff2'), url('/fonts/soehne-breit-web-fett.woff') format('woff'), url('/fonts/soehne-breit-web-fett.eot') format('embedded-opentype')",
      fontWeight: "700",
      fontStyle: "normal",
    },
  ],

  "*": {
    fontFamily: "sans-serif",
  },
  html: { fontSize: "100%" },
  body: {
    backgroundColor: "$neutral100",
    fontFamily: "'soehne', 'sans-serif'",
    fontWeight: 400,
    lineHeight: 1.5,
    color: "$primary700",
  },
  p: { fontSize: "$3", marginBottom: "1rem" },
  b: { fontWeight: "$bold" },
  "h1, h2, h3, h4, h5": {
    marginBottom: "$3",
    fontFamily: "'soehne breit', 'sans-serif'",
    textTransform: "uppercase",
    lineHeight: 1.5,
  },
  ul: {
    marginBottom: "$3",
  },
  h1: {
    marginTop: 0,
    fontSize: "$6",
  },
  h2: { fontSize: "$5" },
  h3: { fontSize: "$4" },
  h4: { fontSize: "$3" },
  h5: { fontSize: "$2" },
  small: { fontSize: "$1" },
});

export const baseLayout = globalCss({
  "body, html": {
    height: "100%",
    boxSizing: "border-box",
  },
  body: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "$neutral200",
  },
  "*, *:before, *:after": {
    boxSizing: "inherit",
  },
  form: {
    width: "100%",
  },
});

export const globalStyles = () => {
  cssReset();
  baseTypography();
  baseLayout();
};
