export interface GridProps {
  children: React.ReactNode;
  columns?: number;
}

export default function Grid({ children, columns }: GridProps) {
  return (
    <div
      style={{
        gridTemplateColumns: columns
          ? `repeat(${columns}, minmax(0, 1fr))`
          : "auto",
      }}
      className="grid grid-cols-3 gap-6"
    >
      {children}
    </div>
  );
}
