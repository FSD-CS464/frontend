import TopNav from "@/components/TopNav";
export default function SettingsPage() {
  return (
    <main>
      <TopNav />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-neutral-600 mt-2">Profile, preferences, notifications.</p>
      </section>
    </main>
  );
}