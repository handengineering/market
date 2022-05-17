import { styled } from "~/styles/stitches.config";

const Input = styled("input", {
  width: "100%",
  height: "$1",
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
