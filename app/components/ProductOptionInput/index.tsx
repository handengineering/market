import { styled } from "~/styles/stitches.config";
import Image from "~/components/Image";
import Label from "~/components/Label";
import Input from "~/components/Input";
import type { SelectedProductOption } from "~/models/ecommerce-provider.server";

const ProductOptionInputWrapper = styled("div", {
  display: "flex",
  alignItems: "flex-start",
});

const ProductOptionImage = styled(Image, {
  flexGrow: "0",
  flexShrink: "0",
  flexBasis: "$3",
  minWidth: "0",
  marginRight: "$5",
  objectFit: "contain",
});

export interface ProductOptionInputProps {
  name: string;
  value: string;
  onChange: (option: SelectedProductOption) => void;
  iconImageSrc?: string;
}

export default function ProductOptionInput({
  name,
  value,
  iconImageSrc,
  onChange,
  ...rest
}: ProductOptionInputProps) {
  return (
    <ProductOptionInputWrapper key={value}>
      {iconImageSrc ? <ProductOptionImage src={iconImageSrc} /> : null}
      <Label>
        {value}
        <Input
          type="radio"
          name="option"
          value={JSON.stringify({
            name: name,
            value: value,
          })}
          onChange={() =>
            onChange({
              name: name,
              value: value,
            })
          }
          css={{ marginBottom: 0 }}
        />
      </Label>
    </ProductOptionInputWrapper>
  );
}
