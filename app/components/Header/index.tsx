import type { User } from "@prisma/client";
import { Link } from "@remix-run/react";

export interface HeaderProps {
  user: User;
  isAdmin: boolean;
}

export default function Header({
  user,
  isAdmin,
}: HeaderProps): React.ReactElement {
  return (
    <header className="flex w-full max-w-7xl flex-col items-center justify-between gap-4 py-12 md:h-72 md:flex-row">
      <div className="flex h-full justify-start md:w-96">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 className="m-0 whitespace-nowrap text-left font-soehneBreit text-xl font-bold uppercase leading-5 text-primary-500 md:text-2xl md:leading-6">
            Hand
            <br />
            Engineering
          </h1>
          <br />
          {user ? (
            <p>
              {user.email}
              {isAdmin ? " (admin)" : null}
            </p>
          ) : null}
        </Link>
      </div>
      <div className="flex h-full w-full flex-col items-start gap-12 md:flex-row">
        <div className="h-full w-full flex-1 px-12 md:px-0">
          <div>
            <h2 className="mb-2 border-b-2 border-solid border-neutral-700 pb-2 font-semibold text-neutral-700">
              Products
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-neutral-700 hover:text-primary-500"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-full w-full flex-1 px-12 md:px-0">
          <h2 className="mb-2 border-b-2 border-solid border-neutral-700 pb-2 font-semibold text-neutral-700">
            Market
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/raffles"
                className="text-neutral-700 hover:text-primary-500"
              >
                Raffles
              </Link>
            </li>
            <li>
              <Link to="/" className="text-neutral-700 hover:text-primary-500">
                Store
              </Link>
            </li>
          </ul>
        </div>

        <div className="h-full w-full flex-1 px-12 md:px-0">
          <h2 className="mb-2 border-b-2 border-solid border-neutral-700 pb-2 font-semibold text-neutral-700">
            Account
          </h2>
          <ul className="space-y-2">
            {user ? (
              <li>
                <Link
                  to="/logout"
                  className="text-neutral-700 hover:text-primary-500"
                >
                  Log Out
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/join"
                    className="text-neutral-700 hover:text-primary-500"
                  >
                    Sign up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-neutral-700 hover:text-primary-500"
                  >
                    Log In
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {isAdmin && (
          <div className="h-full w-full flex-1 px-12 md:px-0">
            <h2 className="mb-2 border-b-2 border-solid border-neutral-700 pb-2 font-semibold text-neutral-700">
              Admin
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/raffles"
                  className="text-neutral-700 hover:text-primary-500"
                >
                  Raffles
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products"
                  className="text-neutral-700 hover:text-primary-500"
                >
                  Products
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>{" "}
    </header>
  );
}
