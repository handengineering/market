import { styled } from "~/styles/stitches.config";

const Button = styled("button", {
  backgroundColor: "$neutral500",
  borderRadius: "$1",
  fontSize: "$2",
  whiteSpace: "nowrap",
  padding: "$1 $2",
  border: "none",
  cursor: "pointer",
  color: "$primary700",
  "&:hover": {
    backgroundColor: "$neutral600",
  },
  variants: {
    color: {
      primary: {
        backgroundColor: "$primary500",
        color: "$primary100",
        "&:hover": {
          backgroundColor: "$primary600",
        },
      },
      secondary: {
        backgroundColor: "$green500",
        color: "$green100",
        "&:hover": {
          backgroundColor: "$green600",
        },
      },
      tertiary: {
        backgroundColor: "$yellow500",
        borderColor: "$yellow400",
        color: "$yellow900",
        "&:hover": {
          backgroundColor: "$yellow600",
        },
      },
      inverse: {
        backgroundColor: "$neutral100",
        color: "$primary500",
        "&:hover": {
          backgroundColor: "$neutral200",
        },
      },
      danger: {
        backgroundColor: "$red500",
        color: "$red100",
        "&:hover": {
          backgroundColor: "$red600",
        },
      },
    },
    fullWidth: {
      true: {
        width: "100%",
      },
    },
    size: {
      large: {
        fontSize: "$3",
        padding: "$2 $5",
        borderRadius: "$2 ",
      },
    },
  },
});

export default Button;
