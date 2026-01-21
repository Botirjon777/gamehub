import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";

export default function LoginPage() {
  return (
    <Container size="sm" className="py-20">
      <div className="text-center mb-8 animate-slide-up">
        <h1 className="mb-4">Welcome Back</h1>
        <p className="text-muted-foreground">
          Sign in to continue your gaming journey
        </p>
      </div>

      <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <LoginForm />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </Card>
    </Container>
  );
}
