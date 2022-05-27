import type {
  FullProduct,
  SelectedProductOption,
  ProductVariant,
} from "~/models/ecommerce-provider.server";

export const getMatchingVariant = (
  product: FullProduct,
  selectedProductOptions: SelectedProductOption[]
): ProductVariant | undefined =>
  product.variants.find((variant) => {
    return variant.selectedOptions.find((selectedOption) => {
      return selectedProductOptions.every(
        (selectedProductOption) =>
          selectedProductOption.name === selectedOption.name &&
          selectedProductOption.value === selectedOption.value
      );
    });
  });
