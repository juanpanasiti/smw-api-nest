import * as moment from 'moment';

export const getNextMonth = (date: Date): Date => {
  const nextMonth = moment(date).add(1, 'month').toDate();
  return nextMonth;
};
