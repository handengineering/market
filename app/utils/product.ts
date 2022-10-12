import invariant from "tiny-invariant";
import type {
  FullProduct,
  SelectedProductOption,
  ProductVariant,
} from "~/models/ecommerce-provider.server";
import type { SerializedFormDataOptionQuantity } from "./raffleEntryProduct";

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
  const filteredMetafields = product.metafields.filter(Boolean);
  const optionsIconsMetafield = filteredMetafields.find(
    (metafield) =>
      metafield.namespace === "options" && metafield.key === "components"
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

export function getSelectedAccessories(
  fullMatchingAccessories: (FullProduct | undefined)[],
  serializedFormDataQuantities: {
    name: string;
    value: FormDataEntryValue;
  }[]
): {
  variantId: string;
  quantity: number;
}[] {
  return fullMatchingAccessories.map((matchingAccessory) => {
    invariant(matchingAccessory, "matchingAccessory not found");
    const matchingQuantity = serializedFormDataQuantities.find(
      (quantity) => quantity.name === matchingAccessory.id
    );

    return {
      variantId: matchingAccessory.defaultVariantId,
      quantity: matchingQuantity
        ? parseInt(matchingQuantity.value.toString())
        : 0,
    };
  });
}

export function getSelectedAccessoriesWithOptions(
  fullMatchingAccessories: (FullProduct | undefined)[],
  serializedFormDataOptionQuantities: SerializedFormDataOptionQuantity[]
): {
  variantId: string;
  quantity: number;
}[] {
  return fullMatchingAccessories.flatMap((matchingAccessory) => {
    invariant(matchingAccessory, "matchingAccessory not found");

    const matchingOptions = serializedFormDataOptionQuantities.filter(
      (optionQuantity) => optionQuantity.accessoryId === matchingAccessory.id
    );

    return matchingOptions.map((matchingOption) => {
      const matchingQuantity = serializedFormDataOptionQuantities.find(
        (quantityOption) => quantityOption.option === matchingOption.option
      );

      let matchingVariant = getMatchingVariant(
        [{ name: matchingOption.name, value: matchingOption.option }],
        matchingAccessory
      );

      return {
        quantity: matchingQuantity
          ? parseInt(matchingQuantity.value.toString())
          : 0,
        variantId: matchingVariant
          ? matchingVariant.id
          : matchingAccessory.defaultVariantId,
      };
    });
  });
}
