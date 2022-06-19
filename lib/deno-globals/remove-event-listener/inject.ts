import { warnOrThrowIncompatible } from "../../../warn-or-throw-incompatible.js";

export const workerGlobal_removeEventListener = (...args: any[]) => warnOrThrowIncompatible("globalThis.removeEventListener", args)
