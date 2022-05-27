import { styled } from "~/styles/stitches.config";
import ProductOptionInput from "~/components/ProductOptionInput";
import type {
  FullProduct,
  ProductOption,
} from "~/models/ecommerce-provider.server";
import { getMatchingVariant } from "~/utils/product";

const ProductOptionInputsWrapper = styled("div", {
  display: "flex",
});

export interface ProductOptionInputsProps {
  option: ProductOption;
  product: FullProduct;
  onChange: (args: any) => void;
}

export default function ProductOptionInputs({
  option,
  product,
  onChange,
}: ProductOptionInputsProps) {
  return (
    <ProductOptionInputsWrapper>
      {option.values.map((value) => {
        const matchingVariant = getMatchingVariant(product, [
          { name: option.name, value },
        ]);

        return (
          <ProductOptionInput
            key={value}
            name={option.name}
            value={value}
            onChange={onChange}
            iconImageSrc={matchingVariant?.icon.reference.image.originalSrc}
          />
        );
      })}
    </ProductOptionInputsWrapper>
  );
}
