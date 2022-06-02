export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export default function Textarea(props: TextareaProps) {
  return (
    <textarea
      {...props}
      className="mb-4 w-full rounded border-2 border-solid border-neutral500 bg-neutral100 py-2 px-4 focus:border-primary300 focus:outline-none"
    />
  );
}
