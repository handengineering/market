import { styled } from "~/styles/stitches.config";

const Main = styled("main", {
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  padding: "$5",
  height: "100%",
  flex: 1,
  variants: {
    centerItems: {
      true: {
        alignItems: "center",
      },
    },
  },
});

export default Main;
