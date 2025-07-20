import cn from "@sglara/cn";

export function Logo({
  className,
  ref,
  ...props
}: {
  className?: string;
  ref?: React.Ref<SVGSVGElement>;
} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      ref={ref}
      width="100%"
      height="100%"
      viewBox="0 0 622 613"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      className={cn(className)}
      {...props}
    >
      <path
        d="M153.839 283.368c-81.946 0-143.116-60.831-143.116-141.298C10.724 60.835 71.893.004 153.839.004c70.781 0 125.413 46.585 136.185 115.117h-75.021c-9.229-27.725-32.702-45.817-60.785-45.817-38.088 0-66.171 30.804-66.171 72.766 0 41.583 28.083 71.611 66.171 71.611 29.626 0 53.478-19.636 60.785-49.284h75.787c-9.996 70.843-65.016 118.971-136.952 118.971zM352.653 6.989h43.086l151.196 139.366V6.989h75.021v269.497h-48.092L426.131 134.041v142.445h-73.478V6.989zM-.048 343.5h85.795l66.162 178.647L216.546 343.5h85.016L185.766 613.006h-70.014L-.048 343.5zm449.842 269.505v-170.17l22.697-16.945v-15.393H359.004V343.5h256.6v66.997h-90.79v202.508h-75.021z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
