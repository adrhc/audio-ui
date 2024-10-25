export type ParamValue = [string, string];

export function toQueryParams(...param: ParamValue[]) {
  const params = new URLSearchParams();
  param.forEach(([name, value]) => {
    params.set(name, value);
  });
  return params;
}
