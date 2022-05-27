import type {
  FullProduct,
  SelectedProductOption,
  ProductVariant,
} from "~/models/ecommerce-provider.server";

export interface OptionsIconsMetafieldValue {
  name: string;
  values: {
    name: string;
    icon: string;
  }[];
}
export type OptionsIconsMetafieldValues = OptionsIconsMetafieldValue[];

export const getMatchingVariant = (
  selectedProductOptions: SelectedProductOption[],
  product?: FullProduct
): ProductVariant | undefined => {
  return product?.variants.find((variant) => {
    const variantSelectedOptions = variant.selectedOptions;

    return (
      selectedProductOptions.length === variantSelectedOptions.length &&
      selectedProductOptions.every(
        (selectedProductOption, index) =>
          selectedProductOption.name === variantSelectedOptions[index].name &&
          selectedProductOption.value === variantSelectedOptions[index].value
      )
    );
  });
};

export function getProductOptionIcon(
  product: FullProduct,
  optionName: string,
  optionValue: string
): string | undefined {
  const optionsIconsMetafield = product.metafields.find(
    (metafield) =>
      metafield.namespace === "options" && metafield.key === "icons"
  );

  const parsedOptionsIconsMetafield: OptionsIconsMetafieldValue[] | undefined =
    optionsIconsMetafield && JSON.parse(optionsIconsMetafield.value);

  const matchingOptionsIconsMetafield =
    parsedOptionsIconsMetafield &&
    parsedOptionsIconsMetafield.find((value) => value.name === optionName);

  const matchingOption =
    matchingOptionsIconsMetafield &&
    matchingOptionsIconsMetafield.values.find(
      (value) => value.name === optionValue
    );

  return matchingOption?.icon;
}
