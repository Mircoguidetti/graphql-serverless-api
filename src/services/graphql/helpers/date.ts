import moment from 'moment'

export const checkDateFormat = (startTime, endTime): string | null => {
  const momentStartTime = moment(startTime, 'YYYY-MM-DD hh:mm')
  const momentEndTime = moment(endTime, 'YYYY-MM-DD hh:mm')

  // Check date format to book an appointment
  const appointmentDuration = momentEndTime.diff(momentStartTime, 'minutes')
  const appointmentStartTimeDiffNow = momentStartTime.diff(moment(), 'minutes')
  const appointmentEndTimeDiffNow = momentEndTime.diff(moment(), 'minutes')
  if (appointmentStartTimeDiffNow < 0 || appointmentEndTimeDiffNow < 0) {
    return 'Appointment (start on end) must be in the future!'
  }
  if (appointmentDuration > 60 || appointmentDuration <= 0) {
    return 'Appointment duration must be less then 1hour!'
  }
  if (!moment(startTime, 'YYYY-MM-DD hh:mm', true).isValid() || !moment(endTime, 'YYYY-MM-DD hh:mm', true).isValid()) {
    return 'Invalid date format (YYYY-MM-DD hh:mm)'
  }

  return null
}
