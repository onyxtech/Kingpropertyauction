export const preventMinus = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === '-' || e.key === 'e' || e.key === 'E') e.preventDefault();
};
