import { styled } from "~/styles/stitches.config";

const Card = styled("div", {
  display: "flex",
  flex: "1",
  marginBottom: "$3",
  flexDirection: "column",
  padding: "$3",
  borderRadius: "4px",
  backgroundColor: "$neutral300",
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
