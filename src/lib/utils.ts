export function checkIfAmountIsValid(value: string | number): boolean {
  if (typeof value === 'number') {
    return true;
  }
  
  if (typeof value === 'string') {
    const parsedValue = parseFloat(value);
    return !isNaN(parsedValue) && isFinite(parsedValue);
  }

  return false;
}


export function roundAmountToTwoDecimals(value: number): number {
  return parseFloat(value.toFixed(2));
}

export function convertHundredUnitsToAmount(value: number | bigint) {
  const amount = parseFloat((Number(value) / 100).toFixed(2))

  return amount
}