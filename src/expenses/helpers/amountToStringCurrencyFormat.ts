export const amountToStringCurrencyFormat = (amount: number): string => {
  return `$ ${amount.toFixed(2).replace('.', ',')}`;
};
