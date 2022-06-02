import { Link } from "@remix-run/react";

export interface HeaderWrapperProps {
  children: React.ReactNode;
}

export default function Header({
  children,
}: HeaderWrapperProps): React.ReactElement {
  return (
    <header className="flex w-full max-w-7xl flex-col items-center justify-between gap-4 p-6 md:flex-row">
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1 className="m-0 whitespace-nowrap text-center text-xl text-primary500 md:text-2xl">
          <b className="font-soehneBreit uppercase">Hand Engineering</b> Market
        </h1>
      </Link>
      <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row">
        {children}
      </div>
    </header>
  );
}
