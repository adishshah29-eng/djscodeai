import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

export function LogoutButton({ redirectTo }: { redirectTo: string }) {
  const logoutWithRedirect = logout.bind(null, redirectTo);

  return (
    <form action={logoutWithRedirect}>
      <Button type="submit" variant="ghost" className="w-full justify-start">
        Log out
      </Button>
    </form>
  );
}
