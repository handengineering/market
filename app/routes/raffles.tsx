import { Outlet } from "@remix-run/react";
import AppContainer from "~/components/AppContainer";
import Main from "~/components/Main";

export default function Raffles() {
  return (
    <AppContainer>
      <Main>
        <Outlet />
      </Main>
    </AppContainer>
  );
}
