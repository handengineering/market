export interface MainProps {
  children: React.ReactNode;
}
export default function Main({ children }: MainProps) {
  return (
    <main className="w-full max-w-7xl flex-1 px-12 md:px-32">{children}</main>
  );
}
