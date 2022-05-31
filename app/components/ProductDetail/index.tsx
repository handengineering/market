import { marked } from "marked";
import type { ProductMetafield } from "~/models/ecommerce-provider.server";

export interface ProductDetailProps {
  metafield: ProductMetafield;
}

const getWeightUnitShorthand = (weightUnit: string) => {
  switch (weightUnit) {
    case "GRAMS":
      return "g";
    default:
      return weightUnit;
  }
};

export default function ProductDetail({ metafield }: ProductDetailProps) {
  switch (metafield.type) {
    case "list.dimension":
      const dimensionsArray = JSON.parse(metafield.value);
      return (
        <div key={metafield.id}>
          <h3>{metafield.key}</h3>
          <p>
            {dimensionsArray.map(
              (dimension: { value: string; unit: string }, i: number) =>
                `${dimension.value} ${dimension.unit}${
                  i !== dimensionsArray.length - 1 ? " x " : ""
                }`
            )}
          </p>
        </div>
      );
    case "weight":
      const weight = JSON.parse(metafield.value);

      return (
        <div key={metafield.id}>
          <h3>{metafield.key}</h3>
          <p>{`${weight.value} ${getWeightUnitShorthand(weight.unit)}`}</p>
        </div>
      );
    default:
      return (
        <div
          key={metafield.id}
          dangerouslySetInnerHTML={{
            __html: marked.parse(metafield.value),
          }}
        />
      );
  }
}
