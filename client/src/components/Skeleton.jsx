const Skeleton = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded-xl bg-surface-2 ${className}`}
    aria-hidden="true"
  />
);

export default Skeleton;
