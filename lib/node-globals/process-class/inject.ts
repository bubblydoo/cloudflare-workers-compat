import { workerGlobal_process } from "../process/inject.js";

export function workerConst_processClass() {
  Object.assign(this, workerGlobal_process);
}
