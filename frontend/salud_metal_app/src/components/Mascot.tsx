export default function Mascot({ size = 180, message = 'Hi there!' }: { size?: number; message?: string }) {
  return (
    <div className="mascot mascot--nice" data-message={message} aria-hidden>
      <svg width={size} height={size} viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mx1" x1="0" x2="1">
            <stop offset="0" stopColor="#e6f4ff" />
            <stop offset="1" stopColor="#dbeafe" />
          </linearGradient>
        </defs>
        <ellipse cx="110" cy="185" rx="60" ry="12" fill="#eef2ff" />
        <g transform="translate(30,20)">
          <ellipse cx="50" cy="90" rx="50" ry="42" fill="#dbeafe" />
          <circle cx="50" cy="42" r="36" fill="#bfdbfe" />
          <circle cx="35" cy="36" r="4" fill="#0b1220" opacity="0.9" />
          <circle cx="65" cy="36" r="4" fill="#0b1220" opacity="0.9" />
          <path d="M35 54c6 6 24 6 30 0" stroke="#0b1220" strokeWidth="3" strokeLinecap="round" />
          <path d="M10 70c12-6 36-6 80 0" fill="#9fc5ff" opacity="0.18" />
          <g transform="translate(20,0)">
            <rect x="-6" y="-8" width="12" height="6" rx="3" fill="#1e40af" opacity="0.9" transform="rotate(-20 -6 -8)" />
            <rect x="72" y="-8" width="12" height="6" rx="3" fill="#1e40af" opacity="0.9" transform="rotate(20 72 -8)" />
          </g>
        </g>
      </svg>
      {/* Speech bubble will be shown via CSS on hover using data-message */}
    </div>
  )
}
