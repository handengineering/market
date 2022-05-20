import { styled } from "~/styles/stitches.config";

const Grid = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gridGap: "$5",
  variants: {
    layout: {
      mobile: { gridTemplateColumns: "1fr" },
      desktop: { gridTemplateColumns: "1fr 1fr 1fr" },
    },
  },
});

export default Grid;
