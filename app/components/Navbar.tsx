import Link from "next/link";
import { SocialPill } from "./SocialPill";

const Navbar: React.FC = () => {
  return (
    <header>
      <DesktopNav />
      <MobileNav />
    </header>
  );
};

function DesktopNav() {
  return (
    <nav
      aria-label="Desktop navigation"
      className="hidden h-16 w-full items-center justify-between border-b border-border-primary/50 px-4 md:flex"
    >
      <Link href="/" aria-label="Home" className="text-sm font-semibold tracking-tight text-text-primary">
        hardeep.cv
      </Link>
      <SocialPill />
    </nav>
  );
}

function MobileNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="flex h-16 items-center border-b border-border-primary/50 px-3 md:hidden"
    >
      <Link href="/" aria-label="Home" className="text-sm font-semibold tracking-tight text-text-primary">
        hardeep.cv
      </Link>
    </nav>
  );
}

export default Navbar;
