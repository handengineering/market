import { styled } from "~/styles/stitches.config";

const Card = styled("div", {
  display: "flex",
  flexDirection: "column",
  minWidth: "320px",
  padding: "$3",
  borderRadius: "4px",
  background: "white",
  boxShadow: "0 0 24px rgba(0,0,0,.1)",
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
