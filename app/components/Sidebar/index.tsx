import { styled } from "~/styles/stitches.config";

const Sidebar = styled("div", {
  flexGrow: "0",
  flexShrink: "0",
  flexBasis: "$7",
  height: "100%",
  paddingRight: "$5",
  borderRightWidth: "1px",
  borderRightStyle: "solid",
  borderRightColor: "$neutral500",
  variants: {
    layout: {
      desktop: { flexGrow: "0", flexShrink: "0", flexBasis: "$7" },
      mobile: {
        flexGrow: "1",
        flexShrink: "1",
        flexBasis: "100%",
        paddingRight: "0",
        borderRightStyle: "none",
      },
    },
  },
});

export const SidebarWraper = styled("div", {
  display: "flex",
  height: "100%",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: "$5",

  variants: {
    layout: {
      desktop: {
        flexDirection: "row",
        alignItems: "flex-start",
      },
      mobile: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
  },
});

export default Sidebar;
