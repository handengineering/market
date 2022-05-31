import { Link } from "@remix-run/react";
import { styled } from "~/styles/stitches.config";

const HeaderWrapper = styled("header", {
  width: "100%",
  backgroundColor: "$neutral300",
  display: "flex",
  gap: "$3",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "$3",
  variants: {
    layout: {
      desktop: {
        flexDirection: "row",
      },
      mobile: {
        flexDirection: "column",
      },
    },
  },
});

const HeaderTitle = styled("h1", {
  color: "$primary500",
  fontSize: "$5",
  margin: "0",
  textAlign: "center",
  whiteSpace: "nowrap",
  variants: {
    layout: {
      desktop: {
        whiteSpace: "nowrap",
      },
      mobile: {
        whiteSpace: "normal",
      },
    },
  },
});

const HeaderLinks = styled("div", {
  display: "flex",
  gap: "$3",
  variants: {
    layout: {
      desktop: {
        flexDirection: "row",
        marginBottom: "0",
      },
      mobile: {
        flexDirection: "column",
        marginBottom: "$1",
      },
    },
  },
});

export interface HeaderWrapperProps {
  children: React.ReactNode;
}

export default function Header({
  children,
}: HeaderWrapperProps): React.ReactElement {
  return (
    <HeaderWrapper layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <HeaderTitle layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
          <b>Hand Engineering</b> Market
        </HeaderTitle>
      </Link>
      <HeaderLinks layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
        {children}
      </HeaderLinks>
    </HeaderWrapper>
  );
}
