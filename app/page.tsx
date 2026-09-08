import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto max-w-2xl text-center">
      <h1 className="text-4xl font-bold">Hi, I&apos;m [Your Name]</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        I build things for the web. Take a look at my{" "}
        <Link href="/projects" className="underline">
          projects
        </Link>{" "}
        or find out more{" "}
        <Link href="/about" className="underline">
          about me
        </Link>
        .
      </p>
    </section>
  );
}
