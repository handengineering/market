import { styled } from "~/styles/stitches.config";

const Card = styled("div", {
  display: "flex",
  marginBottom: "$3",
  flexDirection: "column",
  minWidth: "320px",
  maxWidth: "640px",
  padding: "$3",
  borderRadius: "4px",
  background: "$neutral300",
  variants: {
    position: {
      center: {
        alignSelf: "center",
        justifySelf: "center",
      },
    },
    align: {
      center: {
        alignItems: "center",
        justifyContent: "center",
      },
    },
  },
});

export default Card;
