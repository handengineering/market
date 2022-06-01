import { styled } from "~/styles/stitches.config";

const Grid = styled("div", {
  display: "grid",
  gridTemplateRows: "1fr",
  gridTemplateColumns: "auto",
  gridGap: "$5",
  variants: {
    layout: {
      mobile: { gridTemplateColumns: "1fr" },
      desktop: { gridTemplateColumns: "1fr 1fr 1fr" },
    },
  },
});

export default Grid;
