import { styled } from "~/styles/stitches.config";

const Input = styled("input", {
  width: "100%",
  minWidth: "100%",
  backgroundColor: "$pmsBrightWhite",
  border: "1px solid lightgrey",
  borderRadius: "2px",
  fontSize: "$2",
  padding: "$1 $2",
  marginBottom: "$3",
  "&:focus": {
    outline: "none",
  },
});

export default Input;
