import { styled } from "~/styles/stitches.config";

const Input = styled("input", {
  backgroundColor: "ghostwhite",
  border: "1px solid lightgrey",
  borderRadius: "2px",
  fontSize: "$2",
  padding: "$1 $2",
  marginBottom: "$3",
  variants: {
    fullWidth: {
      true: {
        width: "100%"
      }
    }
  }
});

export default Input;
