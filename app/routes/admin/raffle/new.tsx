import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { createRaffle } from "~/models/raffle.server";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import commerce from "~/services/commerce.server";
import FormWrapper from "~/components/FormWrapper";
import type { Product } from "~/models/ecommerce-provider.server";

export default function Index() {
  const { products } = useLoaderData<LoaderData>();

  return (
    <FormWrapper>
      <Form method="post" action="/admin/raffle/new">
        <h2>Create New Raffle</h2>
        <Input name="name" placeholder="Name" aria-label="Name" type="text" />
        <select name="products">
          {products.map((product) => {
            return (
              <option key={product.slug} value={product.slug}>
                {product.title}
              </option>
            );
          })}
        </select>
        <Button type="submit" color="primary">
          Create New Raffle
        </Button>
      </Form>
    </FormWrapper>
  );
}

interface ActionData {
  errors: {
    name?: string;
  };
}

export let action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");

  if (typeof name !== "string") {
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }

  return await createRaffle(name);
};

type LoaderData = {
  hasNextPage: boolean;
  products: Product[];
};

export let loader: LoaderFunction = async ({ request }) => {
  const productsResponse = await commerce.getProducts(
    "en",
    undefined,
    undefined,
    undefined,
    undefined,
    100,
    undefined
  );

  const { hasNextPage, products } = productsResponse;

  return { hasNextPage, products };
};
