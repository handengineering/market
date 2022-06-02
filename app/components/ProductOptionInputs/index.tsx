import ProductOptionInput from "~/components/ProductOptionInput";
import type {
  FullProduct,
  ProductOption,
  SelectedProductOption,
} from "~/models/ecommerce-provider.server";
import { getProductOptionIcon } from "~/utils/product";
import Label from "../Label";

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
}: ProductOptionInputsProps) {
  const selectedOption = selectedOptions && selectedOptions[option.name];
  return (
    <div key={option.name} className="mb-6 last:mb-0">
      <h4 style={{ marginBottom: 0 }}>{option.name}</h4>
      <Label>{selectedOption}</Label>
      <div key={option.name} className="flex items-start gap-4">
        {option.values.map((value) => {
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
      </div>
    </div>
  );
}
