import { styled } from "~/styles/stitches.config";

const Main = styled("main", {
  padding: "$5",
  flex: 1,
  width: "100%",
  backgroundColor: "$neutral100",
  variants: {
    centerItems: {
      true: {
        alignItems: "center",
      },
    },
  },
});

export default Main;
