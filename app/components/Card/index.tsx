import { styled } from "~/styles/stitches.config";

const Card = styled("div", {
  display: "flex",
  flexDirection: "row",
  padding: "$3",
  borderRadius: "4px",
  border: "1px solid ghostwhite",
  variants: {
    position: {
      center: {
        alignSelf: "center",
        justifySelf: "center"
      }
    }
  }
  
});

export default Card;
