import MotionDirector from "@/shared/motion/MotionDirector";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppErrorBoundary } from "./AppErrorBoundary";
import { RouteReset } from "./RouteReset";
import { AppRoutes } from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <Suspense
          fallback={
            <div className="nv-route-loading" role="status">
              <span>NOVRA</span>
              <p>Preparing your next experience…</p>
            </div>
          }
        >
          <RouteReset />
          <MotionDirector />
          <AppRoutes />
        </Suspense>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}
