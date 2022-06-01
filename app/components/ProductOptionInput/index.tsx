import { styled } from "~/styles/stitches.config";
import Label from "~/components/Label";
import type { SelectedProductOption } from "~/models/ecommerce-provider.server";

const ProductOptionInputWrapper = styled("div", {
  display: "flex",
  alignItems: "flex-start",
});

const ProductOptionInputComponent = styled("input", {
  appearance: "none",
  cursor: "pointer",
  display: "flex",
  height: "$2",
  width: "$2",
  marginTop: "$2",
  justifyContent: "center",
  alignItems: "center",
  backgroundSize: "cover",
  borderRadius: "$1",
  borderWidth: "2px",
  borderStyle: "solid",
  borderColor: "$neutral500",
  "&:before": {
    borderWidth: "2px",
    borderRadius: "2px",
    borderStyle: "solid",
    borderColor: "$neutral100",
  },
  "&:checked": {
    borderColor: "$neutral900",
    "&:before": {
      content: "",
      flex: "1",
      width: "100%",
      height: "100%",
    },
  },
});

export interface ProductOptionInputProps {
  name: string;
  value: string;
  onChange: (option: SelectedProductOption) => void;
  checked: boolean;
  iconImageSrc?: string;
}

export default function ProductOptionInput({
  name,
  value,
  onChange,
  checked,
  iconImageSrc,
  ...rest
}: ProductOptionInputProps) {
  return (
    <ProductOptionInputWrapper key={value}>
      <Label>
        <ProductOptionInputComponent
          type="radio"
          name={JSON.stringify({
            type: "option",
            name: name,
          })}
          css={{ backgroundImage: `url(${iconImageSrc})` }}
          value={value}
          alt={value}
          checked={checked}
          onChange={() =>
            onChange({
              name: name,
              value: value,
            })
          }
        />
      </Label>
    </ProductOptionInputWrapper>
  );
}
