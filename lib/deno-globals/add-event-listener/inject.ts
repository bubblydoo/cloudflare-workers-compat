import { warnOrThrowIncompatible } from "../../../warn-or-throw-incompatible.js";

export const workerGlobal_addEventListener = (...args: any[]) => warnOrThrowIncompatible("globalThis.addEventListener", args)
