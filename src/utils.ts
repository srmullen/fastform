import clone from 'lodash.clone';
import toPath from 'lodash.topath';

export const isObject = (obj: any): obj is object =>
  obj !== null && typeof obj === 'object';

export const isInteger = (obj: any): boolean =>
  String(Math.floor(Number(obj))) === obj;

export const isArray = (obj: any): obj is Array<any> =>
  Array.isArray(obj);

export function getNodeType(node: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  if (node instanceof HTMLSelectElement) {
    return 'select';
  } else {
    return node.type;
  }
}

export function getIn(
  obj: any,
  key: string | string[],
  def?: any,
  p: number = 0
) {
  const path = toPath(key);
  while (obj && p < path.length) {
    obj = obj[path[p++]]
  }
  return obj === undefined ? def : obj;
}

export function setIn(
  obj: any,
  path: string,
  value: any
) {
  let res: any = clone(obj);
  let resVal: any = res;
  let i = 0;
  let pathArray = toPath(path);

  for (; i < pathArray.length - 1; i++) {
    const currentPath: string = pathArray[i];
    let currentObj = getIn(obj, pathArray.slice(0, i + 1));

    if (currentObj && isObject(currentObj) || Array.isArray(currentObj)) {
      resVal = resVal[currentPath] = clone(currentObj);
    } else {
      const nextPath: string = pathArray[i + 1];
      resVal = resVal[currentPath] = isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {}
    }
  }

  // Return original object if same as current
  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj;
  }

  if (value === undefined) {
    delete resVal[pathArray[i]];
  } else {
    resVal[pathArray[i]] = value;
  }

  // If the path array has a single element, the loop did not run.
  // Deleting on resVal has no effect in this scenario, so we delete on res instead.
  if (i === 0 && value === undefined) {
    delete res[pathArray[i]];
  }

  return res;
}