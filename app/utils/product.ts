import type {
  FullProduct,
  SelectedProductOption,
  ProductVariant,
} from "~/models/ecommerce-provider.server";

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
