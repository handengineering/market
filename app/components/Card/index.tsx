import { styled } from "~/styles/stitches.config";

const Card = styled("div", {
  display: "flex",
  flex: "1",
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
    color: {
      yellow: {
        backgroundColor: "$yellow300",
        color: "$yellow700",
      },
      primary: {
        backgroundColor: "$primary500",
        color: "$primary100",
      },
    },
  },
});

export default Card;
