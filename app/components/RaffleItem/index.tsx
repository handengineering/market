import { styled } from "~/styles/stitches.config";

const RaffleItem = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "$8",
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
  fontSize: "$6",
  fontWeight: "bold",
  color: "$primary500",
});

export const RaffleStatus = styled("span", {
  backgroundColor: "$neutral100",
  borderRadius: "$1",
  padding: "0 $3",
  fontSize: "$3",
  marginBottom: "$1",
});

export const RaffleDate = styled("p", {
  fontSize: "$2",
  marginBottom: "$3",
  opacity: ".5",
});

export default RaffleItem;
