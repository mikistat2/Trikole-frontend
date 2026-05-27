export default function BrandMark({ className = '', imageSize = 28, textSize = 18, compact = false }) {
  return (
    <span className={`inline-flex items-center gap-0 font-['Bebas_Neue','Barlow',sans-serif] tracking-[0.02em] text-[#f0ece4] ${className}`}>
      <img
        src="/Trickole-logo.png"
        alt=""
        aria-hidden="true"
        width={imageSize}
        height={imageSize}
        className="shrink-0 object-contain"
        style={{ display: 'block' }}
      />
      {!compact && (
        <span style={{ fontSize: textSize }} className="font-black leading-none">
          Trick<span className="text-brand">ole</span>
        </span>
      )}
    </span>
  );
}