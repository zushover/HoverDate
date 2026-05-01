import PageShell from "@/components/PageShell";

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <PageShell ambientOrbs orbIntensity="minimal">{children}</PageShell>;
}
