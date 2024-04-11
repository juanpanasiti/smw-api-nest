import * as moment from 'moment';

export const getNextMonth = (date: Date): Date => {
  const nextMonth = moment(date).add(1, 'day').add(1, 'month').subtract(1, 'day').toDate();
  return nextMonth;
};
