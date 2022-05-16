import { styled } from "~/styles/stitches.config";

const Button = styled("button", {
  backgroundColor: "lightgray",
  borderRadius: "8px",
  fontSize: "$2",
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
  },
});

export default Button;
