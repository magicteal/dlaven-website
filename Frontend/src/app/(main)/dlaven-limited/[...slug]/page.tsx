import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function DlLimitedSubRoutePage({ params }: Props) {
  const resolved = await params;
  const path = (resolved.slug || []).join("/");
  redirect(`/dl-fantome/${path}`);
}
