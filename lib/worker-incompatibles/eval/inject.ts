import { warnOrThrowIncompatible } from "../../../warn-or-throw-incompatible.js";

export const workerCompat_eval = (code: string) => {
  warnOrThrowIncompatible("eval");
  return null;
}

