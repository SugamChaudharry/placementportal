const COLORS = ["#4f46e5","#0891b2","#059669","#d97706","#dc2626","#7c3aed","#db2777"];
function colorFrom(name: string) {
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return COLORS[Math.abs(h) % COLORS.length];
}
const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-11 h-11 text-sm", xl: "w-14 h-14 text-base" };
interface AvatarProps { name: string; src?: string; size?: keyof typeof sizes; color?: string; }
export function Avatar({ name, src, size = "md", color }: AvatarProps) {
  const bg = color ?? colorFrom(name);
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return src
    ? <img src={src} alt={name} className={sizes[size] + " rounded-full object-cover flex-shrink-0"} />
    : <div className={sizes[size] + " rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0"} style={{ background: bg }}>{initials}</div>;
}
