import moment from 'moment'

export const checkDateFormat = (date): boolean => {
  return moment(date, 'YYYY-MM-DD hh:mm', true).isValid()
}
