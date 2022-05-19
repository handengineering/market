import { styled } from "~/styles/stitches.config";

const FlexContainer = styled("div", {
  height: "100%",
  width: "100%",
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
  variants: {
    layout: {
      desktop: {
        flexDirection: "row",
        alignItems: "flex-start",
      },
      mobile: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
  },
});

export default FlexContainer;
