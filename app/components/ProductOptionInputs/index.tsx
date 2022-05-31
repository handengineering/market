import { styled } from "~/styles/stitches.config";
import ProductOptionInput from "~/components/ProductOptionInput";
import type {
  FullProduct,
  ProductOption,
  SelectedProductOption,
} from "~/models/ecommerce-provider.server";
import { getProductOptionIcon } from "~/utils/product";

const ProductOptionInputsInnerWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr ",
  gridGap: "$5",
});

const ProductOptionInputsOuterWrapper = styled("div", {
  "&:not(:last-child)": {
    marginBottom: "$5",
  },
});

export type SelectedOptions = {
  [name: string]: string;
};

export interface ProductOptionInputsProps {
  key: string;
  option: ProductOption;
  product: FullProduct;
  onChange?: (option: SelectedProductOption) => void;
  selectedOptions?: SelectedOptions;
}

export default function ProductOptionInputs({
  option,
  product,
  onChange,
  selectedOptions,
  key,
}: ProductOptionInputsProps) {
  return (
    <ProductOptionInputsOuterWrapper key={key}>
      <h4>{option.name}</h4>
      <ProductOptionInputsInnerWrapper key={key}>
        {option.values.map((value) => {
          const selectedOption =
            selectedOptions && selectedOptions[option.name];

          return (
            <ProductOptionInput
              key={value}
              name={option.name}
              value={value}
              onChange={() =>
                onChange &&
                onChange({
                  name: option.name,
                  value: value,
                })
              }
              checked={selectedOption === value}
              iconImageSrc={getProductOptionIcon(product, option.name, value)}
            />
          );
        })}
      </ProductOptionInputsInnerWrapper>
    </ProductOptionInputsOuterWrapper>
  );
}
