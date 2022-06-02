export interface MainProps {
  children: React.ReactNode;
}
export default function Main({ children }: MainProps) {
  return <main className="w-full max-w-7xl flex-1 p-6">{children}</main>;
}
