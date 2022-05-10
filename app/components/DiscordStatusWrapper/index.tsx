import { styled } from "~/styles/stitches.config";

const DiscordStatusWrapper = styled('div', {
    border: "2px solid darkslategrey",
    background: "slategrey",
    display: "flex",
    flexDirection: "row",
    maxWidth: "640px",
    padding: "$2",
    marginBottom: "$3",
    borderRadius: "4px"
  });

export default DiscordStatusWrapper;