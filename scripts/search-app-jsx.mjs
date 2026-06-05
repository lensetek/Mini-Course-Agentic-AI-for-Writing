import fs from "fs";

const content = fs.readFileSync("src/App.jsx", "utf8");
const lines = content.split("\n");

lines.forEach((line, idx) => {
  if (line.includes("modulesList") || line.includes("NotebookLM") || line.includes("Google Opal")) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
