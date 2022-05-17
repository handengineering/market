import { Link, Outlet } from "@remix-run/react";
import AppContainer from "~/components/AppContainer";
import Button from "~/components/Button";
import Main from "~/components/Main";
import Navigation from "~/components/Navigation";

export default function Raffles() {
  return (
    <>
      <Navigation>
        <Link to="/raffles">
          <Button>All Raffles</Button>
        </Link>
        <Link to="/dashboard">
          <Button>Dashboard</Button>
        </Link>
      </Navigation>
      <AppContainer>
        <Main>
          <Outlet />
        </Main>
      </AppContainer>
    </>
  );
}
