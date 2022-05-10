import { styled } from "~/styles/stitches.config";

const Button = styled("button", {
  backgroundColor: "lightgray",
  borderRadius: "8px",
  fontSize: "$2",
  padding: "$1 $2",
  marginBottom: "$3",
  border: "none",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "darkgray",
  },
  variants: {
    color: {
      primary: {
        backgroundColor: "midnightblue",
        color: "white"
      },
      danger: {
        backgroundColor: "tomato",
      },
    },
  },
});

export default Button;
