export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}
export default function Label({ children }: LabelProps) {
  return (
    <label className="mb-4 inline-block flex-1 text-sm text-neutral-700">
      {children}
    </label>
  );
}
