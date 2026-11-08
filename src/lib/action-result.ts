export type FieldErrors = Record<string, string[]>;

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

export function actionOk<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function actionError(
  error: string,
  fieldErrors?: FieldErrors,
): ActionResult<never> {
  return { ok: false, error, fieldErrors };
}
