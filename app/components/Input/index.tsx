import { styled } from "~/styles/stitches.config";

const Input = styled("input", {
  width: "100%",
  height: "$1",
  backgroundColor: "$neutral100",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "$neutral500",
  borderRadius: "$1",
  fontSize: "$2",
  padding: "$1 $2",
  marginBottom: "$3",
  marginLeft: "0",
  marginRight: "0",
  "&:focus": {
    outline: "none",
  },
  "&[type='radio']": {
    appearance: "none",
    cursor: "pointer",
    display: "flex",
    height: "$1",
    width: "$1",
    marginTop: "$2",
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
