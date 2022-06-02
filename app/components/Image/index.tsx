import clsx from "clsx";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export default function Image(props: ImageProps) {
  const imageClasses = clsx(
    "max-w-full rounded-lg object-contain",
    props.className
  );
  return <img {...props} alt={props.alt} className={imageClasses} />;
}
