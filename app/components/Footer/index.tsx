import { Link } from "@remix-run/react";

export default function Footer(): React.ReactElement {
  return (
    <footer className="mt-16 flex w-full max-w-7xl flex-col items-center justify-between gap-4 py-8 px-8 md:flex-row">
      <div className="text-neutral-500">
        <span className="mr-4">
          Copyright © 2022 Have A Nice Day Engineering Ltd. All rights reserved.{" "}
        </span>
        <Link className="text-neutral-200" to="/credits">
          Credits
        </Link>
      </div>
    </footer>
  );
}
