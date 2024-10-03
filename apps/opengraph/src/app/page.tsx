import { Suspense } from "react";
import { Projects } from "./projects";

export default function Home() {
  return (
    <Suspense>
      <Projects />
    </Suspense>
  );
}
