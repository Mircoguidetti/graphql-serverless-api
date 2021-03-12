export interface AppointmentInterface {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface AppointmentBookingInterface {
  isBooked: boolean
  message: string
}
