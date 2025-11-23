'use client';

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Phone, Mail, User, Edit, Save, X } from "lucide-react"

interface ServiceBooking {
  id: number;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  service_type: string; // This would be the ID of the service type
  preferred_date: string;
  preferred_time: string;
  address: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  estimated_cost?: number;
  technician_notes?: string;
  created_at: string;
}

interface ClientAdminServicesPageProps {
  initialBookings: ServiceBooking[];
}

export default function ClientAdminServicesPage({ initialBookings }: ClientAdminServicesPageProps) {
  const [bookings, setBookings] = useState<ServiceBooking[]>(initialBookings);
  const [editingBooking, setEditingBooking] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceBooking>>({});

  const handleStatusUpdate = async (id: number, status: ServiceBooking["status"]) => {
    try {
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the booking status in the frontend
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === id ? { ...booking, status } : booking
          )
        );
      } else {
        throw new Error(result.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const handleEditStart = (booking: ServiceBooking) => {
    setEditingBooking(booking.id);
    setEditForm({
      estimated_cost: booking.estimated_cost,
      technician_notes: booking.technician_notes || "",
    });
  };

  const handleEditSave = async () => {
    if (editingBooking && (editForm.estimated_cost || editForm.technician_notes)) {
      try {
        const response = await fetch(`/api/admin/services?id=${editingBooking}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            estimated_cost: editForm.estimated_cost,
            technician_notes: editForm.technician_notes
          }),
        });

        const result = await response.json();

        if (result.success) {
          // Update the booking in the frontend
          setBookings(prevBookings => 
            prevBookings.map(booking => 
              booking.id === editingBooking 
                ? { ...booking, estimated_cost: editForm.estimated_cost, technician_notes: editForm.technician_notes } 
                : booking
            )
          );
          setEditingBooking(null);
          setEditForm({});
        } else {
          throw new Error(result.message || 'Failed to update booking');
        }
      } catch (error) {
        console.error('Error updating booking:', error);
        alert('Failed to update booking');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(`/api/admin/services?id=${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          // Remove the booking from the frontend
          setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
        } else {
          throw new Error(result.message || 'Failed to delete booking');
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking');
      }
    }
  };

  const getStatusColor = (status: ServiceBooking["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen Layanan</h1>
        <p className="text-muted-foreground">Kelola booking dan jadwal layanan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Booking", value: bookings.length, color: "text-blue-600" },
          { label: "Pending", value: bookings.filter((b) => b.status === "pending").length, color: "text-yellow-600" },
          {
            label: "Confirmed",
            value: bookings.filter((b) => b.status === "confirmed").length,
            color: "text-green-600",
          },
          {
            label: "Completed",
            value: bookings.filter((b) => b.status === "completed").length,
            color: "text-purple-600",
          },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Booking #{booking.id}
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {booking.service_type} • {new Date(booking.created_at).toLocaleDateString("id-ID")}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditStart(booking)}
                    disabled={editingBooking === booking.id}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(booking.id)}
                    className="text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.customer_phone}</span>
                </div>
                {booking.customer_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.customer_email}</span>
                  </div>
                )}
              </div>

              {/* Schedule & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.preferred_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.preferred_time}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm">{booking.address}</span>
              </div>

              {booking.description && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-1">Deskripsi:</p>
                  <p className="text-sm text-muted-foreground">{booking.description}</p>
                </div>
              )}

              {/* Edit Form */}
              {editingBooking === booking.id ? (
                <div className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estimasi Biaya</Label>
                      <Input
                        type="number"
                        value={editForm.estimated_cost || ""}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, estimated_cost: Number(e.target.value) }))}
                        placeholder="Masukkan estimasi biaya"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Catatan Teknisi</Label>
                    <Textarea
                      value={editForm.technician_notes || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, technician_notes: e.target.value }))}
                      placeholder="Tambahkan catatan untuk klien"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleEditSave} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Simpan
                    </Button>
                    <Button variant="outline" onClick={() => setEditingBooking(null)} size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {booking.estimated_cost && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        Estimasi Biaya: Rp {booking.estimated_cost.toLocaleString("id-ID")}
                      </p>
                    </div>
                  )}

                  {booking.technician_notes && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Catatan Teknisi:</p>
                      <p className="text-sm text-blue-700">{booking.technician_notes}</p>
                    </div>
                  )}
                </>
              )}

              {/* Status Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Select
                  value={booking.status}
                  onValueChange={(value) => handleStatusUpdate(booking.id, value as ServiceBooking["status"])}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}

        {bookings.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Belum ada booking layanan</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}