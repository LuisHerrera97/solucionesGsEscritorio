type SpinnerProps = {
  size?: number;
  className?: string;
};

const Spinner = ({ size = 18, className }: SpinnerProps) => {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className ?? ''}`}
      style={{ width: size, height: size }}
    />
  );
};

export default Spinner;
