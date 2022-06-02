export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export default function Image(props: ImageProps) {
  return (
    <img
      className="max-w-full rounded-lg object-contain"
      alt={props.alt}
      {...props}
    />
  );
}
