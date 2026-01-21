import Link from "next/link";
import { Gamepad2, Trophy, BarChart3, Target } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";

export default function Home() {
  const features = [
    {
      icon: Gamepad2,
      title: "Multiple Games",
      description:
        "Play Monopoly, Snake, Chess, Tetris, and exciting mining games",
    },
    {
      icon: Trophy,
      title: "Leaderboards",
      description: "Compete with players worldwide and climb the rankings",
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Monitor your stats, achievements, and gaming history",
    },
    {
      icon: Target,
      title: "Achievements",
      description: "Unlock rewards and showcase your gaming prowess",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-20 blur-3xl"></div>
        <Container className="py-20 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="mb-5 animate-slide-up">
              Welcome to <span className="gradient-text">GameHub</span>
            </h1>
            <p
              className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Your ultimate destination for classic and modern games. Play,
              compete, and dominate the leaderboards!
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Link href="/register">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/games">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Browse Games
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <Container>
          <h2 className="text-center mb-12">Why Choose GameHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  hover
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-center mb-4">
                    <Icon
                      className="w-12 h-12 text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Container>
          <Card className="text-center gradient-primary p-12">
            <h2 className="mb-4 text-white">Ready to Start Playing?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of players and experience the best gaming platform.
              Create your account now and start your journey!
            </p>
            <Link href="/register">
              <Button
                variant="ghost"
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Create Free Account
              </Button>
            </Link>
          </Card>
        </Container>
      </section>
    </div>
  );
}
