// collections/page.js
import { Suspense } from "react";
import CollectionsContent from "./collections-content";
import LoadingState from "@/components/ui/loading-state";

export default function CollectionsPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading collections..." />}>
      <CollectionsContent />
    </Suspense>
  );
}
