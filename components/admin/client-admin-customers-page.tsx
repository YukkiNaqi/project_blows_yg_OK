'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/admin/data-table';
import { User, Mail, Phone, Building, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/server-db';

interface Customer {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  created_at: string;
}

interface ClientAdminCustomersPageProps {
  initialCustomers: Customer[];
}

export default function ClientAdminCustomersPage({ initialCustomers }: ClientAdminCustomersPageProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'created_at'>>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
  });

  // Define columns for the data table
  const columns = [
    {
      accessorKey: 'full_name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'company',
      header: 'Company',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'created_at',
      header: 'Date Joined',
      cell: ({ row }: { row: { original: Customer } }) => {
        const customer = row.original;
        return <span>{new Date(customer.created_at).toLocaleDateString("id-ID")}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Customer } }) => {
        const customer = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setEditingCustomer(customer);
                setFormData({
                  full_name: customer.full_name,
                  email: customer.email,
                  phone: customer.phone,
                  address: customer.address,
                  company: customer.company,
                });
                setIsModalOpen(true);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive"
              onClick={() => handleDelete(customer.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCustomer) {
        // Update existing customer
        const response = await fetch(`/api/admin/customers?id=${editingCustomer.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setCustomers(prev => 
            prev.map(c => 
              c.id === editingCustomer.id ? { ...c, ...formData } : c
            )
          );
          resetForm();
        } else {
          throw new Error(result.message || 'Failed to update customer');
        }
      } else {
        // Create new customer
        const response = await fetch('/api/admin/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
          }),
        });

        const result = await response.json();

        if (result.success) {
          const newCustomer = {
            id: result.id,
            ...formData,
            created_at: new Date().toISOString(),
          };
          setCustomers(prev => [newCustomer, ...prev]);
          resetForm();
        } else {
          throw new Error(result.message || 'Failed to create customer');
        }
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Error saving customer: ' + (error as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`/api/admin/customers?id=${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          setCustomers(prev => prev.filter(c => c.id !== id));
        } else {
          throw new Error(result.message || 'Failed to delete customer');
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer: ' + (error as Error).message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      address: '',
      company: '',
    });
    setEditingCustomer(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Customers</h1>
        <Button onClick={() => {
          setEditingCustomer(null);
          setFormData({
            full_name: '',
            email: '',
            phone: '',
            address: '',
            company: '',
          });
          setIsModalOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Customer
        </Button>
      </div>

      <DataTable columns={columns} data={customers} />

      {/* Customer Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={e => setFormData({...formData, full_name: e.target.value})}
                        placeholder="Enter full name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="Enter email address"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="Enter phone number"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                        placeholder="Enter company name"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        placeholder="Enter address"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCustomer ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}