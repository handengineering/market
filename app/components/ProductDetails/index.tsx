import ProductDetail from "~/components/ProductDetail";
import type { ProductMetafield } from "~/models/ecommerce-provider.server";

export interface ProductDetailsProps {
  metafields: ProductMetafield[];
}

export default function ProductDetails({ metafields }: ProductDetailsProps) {
  const filteredMetafields = metafields.filter(Boolean);
  const componentsMetafield = filteredMetafields.find(
    (metafield) => (metafield.key = "components")
  );
  const dimensionsMetafield = filteredMetafields.find(
    (metafield) => metafield.type === "list.dimension"
  );
  const weightMetafield = filteredMetafields.find(
    (metafield) => metafield.type === "weight"
  );
  const accessoriesMetafield = filteredMetafields.find(
    (metafield) => metafield.type === "accessories"
  );

  return (
    <div className="grid md:grid-cols-4">
      {componentsMetafield ? (
        <div className="p-6">
          <ProductDetail metafield={componentsMetafield} />
        </div>
      ) : null}
      {accessoriesMetafield ? (
        <div className="p-6">
          <ProductDetail metafield={accessoriesMetafield} />
        </div>
      ) : null}
      {dimensionsMetafield ? (
        <div className="p-6">
          <ProductDetail metafield={dimensionsMetafield} />
        </div>
      ) : null}
      {weightMetafield ? (
        <div className="p-6">
          <ProductDetail metafield={weightMetafield} />
        </div>
      ) : null}
    </div>
  );
}
