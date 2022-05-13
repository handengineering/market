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
  "*": {
    fontFamily: "sans-serif",
  },
  html: { fontSize: "100%" },
  body: {
    background: "white",
    fontFamily: "'Helvetica', 'sans-serif'",
    fontWeight: 400,
    lineHeight: 1.5,
    color: "#000000",
  },
  p: { fontSize: "$3", marginBottom: "1rem" },
  "h1, h2, h3, h4, h5": {
    marginBottom: "1rem",
    fontFamily: "'Helvetica', 'sans-serif'",
    fontWeight: 400,
    lineHeight: 1.5,
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
  },
  "*": {
    boxSizing: "border-box",
  },
});

export const globalStyles = () => {
  cssReset();
  baseTypography();
  baseLayout();
};
