const fs = require('fs');
const file = "C:\\Users\\miki1\\.gemini\\antigravity-ide\\brain\\69faf582-e41a-4107-87f8-c77e641ae4e1\\.system_generated\\logs\\transcript.jsonl";
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
let found = false;
for (const line of lines) {
  if (line.trim() && line.includes('"step_index":74')) {
    const json = JSON.parse(line);
    let code = json.tool_calls[0].args.CodeContent;
    if (code.startsWith('"') && code.endsWith('"')) {
      try {
        code = JSON.parse(code);
      } catch (e) {
        console.log("parse error, keeping original");
      }
    }
    fs.writeFileSync("C:\\Users\\miki1\\OneDrive\\Documents\\R-Project\\CinimaRace-v2\\frontend\\src\\components\\common\\AppUpdateModal.jsx", code);
    console.log("SUCCESS. Length:", code.length);
    found = true;
    break;
  }
}
if (!found) {
  console.log("NOT FOUND");
}
