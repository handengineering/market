import { Link } from "@remix-run/react";
import AppContainer from "~/components/AppContainer";
import Button from "~/components/Button";
import Main from "~/components/Main";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <AppContainer>
      <Main>
        <h1>Hand Engineering Market</h1>
        {user ? (
          <p>Signed in as {user.email}</p>
        ) : (
          <div>
            <Link to="/join">
              <Button color="primary">Sign up</Button>
            </Link>
            {" "}
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
          </div>
        )}
      </Main>
    </AppContainer>
  );
}
