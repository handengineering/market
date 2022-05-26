import { styled } from "~/styles/stitches.config";

const Textarea = styled("textarea", {
  width: "100%",
  height: "$1",
  backgroundColor: "$neutral100",
  border: "1px solid $neutral500",
  borderRadius: "$1",
  fontSize: "$2",
  padding: "$1 $2",
  marginBottom: "$3",
  "&:focus": {
    outline: "none",
  },
});

export default Textarea;
