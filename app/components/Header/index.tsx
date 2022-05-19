import { Link } from "@remix-run/react";
import { styled } from "~/styles/stitches.config";

const HeaderWrapper = styled("header", {
  height: "$5",
  backgroundColor: "$primary500",
  display: "flex",
  gap: "$3",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "$5",
});

const HeaderTitle = styled("h1", {
  color: "$neutral100",
  margin: "0",
});
const HeaderLinks = styled("div", {
  display: "flex",
  gap: "$3",
});

export interface HeaderWrapperProps {
  children: React.ReactNode;
}

export default function Navigation({
  children,
}: HeaderWrapperProps): React.ReactElement {
  return (
    <HeaderWrapper>
      <Link to="/" style={{ textDecoration: "none" }}>
        <HeaderTitle>Hand Engineering Market</HeaderTitle>
      </Link>
      <HeaderLinks> {children}</HeaderLinks>
    </HeaderWrapper>
  );
}
