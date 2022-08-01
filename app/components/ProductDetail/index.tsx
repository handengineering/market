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

const getDimensionUnitShorthand = (dimensionUnit: string) => {
  switch (dimensionUnit) {
    case "MILLIMETERS":
      return "mm";
    default:
      return dimensionUnit;
  }
};

export default function ProductDetail({ metafield }: ProductDetailProps) {
  switch (metafield.type) {
    case "list.dimension":
      const dimensionsArray = JSON.parse(metafield.value);
      return (
        <div key={metafield.id} className="prose prose-brand">
          <h3>Dimensions</h3>
          <p>
            {dimensionsArray.map(
              (dimension: { value: string; unit: string }, i: number) =>
                `${dimension.value} ${getDimensionUnitShorthand(
                  dimension.unit
                )}${i !== dimensionsArray.length - 1 ? " x " : ""}`
            )}
          </p>
        </div>
      );
    case "weight":
      const weight = JSON.parse(metafield.value);

      return (
        <div key={metafield.id} className="prose prose-brand">
          <h3>Weight</h3>
          <p>{`${weight.value} ${getWeightUnitShorthand(weight.unit)}`}</p>
        </div>
      );
    default:
      return (
        <div>
          <div
            key={metafield.id}
            dangerouslySetInnerHTML={{
              __html: marked.parse(metafield.value),
            }}
            className="prose prose-brand"
          />
        </div>
      );
  }
}
