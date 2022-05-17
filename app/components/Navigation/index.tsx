import { styled } from "~/styles/stitches.config";

const NavigationWrapper = styled("nav", {
  height: "$5",
  background: "$reflexBlue",
  display: "flex",
  gap: "$3",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "$5",
});

const NavigationTitle = styled("h1", {
  color: "white",
  margin: "0",
});
const NavigationLinks = styled("div", {
  display: "flex",
  gap: "$3",
});

export interface NavigationWrapperProps {
  children: React.ReactNode;
}

export default function Navigation({
  children,
}: NavigationWrapperProps): React.ReactElement {
  return (
    <NavigationWrapper>
      <NavigationTitle>Hand Engineering Market</NavigationTitle>
      <NavigationLinks> {children}</NavigationLinks>
    </NavigationWrapper>
  );
}
