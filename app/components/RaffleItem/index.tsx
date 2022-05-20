import { styled } from "~/styles/stitches.config";

const RaffleItem = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "$9",
  flex: "1",
  "&:after": {
    content: "",
    borderRadius: "4px",
    linearGradient: "0deg, $neutral100 0%, $neutral300 100%",
    zIndex: "$negative",
    top: "calc($sizes$7 / 2)",
    height: "$8",
    width: "100%",
    position: "absolute",
  },
});

export const RaffleItemImage = styled("img", {
  height: "$7",
  width: "auto",
  marginBottom: "$3",
  position: "relative",
});

export const RaffleTitle = styled("h2", {
  fontSize: "$5",
  color: "$primary500",
  whiteSpace: "nowrap",
});

export const RaffleStatus = styled("span", {
  backgroundColor: "$neutral100",
  borderRadius: "$1",
  padding: "0 $5",
  fontSize: "$2",
  marginBottom: "$1",
  borderWidth: "1px",
  borderStyle: "solid",
  variants: {
    status: {
      UPCOMING: {
        color: "$yellow700",
        backgroundColor: "$yellow300",
        borderColor: "$yellow500",
      },
      ACTIVE: {
        color: "$green700",
        backgroundColor: "$green300",
        borderColor: "$green500",
      },
      PAST: {
        color: "$red700",
        backgroundColor: "$red300",
        borderColor: "$red500",
      },
      UNKNOWN: {
        color: "$neutral700",
        backgroundColor: "$neutral300",
        borderColor: "$neutral500",
      },
    },
  },
});

export const RaffleDate = styled("p", {
  fontSize: "$2",
  marginBottom: "$3",
  opacity: ".5",
});

export default RaffleItem;
