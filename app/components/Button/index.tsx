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
      secondary: {
        backgroundColor: "$green500",
        color: "$green100",
        "&:hover": {
          backgroundColor: "$green300",
        },
      },
      tertiary: {
        backgroundColor: "$yellow500",
        color: "$yellow100",
        "&:hover": {
          backgroundColor: "$yellow300",
        },
      },
      inverse: {
        backgroundColor: "$neutral100",
        color: "$primary500",
        "&:hover": {
          backgroundColor: "$neutral300",
        },
      },
      danger: {
        backgroundColor: "$red500",
        color: "$red100",
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
