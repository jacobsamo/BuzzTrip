import Link from "next/link";

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default async function LegalPage() {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-center gap-2 sm:flex-row">
      <div>
        <h1 className="text-4xl font-bold">Legal</h1>
        <p>Explore BuzzTrip&apos;s Legal documents and Policies</p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Link
          href="/legal/privacy"
          className="h-fit w-full rounded-md border bg-card p-2"
        >
          <h2>Privacy Policy</h2>
          <p className="text-sm font-light">
            Last Updated: {formatDate("2025-12-08")}
          </p>
        </Link>
        <Link
          href="/legal/terms"
          className="h-fit w-full rounded-md border bg-card p-2"
        >
          <h2>Terms of Service</h2>
          <p className="text-sm font-light">
            Last Updated: {formatDate("2025-12-08")}
          </p>
        </Link>
      </div>
    </div>
  );
}
