import PageShell from "@/components/PageShell";

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <PageShell ambientOrbs orbIntensity="minimal">{children}</PageShell>;
}
