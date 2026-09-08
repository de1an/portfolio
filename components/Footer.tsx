export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 px-6 py-4 text-center text-sm text-neutral-500 dark:border-neutral-800">
      © {year} — Built with Next.js
    </footer>
  );
}
