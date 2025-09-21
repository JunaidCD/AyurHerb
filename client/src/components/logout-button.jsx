import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function LogoutButton() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "All data cleared. You have been signed out of AyurHerb.",
        variant: "default",
      });
      setLocation('/login');
    } catch (error) {
      toast({
        title: "Logout error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center py-6 mt-8">
      <Button
        onClick={handleLogout}
        variant="destructive"
        size="lg"
        className="shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 rounded-full"
      >
        <i className="fas fa-sign-out-alt mr-2"></i>
        Logout
      </Button>
    </div>
  );
}
