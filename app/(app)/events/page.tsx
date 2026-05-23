import { AuthGuard } from "@/components/auth/AuthGuard";
import { EventsView } from "@/components/event/EventsView";

export default function EventsPage() {
  return (
    <AuthGuard>
      <EventsView />
    </AuthGuard>
  );
}
