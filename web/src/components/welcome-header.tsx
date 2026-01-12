export default function WelcomeHeader() {
  return (
    <div className="w-full px-4 py-6 bg-primary/10 text-primary-foreground rounded-md space-y-2">
      <h1 className="text-xl font-bold">
        Welcome, <span className="text-primary">Adhitya</span>
      </h1>
      <p>Here's a summary of the greenhouse status today.</p>
    </div>
  );
}
