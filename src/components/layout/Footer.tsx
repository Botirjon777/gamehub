export default function Footer() {
  return (
    <footer className="glass-strong mt-20 border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">🎮</span>
              </div>
              <span className="text-lg font-bold gradient-text">GameHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your ultimate gaming platform for classic and modern games.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="/games"
                  className="hover:text-primary transition-colors"
                >
                  Browse Games
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Leaderboards
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <p className="text-sm text-muted-foreground">
              Join our community and stay updated with the latest games and
              features.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2026 GameHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
