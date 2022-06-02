import { Link } from "@remix-run/react";

export interface HeaderWrapperProps {
  children: React.ReactNode;
}

export default function Header({
  children,
}: HeaderWrapperProps): React.ReactElement {
  return (
    <header className="flex w-full max-w-7xl items-center justify-between gap-4 p-6">
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1 className="m-0 whitespace-nowrap text-center text-2xl text-primary500">
          <b className="font-soehneBreit uppercase">Hand Engineering</b> Market
        </h1>
      </Link>
      <div className="flex gap-4">{children}</div>
    </header>
  );
}
