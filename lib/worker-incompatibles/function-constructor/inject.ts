import { warnOrThrowIncompatible } from "../../../warn-or-throw-incompatible.js";

const __CF_COMPAT_Functiondotprototype__ = "%CF_COMPAT_Function.prototype%";

function workerCompat_functionConstructor(name: string)  {
  warnOrThrowIncompatible('new Function', [name]);

  return () => {
    warnOrThrowIncompatible('new Function', [name], 'and then tried to execute it');
    return {};
  };
};

const workerCompat_functionConstructorPrototype =
  __CF_COMPAT_Functiondotprototype__;

workerCompat_functionConstructor.prototype =
  workerCompat_functionConstructorPrototype;

export {
  workerCompat_functionConstructor,
  workerCompat_functionConstructorPrototype,
};
