import { styled } from "~/styles/stitches.config";

const SelectWrapper = styled("div", {
  width: "100%",
  height: "$1",
  borderRadius: "$1",
  fontSize: "$2",
  marginBottom: "$3",
  marginLeft: "0",
  marginRight: "0",
  display: "grid",
  gridTemplateAreas: "'select'",
  alignItems: "center",
  "&:focus": {
    outline: "none",
  },
  "&:after": {
    content: "⬇",
    gridArea: "select",
    justifySelf: "end",
    paddingRight: "$2",
    color: "$neutral500",
  },
});

const SelectComponent = styled("select", {
  appearance: "none",
  width: "100%",
  padding: "$1 $2",
  backgroundColor: "$neutral100",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "$neutral500",
  cursor: "pointer",
  gridArea: "select",
});

export interface SelectProps {
  children: React.ReactNode;
  [x: string]: any;
}

export default function Select({ children, ...rest }: SelectProps) {
  return (
    <SelectWrapper>
      <SelectComponent {...rest}>{children}</SelectComponent>
    </SelectWrapper>
  );
}
