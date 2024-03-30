export const calculateInstallmentAmount = (amount: number, installments: number): number => {
  if (installments === 1) return amount;
  const installmentAmount = amount / installments;
  return Math.round(installmentAmount * 100) / 100;
};
