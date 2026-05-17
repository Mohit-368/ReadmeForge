export default function Logo({ size = 36 }) {
  return (
    <div className="logo-container" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-svg"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--grad-cyan)" />
            <stop offset="100%" stopColor="var(--grad-blue)" />
          </linearGradient>
        </defs>
        
        {/* Abstract "Forged Page" Shape */}
        <path
          d="M20 25C20 22.2386 22.2386 20 25 20H60L80 40V75C80 77.7614 77.7614 80 75 80H25C22.2386 80 20 77.7614 20 75V25Z"
          fill="url(#logo-grad)"
          className="logo-base-path"
        />
        
        {/* Inner Light Line / "F" Stem */}
        <path
          d="M40 35V65M40 35H55M40 50H50"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          className="logo-inner-line"
          opacity="0.8"
        />
        
        {/* Folded Corner */}
        <path
          d="M60 20V40H80"
          fill="rgba(0,0,0,0.15)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
