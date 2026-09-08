export const metadata = {
  title: "About | Portfolio",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold">About Me</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        Write a short bio here — who you are, what you work on, and what
        you&apos;re looking for.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Skills</h2>
      <ul className="mt-2 flex flex-wrap gap-2 text-sm">
        {["TypeScript", "React", "Next.js", "Node.js"].map((skill) => (
          <li
            key={skill}
            className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800"
          >
            {skill}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Experience</h2>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Add your work experience or a link to your résumé here.
      </p>
    </section>
  );
}
