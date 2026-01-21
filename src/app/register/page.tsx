import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";

export default function RegisterPage() {
  return (
    <Container size="sm" className="py-20">
      <div className="text-center mb-8 animate-slide-up">
        <h1 className="mb-4">Create Account</h1>
        <p className="text-muted-foreground">
          Join GameHub and start playing amazing games
        </p>
      </div>

      <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <RegisterForm />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </Card>
    </Container>
  );
}
