import { User } from "@prisma/client";
import { Form } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import permissions from "prisma/permissions";
import AppContainer from "~/components/AppContainer";
import Button from "~/components/Button";
import Card from "~/components/Card";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Main from "~/components/Main";
import { createRaffle } from "~/models/raffle.server";
import { getRolesByUserId } from "~/models/role.server";
import { authenticator } from "~/services/auth.server";

export default function Index() {
  return (
    <AppContainer>
      <Main>
        <h1>New Raffle</h1>
        <Card position="center">
          <Form method="post" action="/admin/raffle/new">
            <h2>Create New Raffle</h2>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input fullWidth name="name" type="text" />
            </div>
            <Button fullWidth type="submit" color="primary">
              Create New Raffle
            </Button>
          </Form>
        </Card>
      </Main>
    </AppContainer>
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

export let loader: LoaderFunction = async ({ request }) => {
  let user: User = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const roles = await getRolesByUserId(user.id);

  const hasPermissions = roles.some((role) => {
    return role.permissions & permissions.administrator;
  });

  if (!hasPermissions) {
    return redirect("/dashboard");
  }
  return user;
};
