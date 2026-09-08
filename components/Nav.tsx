import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
      <Link href="/" className="font-semibold">
        Portfolio
      </Link>
      <ul className="flex gap-6 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
