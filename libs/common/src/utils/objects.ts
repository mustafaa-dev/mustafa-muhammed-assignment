export function getKeyByValue(object: object, value: any) {
  if (object === null || object === undefined) return undefined;
  let result: any = undefined;
  value = value.toString().substring(1, value.length - 1);
  Object.keys(object).some((key: string): boolean => {
    if (object[key] === value) {
      result = key;
      return true;
    } else if (typeof object[key] === 'object') {
      result = getKeyByValue(object[key], value);
      return result !== undefined;
    }
  });
  return result;
}
