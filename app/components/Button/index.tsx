import { styled } from "~/styles/stitches.config";

const Button = styled("button", {
  backgroundColor: "lightgray",
  borderRadius: "$2",
  fontSize: "$2",
  fontWeight: "$bold",
  padding: "$1 $2",
  border: "none",
  cursor: "pointer",
  width: "100%",
  "&:hover": {
    backgroundColor: "darkgray",
  },
  variants: {
    color: {
      primary: {
        backgroundColor: "$reflexBlue",
        color: "white",
      },
      danger: {
        backgroundColor: "tomato",
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
