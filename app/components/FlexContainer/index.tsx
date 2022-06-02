export interface FlexContainerProps {
  children: React.ReactNode;
}

export default function FlexContainer({ children }: FlexContainerProps) {
  return <div className="flex flex-row flex-wrap gap-6">{children}</div>;
}
