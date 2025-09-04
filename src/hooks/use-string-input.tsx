import { useState } from 'react';

export const useStringInput = (initialstate: string) => {
  const [value, setValue] = useState(initialstate);

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const resetValue = () => {
    setValue(initialstate);
  };

  return { value, handleValue, resetValue };
};
