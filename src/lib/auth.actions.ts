import bcrypt from "bcryptjs";

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

// Storage key for users in localStorage
const USERS_STORAGE_KEY = "gamehub_users";
const CURRENT_USER_KEY = "gamehub_current_user";

// Helper to get users from storage (server-side safe)
function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Helper to save users to storage
function saveUsers(users: StoredUser[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users:", error);
  }
}

// Hash password with bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password with bcrypt
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Register a new user
export async function registerUser(
  email: string,
  username: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Validate inputs
    if (!email || !username || !password) {
      return { success: false, error: "All fields are required" };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    const users = getStoredUsers();

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already registered" };
    }

    if (users.find((u) => u.username === username)) {
      return { success: false, error: "Username already taken" };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create new user
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      username,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    // Save to storage
    users.push(newUser);
    saveUsers(users);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    // Store current user
    if (typeof window !== "undefined") {
      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(userWithoutPassword),
      );
    }

    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed. Please try again." };
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Validate inputs
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    const users = getStoredUsers();

    // Find user by email
    const user = users.find((u) => u.email === email);

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    // Store current user
    if (typeof window !== "undefined") {
      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(userWithoutPassword),
      );
    }

    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed. Please try again." };
  }
}

// Logout user
export async function logoutUser(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
