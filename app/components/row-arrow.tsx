export default function RowArrow({ className = "" }: { className?: string }) {
  return (
    <span className={`row-arrow ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M7 16.5L16.5 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M9.5 7H16.5V14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
