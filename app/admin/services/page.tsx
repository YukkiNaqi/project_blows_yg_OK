"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Phone, Mail, User, Edit, Save, X } from "lucide-react"
import { serviceBookingManager, serviceTypes, type ServiceBooking } from "@/lib/services"

export default function AdminServicesPage() {
  const [bookings, setBookings] = useState<ServiceBooking[]>([])
  const [editingBooking, setEditingBooking] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<ServiceBooking>>({})

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    const data = await serviceBookingManager.getBookings()
    setBookings(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
  }

  const handleStatusUpdate = async (id: number, status: ServiceBooking["status"]) => {
    await serviceBookingManager.updateBookingStatus(id, status)
    loadBookings()
  }

  const handleEditStart = (booking: ServiceBooking) => {
    setEditingBooking(booking.id)
    setEditForm({
      estimated_cost: booking.estimated_cost,
      technician_notes: booking.technician_notes || "",
    })
  }

  const handleEditSave = async () => {
    if (editingBooking && editForm.estimated_cost) {
      await serviceBookingManager.updateEstimatedCost(editingBooking, editForm.estimated_cost)
      if (editForm.technician_notes) {
        await serviceBookingManager.updateBookingStatus(editingBooking, "confirmed", editForm.technician_notes)
      }
      setEditingBooking(null)
      setEditForm({})
      loadBookings()
    }
  }

  const getStatusColor = (status: ServiceBooking["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getServiceName = (serviceId: string) => {
    return serviceTypes.find((s) => s.id === serviceId)?.name || serviceId
  }

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
                    {getServiceName(booking.service_type)} • {new Date(booking.created_at).toLocaleDateString("id-ID")}
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
