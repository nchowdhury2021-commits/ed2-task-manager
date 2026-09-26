export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: "rotate(-4deg)", flexShrink: 0 }}
    >
      <circle cx="20" cy="20" r="18" stroke="var(--ink)" strokeWidth="2" />
      <path
        d="M12 20.5L17 25.5L28 14.5"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}