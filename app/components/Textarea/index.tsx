export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export default function Textarea(props: TextareaProps) {
  return (
    <textarea
      {...props}
      className="mb-4 w-full rounded border-2 border-solid border-neutral-500 bg-neutral-100 py-2 px-4 focus:border-primary-300 focus:outline-none"
    />
  );
}
