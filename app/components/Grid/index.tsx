import { styled } from "~/styles/stitches.config";

const Grid = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gridGap: "$2",
});

export default Grid;
