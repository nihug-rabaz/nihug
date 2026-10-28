import dynamic from "next/dynamic";
import PortalMainTabs from "@/components/portal/PortalMainTabs";
import PortalSiteNav from "@/components/portal/PortalSiteNav";

const HeroScrollVideo = dynamic(() => import("@/components/HeroScrollVideo"), {
  ssr: false,
  loading: () => (
    <div
      className="min-h-[100svh] w-full bg-[var(--color-canvas-ice)]"
      aria-hidden="true"
    />
  )
});

export default function Home() {
  return (
    <>
      <PortalSiteNav variant="top" />
      <main className="portal-page portal-page--with-hero portal-page--has-fixed-nav">
        <HeroScrollVideo />
        <PortalMainTabs />
      </main>
      <PortalSiteNav variant="bottom" />
    </>
  );
}
