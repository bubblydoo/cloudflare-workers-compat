declare const CF_WORKER_COMPAT_ON_INCOMPATIBLE: "ignore" | "warn" | "throw";

export const warnOrThrowIncompatible = (id: string, args: any[] = [], extraInfo?: string) => {
  if (
    typeof CF_WORKER_COMPAT_ON_INCOMPATIBLE !== "undefined" &&
    CF_WORKER_COMPAT_ON_INCOMPATIBLE !== "ignore"
  ) {
    let printedArgs: string[] = [];
    if (typeof args[0] === "string" && args[0].length < 100) {
      printedArgs.push(`"${args[0]}"`);
    } else {
      printedArgs.push("...");
    }
    if (args.length > 1) {
      printedArgs.push("...");
    }
    const printedArgsStr = printedArgs.join(", ");
    const warningOrError = `Called \`${id}(${printedArgsStr})\`, ${extraInfo ? `${extraInfo}, ` : ''}but this is not available in Workers`;

    if (CF_WORKER_COMPAT_ON_INCOMPATIBLE === "warn") {
      console.warn(warningOrError);
    } else {
      throw new Error(warningOrError);
    }
  }
};
