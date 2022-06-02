export interface LabelProps {
  children: React.ReactNode;
}
export default function Label({ children }: LabelProps) {
  return <label className="flex-1 text-sm  text-neutral700">{children}</label>;
}
