import TopNav from "@/components/TopNav";
export default function PetBarPage() {
  return (
    <main>
      <TopNav />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold">Pet Bar</h1>
        <p className="text-neutral-600 mt-2">Feed, clean, play with your pet.</p>
      </section>
    </main>
  );
}