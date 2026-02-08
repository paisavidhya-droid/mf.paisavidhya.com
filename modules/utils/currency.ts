//conver 1000 to ₹1,000 in string
export const convertCurrencyToString = (value: number) => {
  const val = Math.round(value * 100) / 100;

  return val.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
};

// cobvert ₹1,000 to 1000 in number
export const convertStringToCurrency = (value: string) => {
  let res = "";
  for (let i = 0; i < value.length; i++) {
    const val = value[i];
    if (val === "₹" || val === ",") continue;
    else res = res + val;
  }

  if (!res || !value) return 0;

  return parseFloat(res);
};

const convertToCurrencyForLakhAndCrore = (number: number) => {
  if (isNaN(number)) {
    return "0";
  }

  if (number < 1e5) {
    return number.toLocaleString("en-IN");
  } else if (number < 1e7) {
    const lakhs = Math.floor(number / 1e5);
    const remainder = number % 1e5;
    const decimal = (remainder / 1e5).toFixed(2);
    if (decimal === "0.00") {
      return `${lakhs.toLocaleString("en-IN")} Lakhs`;
    } else {
      return `${lakhs.toLocaleString("en-IN")}.${decimal.slice(2)} Lakhs`;
    }
  } else {
    const crores = Math.floor(number / 1e7);
    const remainder = number % 1e7;
    const decimal = (remainder / 1e7).toFixed(2);
    if (decimal === "0.00") {
      return `${crores.toLocaleString("en-IN")} Crores`;
    } else {
      return `${crores.toLocaleString("en-IN")}.${decimal.slice(2)} Crores`;
    }
  }
};

export const convertToCurrencyWithWords = (number: number) => {
  const formattedNumber = convertToCurrencyForLakhAndCrore(number);

  if (number >= 1e3 && number < 1e5) {
    const thousands = Math.floor(number / 1e3);
    const remainder = number % 1e3;
    const decimal = (remainder / 1e3).toFixed(2);
    if (decimal === "0.00") {
      return `${thousands.toLocaleString("en-IN")} Thousands`;
    } else {
      return `${thousands.toLocaleString("en-IN")}.${decimal.slice(2)} Thousands`;
    }
  } else {
    return formattedNumber;
  }
};
