import { styled } from "~/styles/stitches.config";

const Input = styled("input", {
  width: "100%",
  height: "$1",
  backgroundColor: "$neutral100",
  border: "1px solid $neutral500",
  borderRadius: "2px",
  fontSize: "$2",
  padding: "$1 $2",
  marginBottom: "$3",
  "&:focus": {
    outline: "none",
  },
  "&[type='radio']": {
    borderWidth: "$3",
    borderRadius: "$3",
    appearance: "none",
    display: "flex",
    height: "$1",
    width: "$1",
    margin: "$2 0 $3 0",
    justifyContent: "center",
    alignItems: "center",
    "&:checked": {
      "&:before": {
        content: "",
        background: "$primary700",
        borderRadius: "$1",
        flex: "1",
        minWidth: "calc($1/2)",
        minHeight: "calc($1/2)",
      },
    },
  },
});

export default Input;
