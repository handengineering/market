import clsx from "clsx";

const classes = {
  base: "flex flex-col p-6 rounded-md bg-neutral300",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export default function Card({ children, className }: CardProps) {
  const cardClasses = clsx(classes.base, className);

  return <div className={cardClasses}>{children}</div>;
}
