import moment from 'moment'

export const checkDateFormat = (date) => {
  return moment(date, 'YYYY-MM-DD hh:mm', true).isValid()
}
