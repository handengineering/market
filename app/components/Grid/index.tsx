export interface GridProps {
  children: React.ReactNode;
  columns?: number;
}

export default function Grid({ children, columns }: GridProps) {
  return (
    <div
      style={{
        gridTemplateColumns: columns
          ? `repeat(2, minmax(0, ${columns}fr))`
          : "auto",
      }}
      className="grid grid-cols-3 gap-6"
    >
      {children}
    </div>
  );
}
