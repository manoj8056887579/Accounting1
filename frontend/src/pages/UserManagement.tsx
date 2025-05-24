
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserRole, useAuth } from '@/contexts/AuthContext';
import { 
  User as UserIcon, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash, 
  Pencil, 
  Key,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';

// Mock data for users
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  lastLogin: string;
}

const mockUsers: User[] = [
  { id: "1", name: "Admin User", email: "admin@bizsuite.com", role: "admin", active: true, lastLogin: "Today at 12:45 PM" },
  { id: "2", name: "John Cashier", email: "john@bizsuite.com", role: "cashier", active: true, lastLogin: "Yesterday at 5:30 PM" },
  { id: "3", name: "Mary Accountant", email: "mary@bizsuite.com", role: "accountant", active: true, lastLogin: "Yesterday at 3:15 PM" },
  { id: "4", name: "Robert Inventory", email: "robert@bizsuite.com", role: "inventory_manager", active: false, lastLogin: "May 01, 2023" },
  { id: "5", name: "Sarah Purchases", email: "sarah@bizsuite.com", role: "purchase_manager", active: true, lastLogin: "May 05, 2023" },
  { id: "6", name: "David Clerk", email: "david@bizsuite.com", role: "cashier", active: false, lastLogin: "Apr 28, 2023" },
  { id: "7", name: "Linda Accounts", email: "linda@bizsuite.com", role: "accountant", active: true, lastLogin: "May 05, 2023" },
  { id: "8", name: "Michael Stock", email: "michael@bizsuite.com", role: "inventory_manager", active: true, lastLogin: "May 06, 2023" },
  { id: "9", name: "Patricia Vendor", email: "patricia@bizsuite.com", role: "purchase_manager", active: true, lastLogin: "May 04, 2023" },
  { id: "10", name: "James Admin", email: "james@bizsuite.com", role: "admin", active: true, lastLogin: "Today at 9:30 AM" },
  { id: "11", name: "Jennifer Sales", email: "jennifer@bizsuite.com", role: "cashier", active: true, lastLogin: "Today at 11:20 AM" },
  { id: "12", name: "Richard Finance", email: "richard@bizsuite.com", role: "accountant", active: false, lastLogin: "Apr 15, 2023" },
];

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier' as UserRole,
    active: true,
    password: '',
    confirmPassword: ''
  });
  
  // Reset password form state
  const [resetPasswordData, setResetPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const { toast } = useToast();
  const { user: currentLoggedInUser } = useAuth();
  const isSuperAdmin = currentLoggedInUser?.role === 'super_admin';
  
  // Pagination settings
  const usersPerPage = 6;
  const totalPages = Math.ceil(
    users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / usersPerPage
  );
  
  // Get users for current page
  const getCurrentPageUsers = () => {
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const start = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle role select change
  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as UserRole
    });
  };
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'cashier',
      active: true,
      password: '',
      confirmPassword: ''
    });
    setResetPasswordData({
      password: '',
      confirmPassword: ''
    });
  };
  
  // Open add user dialog
  const openAddUserDialog = () => {
    resetForm();
    setIsAddUserDialogOpen(true);
  };
  
  // Open edit user dialog
  const openEditUserDialog = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      password: '',
      confirmPassword: ''
    });
    setIsEditUserDialogOpen(true);
  };
  
  // Open reset password dialog
  const openResetPasswordDialog = (user: User) => {
    setCurrentUser(user);
    setResetPasswordData({
      password: '',
      confirmPassword: ''
    });
    setIsResetPasswordDialogOpen(true);
  };
  
  // Open delete user dialog
  const openDeleteDialog = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  // Add new user
  const handleAddUser = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is attempting to create an admin without being a super_admin
    if (formData.role === 'admin' && !isSuperAdmin) {
      toast({
        title: "Permission denied",
        description: "Only Super Admins can create Admin users.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is attempting to create a super_admin
    if (formData.role === 'super_admin') {
      toast({
        title: "Permission denied",
        description: "Super Admin users cannot be created through the UI.",
        variant: "destructive",
      });
      return;
    }
    
    // Add user logic
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      active: formData.active,
      lastLogin: "Never"
    };
    
    setUsers([...users, newUser]);
    setIsAddUserDialogOpen(false);
    resetForm();
    
    toast({
      title: "User added",
      description: `${newUser.name} has been added successfully.`,
    });
  };
  
  // Update existing user
  const handleUpdateUser = () => {
    if (!currentUser) return;

    // Check if user is attempting to change role to admin without being a super_admin
    if (formData.role === 'admin' && currentUser.role !== 'admin' && !isSuperAdmin) {
      toast({
        title: "Permission denied",
        description: "Only Super Admins can promote users to Admin role.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is attempting to change role to super_admin
    if (formData.role === 'super_admin') {
      toast({
        title: "Permission denied",
        description: "Users cannot be promoted to Super Admin through the UI.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          active: formData.active
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    resetForm();
    
    toast({
      title: "User updated",
      description: `${formData.name}'s details have been updated.`,
    });
  };
  
  // Reset user password
  const handleResetPassword = () => {
    if (!currentUser) return;
    
    // Check if passwords match
    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you'd call an API to reset the password
    setIsResetPasswordDialogOpen(false);
    resetForm();
    
    toast({
      title: "Password reset",
      description: `Password has been reset for ${currentUser.name}.`,
    });
  };
  
  // Delete user
  const handleDeleteUser = () => {
    if (!currentUser) return;
    
    const updatedUsers = users.filter(user => user.id !== currentUser.id);
    setUsers(updatedUsers);
    setIsDeleteDialogOpen(false);
    
    // If deleting a user from the last page and it's now empty, go to previous page
    const filteredUsers = updatedUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const newTotalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
    
    toast({
      title: "User deleted",
      description: `${currentUser.name} has been deleted.`,
    });
  };
  
  // Toggle user status
  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus = !user.active;
        
        // Show toast notification
        toast({
          title: newStatus ? "User activated" : "User deactivated",
          description: `${user.name} has been ${newStatus ? 'activated' : 'deactivated'}.`,
        });
        
        return {
          ...user,
          active: newStatus
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
  };
  
  // Get formatted role text
  const formatRole = (role: UserRole) => {
    if (role === 'super_admin') return 'Super Admin';
    return role.replace('_', ' ').split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Get role badge color
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return "bg-purple-200 text-purple-900 hover:bg-purple-300";
      case 'admin':
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case 'cashier':
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'accountant':
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case 'inventory_manager':
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'purchase_manager':
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleResetPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetPasswordData({
      ...resetPasswordData,
      [name]: value
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">User Management</CardTitle>
              <CardDescription>Add, edit or remove system users.</CardDescription>
            </div>
            <Button onClick={openAddUserDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and filter bar */}
          <div className="flex justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Users table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentPageUsers().map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-normal ${getRoleBadgeColor(user.role)}`}>
                        {formatRole(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span 
                          className={`h-2 w-2 rounded-full mr-2 ${user.active ? 'bg-green-500' : 'bg-gray-300'}`} 
                        />
                        {user.active ? 'Active' : 'Inactive'}
                      </div>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditUserDialog(user)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openResetPasswordDialog(user)}>
                            <Key className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                            {user.active ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(user)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {getCurrentPageUsers().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <UserIcon className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-lg font-medium text-gray-500">No users found</p>
                      <p className="text-sm text-gray-400">
                        {searchTerm ? 'Try adjusting your search.' : 'Add your first user to get started.'}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 ? (
                    <PaginationItem>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                  ) : (
                    <PaginationItem>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="pointer-events-none opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                  )}
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 1
                    )
                    .sort((a, b) => a - b)
                    .map((page, index, array) => {
                      // Add ellipsis if there are gaps
                      if (index > 0 && page - array[index - 1] > 1) {
                        return [
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>,
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ];
                      }
                      
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })
                    .flat()}
                    
                  {currentPage < totalPages ? (
                    <PaginationItem>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                  ) : (
                    <PaginationItem>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="pointer-events-none opacity-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account and assign access permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                name="name"
                placeholder="Enter user's full name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {isSuperAdmin && <SelectItem value="admin">Admin</SelectItem>}
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
                  <SelectItem value="purchase_manager">Purchase Manager</SelectItem>
                </SelectContent>
              </Select>
              {isSuperAdmin && (
                <p className="text-xs text-muted-foreground mt-1">
                  As a Super Admin, you can create Admin users
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="active" 
                name="active"
                checked={formData.active}
                onCheckedChange={(checked) => 
                  setFormData({...formData, active: checked})
                }
              />
              <Label htmlFor="active">Active Account</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input 
                id="edit-name"
                name="name"
                placeholder="Enter user's full name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input 
                id="edit-email"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {isSuperAdmin && <SelectItem value="admin">Admin</SelectItem>}
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
                  <SelectItem value="purchase_manager">Purchase Manager</SelectItem>
                </SelectContent>
              </Select>
              {isSuperAdmin && (
                <p className="text-xs text-muted-foreground mt-1">
                  As a Super Admin, you can change users to Admin role
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="edit-active" 
                name="active"
                checked={formData.active}
                onCheckedChange={(checked) => 
                  setFormData({...formData, active: checked})
                }
              />
              <Label htmlFor="edit-active">Active Account</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Create a new password for {currentUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reset-password">New Password</Label>
              <Input 
                id="reset-password"
                name="password"
                type="password"
                placeholder="Enter new password"
                value={resetPasswordData.password}
                onChange={handleResetPasswordInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-confirm-password">Confirm Password</Label>
              <Input 
                id="reset-confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={resetPasswordData.confirmPassword}
                onChange={handleResetPasswordInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <p className="text-muted-foreground">
              This will permanently remove <span className="font-semibold text-foreground">{currentUser?.name}</span> from the system.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add the default export
export default UserManagementPage;
