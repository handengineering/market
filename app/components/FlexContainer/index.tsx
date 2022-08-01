import clsx from "clsx";

export interface FlexContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function FlexContainer({
  children,
  className,
}: FlexContainerProps) {
  const flexContainerClasses = clsx("flex flex-row flex-wrap gap-6", className);
  return <div className={flexContainerClasses}>{children}</div>;
}
