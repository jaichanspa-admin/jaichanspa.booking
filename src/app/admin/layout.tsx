import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CalendarDays, LayoutGrid } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream-100">
      {/* Sidebar — CI: brand-dark background, cream text */}
      <aside className="fixed inset-y-0 left-0 w-52 bg-brand-dark text-cream-50 hidden md:flex flex-col z-20">
        <div className="px-6 py-6 border-b border-white/10">
          <Logo size="sm" variant="light" />
          <p
            className="text-[9px] text-cream-300/50 mt-3 tracking-[0.5em] uppercase"
            style={{ fontFamily: '"Josefin Sans", system-ui, sans-serif' }}
          >
            Admin
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-0.5">
          <NavLink href="/admin/bookings" icon={<CalendarDays className="w-4 h-4" />}>
            Bookings
          </NavLink>
          <NavLink href="/admin/services" icon={<LayoutGrid className="w-4 h-4" />}>
            Services
          </NavLink>
        </nav>
        <div className="p-4 border-t border-white/10">
          <p
            className="text-[8px] text-cream-300/30 tracking-widest uppercase"
            style={{ fontFamily: '"Josefin Sans", system-ui, sans-serif' }}
          >
            JAI CHAN SPA · Siam Discovery
          </p>
        </div>
      </aside>

      {/* Mobile top nav */}
      <header className="md:hidden bg-brand-dark text-cream-50 px-5 py-4 flex items-center justify-between">
        <Logo size="sm" variant="light" />
        <div
          className="flex gap-5 text-[10px] tracking-widest uppercase"
          style={{ fontFamily: '"Josefin Sans", system-ui, sans-serif' }}
        >
          <Link href="/admin/bookings" className="opacity-70 hover:opacity-100 transition-opacity">
            Bookings
          </Link>
          <Link href="/admin/services" className="opacity-70 hover:opacity-100 transition-opacity">
            Services
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="md:ml-52 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 text-cream-200/70
                 hover:bg-white/8 hover:text-cream-50 transition-colors"
      style={{
        fontFamily: '"Josefin Sans", system-ui, sans-serif',
        fontSize: "11px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontWeight: 400,
      }}
    >
      {icon}
      {children}
    </Link>
  );
}
