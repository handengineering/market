import ProductDetail from "~/components/ProductDetail";
import type { ProductMetafield } from "~/models/ecommerce-provider.server";

export interface ProductDetailsProps {
  metafields: ProductMetafield[];
}

export default function ProductDetails({ metafields }: ProductDetailsProps) {
  const componentsMetafield = metafields.find(
    (metafield) => metafield.key === "components"
  );
  const accessoriesMetafield = metafields.find(
    (metafield) => metafield.key === "accessories"
  );
  const dimensionsMetafield = metafields.find(
    (metafield) => metafield.type === "list.dimension"
  );
  const weightMetafield = metafields.find(
    (metafield) => metafield.type === "weight"
  );

  return (
    <div className="grid md:grid-cols-4">
      {componentsMetafield ? (
        <div className="p-6">
          <ProductDetail
            key={componentsMetafield.key}
            metafield={componentsMetafield}
          />
        </div>
      ) : null}
      {accessoriesMetafield ? (
        <div className="p-6">
          <ProductDetail
            key={accessoriesMetafield.key}
            metafield={accessoriesMetafield}
          />
        </div>
      ) : null}
      {dimensionsMetafield ? (
        <div className="p-6">
          <ProductDetail
            key={dimensionsMetafield.key}
            metafield={dimensionsMetafield}
          />
        </div>
      ) : null}
      {weightMetafield ? (
        <div className="p-6">
          <ProductDetail
            key={weightMetafield.key}
            metafield={weightMetafield}
          />
        </div>
      ) : null}
    </div>
  );
}
