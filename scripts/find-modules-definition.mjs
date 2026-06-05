import fs from "fs";

const content = fs.readFileSync("src/App.jsx", "utf8");
// Let's find the start of the EN: { block and grab its modulesList definition
const enStartIndex = content.indexOf("EN: {");
if (enStartIndex !== -1) {
  const modulesListIndex = content.indexOf("modulesList: [", enStartIndex);
  if (modulesListIndex !== -1) {
    let bracketCount = 1;
    let index = modulesListIndex + "modulesList: [".length;
    let modulesListStr = "modulesList: [";
    while (bracketCount > 0 && index < content.length) {
      const char = content[index];
      modulesListStr += char;
      if (char === "[") bracketCount++;
      else if (char === "]") bracketCount--;
      index++;
    }
    console.log("Found modulesList in EN:");
    console.log(modulesListStr);
  }
}
