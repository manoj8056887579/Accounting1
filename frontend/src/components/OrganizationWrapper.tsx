import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NotFound from '@/pages/NotFound';

interface Organization {
  organization_id: string;
  name: string;
  slug: string;
  subscription_plan: string;
  user_limit: number;
  status: string;
  enabled_modules: string[];
  admin_name: string;
  admin_email: string;
  created_at: string;
  updated_at: string;
}

interface OrganizationWrapperProps {
  children: React.ReactElement;
}

const OrganizationWrapper: React.FC<OrganizationWrapperProps> = ({ children }) => {
  const { organizationId } = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const token = sessionStorage.getItem('auth_token');

        if (!token) {
          console.error('No token found in sessionStorage');
          window.location.href = '/login';
          return;
        }

        // First get organization details using organization_db
        const orgResponse = await axios.get(`${API_URL}/api/superadmin/organization/${organizationId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (orgResponse.data.success) {
          const orgData = orgResponse.data.data;
          setOrganization(orgData);

        
        } else {
          console.error('Failed to load organization data:', orgResponse.data);
          setError(orgResponse.data.message || 'Failed to load organization data');
        }
      } catch (err) {
        console.error('Error fetching organization data:', err);
        if (axios.isAxiosError(err)) {
          console.error('Axios error details:', {
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            headers: err.response?.headers
          });

          if (err.response?.status === 401) {
            // Handle unauthorized access
            sessionStorage.removeItem('auth_token');
            window.location.href = '/login';
          } else if (err.response?.status === 404) {
            setError(`Organization not found: ${err.response.data.details || err.response.data.message}`);
          } else {
            setError(err.response?.data?.message || 'An error occurred while fetching organization data');
          }
        } else {
          setError('An unexpected error occurred while fetching organization data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchOrganizationData();
    }
  }, [organizationId, API_URL]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading organization data...</div>;
  }

  if (error || !organization) {
    return <NotFound />;
  }

  // Pass organization context to the child component
  return React.cloneElement(children, { organization });
};

export default OrganizationWrapper; 