import { useState, useEffect } from "react";

export function useLocalStorageState(initialValue, key) {
  const [value, setValue] = useState(function () {
    const returnValue = localStorage.getItem(key);
    return JSON.parse(returnValue) || initialValue;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key, value]
  );
  return [value, setValue];
}
