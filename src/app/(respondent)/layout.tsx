"use client";

export default function RespondentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen bg-background">
      <header className="border-b p-4">
        <h1>Respondent Area</h1>
      </header>
      <main className="container mx-auto p-8">{children}</main>
    </div>
  );
}
