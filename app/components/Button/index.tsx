import { styled } from "~/styles/stitches.config";

const Button = styled("button", {
  backgroundColor: "$neutral300",
  borderRadius: "$2",
  fontSize: "$2",
  fontWeight: "$bold",
  padding: "$1 $2",
  border: "none",
  cursor: "pointer",
  width: "100%",
  "&:hover": {
    backgroundColor: "$neutral500",
  },
  variants: {
    color: {
      primary: {
        backgroundColor: "$primary500",
        color: "$neutral100",
        "&:hover": {
          backgroundColor: "$primary300",
        },
      },
      danger: {
        backgroundColor: "$red500",
        "&:hover": {
          backgroundColor: "$red300",
        },
      },
    },
    size: {
      large: {
        fontSize: "$3",
        padding: "$2 $5",
        borderRadius: "$3",
      },
    },
  },
});

export default Button;
