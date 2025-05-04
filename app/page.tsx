// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-6">Invoice Generator</h1>
      <p className="mb-8 text-lg text-gray-600 text-center max-w-md">
        Quickly create and download professional invoices — free, client‐side,
        no setup required.
      </p>
      <Link href="/invoice" passHref>
        <Button size="lg">Go Invoice Form</Button>
      </Link>
    </main>
  );
}
