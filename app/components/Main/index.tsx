import { styled } from "~/styles/stitches.config";

const Main = styled("main", {
  padding: "$5",
  flex: 1,
  width: "100%",
  maxWidth: "$12",
  variants: {
    centerItems: {
      true: {
        alignItems: "center",
      },
    },
  },
});

export default Main;
