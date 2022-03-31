export function safeParseInt(str: string | null | undefined): number | null {
  const value = parseInt(str ?? '');
  return isNaN(value) ? null : value;
}

export function safeParseBoolean(str: string | null | undefined): boolean | null {
  if(!str) {
    return null;
  }
  return str === 'true';
}

/**
 * 指定された引数が文字列かどうかを取得します
 *
 * @param mayString 文字列かどうかを判定する何か
 */
export function isString(mayString: unknown): mayString is string {
  return typeof mayString == "string" || mayString instanceof String;
}

/**
 * 指定された引数がオブジェクトかどうかを取得します
 *
 * @param mayObject オブジェクトかどうかを判定する何か
 */
export function isObject(mayObject: unknown): mayObject is object {
  return typeof mayObject === 'object' && mayObject !== null && !Array.isArray(mayObject);
}

/**
 * 指定された引数が空のオブジェクトかどうかを取得します
 *
 * @param mayEmptyObject オブジェクトが空かどうかを判定する何か
 */
export function isEmptyObject(mayEmptyObject: unknown): boolean {
  return isObject(mayEmptyObject) && Object.keys(mayEmptyObject).length === 0;
}

/**
 * 指定された引数が関数かどうかを取得します
 *
 * @param mayFunction 関数かどうかを判定する何か
 */
export function isFunction(mayFunction: unknown): mayFunction is Function {
  return typeof mayFunction === 'function';
}

/**
 * 指定された引数が Date かどうかを取得します
 *
 * @param mayDate Date かどうかを判定する何か
 */
export function isDate(mayDate: unknown): mayDate is Date {
  return mayDate instanceof Date;
}

/**
 * 指定された引数が数値かどうかを取得します
 *
 * @param mayNumber 数値かどうかを判定する何か
 */
export function isNumber(mayNumber: unknown): mayNumber is number {
  return typeof mayNumber === 'number' && isFinite(mayNumber);
}
