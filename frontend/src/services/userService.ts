
import { User, UserRole } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { sendWelcomeEmail } from "./organizationService";

// Generate a secure random password
const generateTemporaryPassword = (): string => {
  // In a real app, this would be a secure random password generator
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Create a new admin user for an organization
export const createAdminUser = async (email: string, name: string, organizationId: string): Promise<User> => {
  try {
    // Check if user already exists (in a real app, this would query a database)
    // For demo purposes, we'll assume the user doesn't exist
    
    // Generate a temporary password
    const tempPassword = generateTemporaryPassword();
    
    // Create a new user
    const newUser: User = {
      id: uuidv4(),
      name: name || email.split('@')[0],
      email,
      username: email,
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    // In a real app, the user would be saved to a database
    console.log("Created new admin user:", newUser);
    
    // Create organization membership
    createOrganizationMembership(newUser.id, organizationId, 'owner');
    
    // Send welcome email with temporary password
    await sendWelcomeEmail(email, newUser.name, "Your New Organization", tempPassword);
    
    return newUser;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw new Error("Failed to create admin user");
  }
};

// Create organization membership
export const createOrganizationMembership = (
  userId: string,
  organizationId: string,
  role: "owner" | "admin" | "member" | "guest"
) => {
  // In a real app, this would create a record in the database
  const membership = {
    userId,
    organizationId,
    role,
    joinedAt: new Date().toISOString(),
    isDefault: true
  };
  
  console.log("Created organization membership:", membership);
  
  // For a real app, this would be saved to a database
  return membership;
};
