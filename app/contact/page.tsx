import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact | Portfolio",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-lg">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Have a question or want to work together? Send a message below.
      </p>
      <ContactForm />
    </section>
  );
}
