
import { OrganizationCreationRequest } from "@/models/superadmin";
import { Organization } from "@/models/organization";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { createAdminUser } from "./userService";
import { ApplicationModule } from "@/models/superadmin";

// Mock plans data - in a real application, this would be fetched from a database
const mockPlans = [
  {
    id: "basic",
    userLimit: 10,
    modules: ['inventory', 'pos', 'sales'] as ApplicationModule[]
  },
  {
    id: "standard",
    userLimit: 25,
    modules: ['inventory', 'pos', 'sales', 'purchases', 'crm', 'reports'] as ApplicationModule[]
  },
  {
    id: "premium", 
    userLimit: 0,  // Unlimited
    modules: ['inventory', 'pos', 'sales', 'purchases', 'accounting', 'crm', 'whatsapp', 'reports'] as ApplicationModule[]
  }
];

// Mock function to create a new organization
export const createOrganization = async (request: OrganizationCreationRequest): Promise<Organization> => {
  // In a real app, this would be an API call
  // For this demo, we'll simulate the API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Generate a slug from the organization name
    const slug = request.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    
    // Find the plan details
    const planDetails = mockPlans.find(plan => plan.id === request.planId);
    
    if (!planDetails) {
      throw new Error("Invalid subscription plan selected");
    }
    
    // Create the organization object
    const newOrganization: Organization = {
      id: uuidv4(),
      name: request.name,
      slug,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Include plan details in the organization object
      subscriptionPlan: request.planId,
      userLimit: planDetails.userLimit,
      enabledModules: planDetails.modules
    };
    
    // Create admin user and assign to organization
    await createAdminUser(request.adminEmail, request.adminName, newOrganization.id);
    
    // In a real app, this would be saved to a database
    // For this demo, we just return the new organization
    
    // Simulate notification sending
    console.log(`Welcome email sent to ${request.adminEmail} for organization ${request.name}`);
    console.log(`Organization created with plan: ${request.planId}, modules: ${planDetails.modules.join(', ')}, user limit: ${planDetails.userLimit === 0 ? 'Unlimited' : planDetails.userLimit}`);
    
    return newOrganization;
  } catch (error: any) {
    console.error("Error creating organization:", error);
    throw new Error(error.message || "Failed to create organization");
  }
};

// Function to send welcome email to new admin (mock)
export const sendWelcomeEmail = async (email: string, name: string, orgName: string, tempPassword: string) => {
  // In a real app, this would send an actual email via SMTP service
  console.log(`
    To: ${email}
    Subject: Welcome to ${orgName}!
    
    Hi ${name},
    
    You have been invited to join ${orgName} as an admin.
    Your temporary password is: ${tempPassword}
    
    Please log in and change your password.
  `);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return true;
};
