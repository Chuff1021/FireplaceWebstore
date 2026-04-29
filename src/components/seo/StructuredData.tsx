import Script from "next/script";

type Props = {
  id: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function StructuredData({ id, data }: Props) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
