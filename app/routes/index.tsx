import { Link } from "@remix-run/react";
import Button from "~/components/Button";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main>
      {user ? (
        <p>Signed in as {user.email}</p>
      ) : (
        <div>
          <Link to="/join">
            <Button color="primary">Sign up</Button>
          </Link>
          <Link to="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      )}
    </main>
  );
}
