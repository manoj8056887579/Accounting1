import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const API_URL = import.meta.env.VITE_API_URL;

const General = () => {
  // State for form values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    tax_id: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });

  // Fetch superadmin data on component mount
  useEffect(() => {
    fetchSuperadminData();
  }, []);

  const fetchSuperadminData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/superadmin/admindata/superadmin`);
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch superadmin data');
      console.error('Error fetching superadmin data:', error);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/api/superadmin/admindata/superadmin/1`, formData);
      if (response.data.success) {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  name="name"
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email" 
                  placeholder="john.doe@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input 
                  id="phone_number"
                  name="phone_number"
                  placeholder="+1 (555) 123-4567" 
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_id">Tax ID</Label>
                <Input 
                  id="tax_id"
                  name="tax_id"
                  placeholder="Tax ID Number" 
                  value={formData.tax_id}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address"
                name="address"
                placeholder="123 Main St"
                className="min-h-[80px]"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city"
                  name="city"
                  placeholder="City" 
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input 
                  id="state"
                  name="state"
                  placeholder="State/Province" 
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="postal_code">ZIP/Postal Code</Label>
                <Input 
                  id="postal_code"
                  name="postal_code"
                  placeholder="ZIP/Postal Code" 
                  value={formData.postal_code}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country"
                  name="country"
                  placeholder="Country" 
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}; 

export default General;
 