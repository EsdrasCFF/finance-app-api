export function checkIfAmountIsValid(value: any): boolean {
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