export interface NavigationWrapperProps {
  children: React.ReactNode;
}

export default function Navigation({
  children,
}: NavigationWrapperProps): React.ReactElement {
  return (
    <nav className="flex items-center justify-between gap-4 bg-primary-500 p-6">
      <h1 className="m-0 text-neutral-100">Hand Engineering Market</h1>
      <div className="flex gap-4"> {children}</div>
    </nav>
  );
}
