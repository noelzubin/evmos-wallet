export const setWallet = (wallet: string) =>
  localStorage.setItem("wallet", wallet);

export const getWallet = () => {
  return localStorage.getItem("wallet");
};
