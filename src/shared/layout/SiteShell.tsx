import { SiteFooter } from "@/shared/layout/SiteFooter";
import { SiteHeader } from "@/shared/layout/SiteHeader";
import type { ReactNode } from "react";
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="nv-site nv-inner-site">
      <a href="#nv-main" className="nv-skip">
        Skip to content
      </a>
      <SiteHeader />
      <main id="nv-main">{children}</main>
      <SiteFooter />
    </div>
  );
}
