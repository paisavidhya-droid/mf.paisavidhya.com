import { useEffect, useState } from "react";

const useTimer = (initialTimeLeft: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

  const resetTimer = (time: number) => {
    setTimeLeft(time);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (timeLeft <= 0) {
        clearTimeout(handler);
        return;
      }
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [timeLeft]);

  return { timeLeft, resetTimer };
};

export default useTimer;
