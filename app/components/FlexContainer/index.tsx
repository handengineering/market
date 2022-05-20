import { styled } from "~/styles/stitches.config";

const FlexContainer = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
  gap: "$5",
  variants: {
    layout: {
      desktop: {
        flexDirection: "row",
        alignItems: "initial",
      },
      mobile: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
  },
});

export default FlexContainer;
