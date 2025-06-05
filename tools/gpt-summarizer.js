const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Get stack name from CLI arg
const stack = process.argv[2];
if (!stack) {
  console.error(
    "Stack name required, e.g. node gpt-summarizer.js react-firebase"
  );
  process.exit(1);
}

const cwd = path.join(__dirname, "..", "stacks", stack);

function readIfExists(file) {
  try {
    return fs.readFileSync(path.join(cwd, file), "utf8");
  } catch {
    return "";
  }
}

const pkg = readIfExists("package.json");
const reqs = readIfExists("requirements.txt");

// Compose prompt for GPT
let prompt = `This is an automated dependency update for the \"${stack}\" template.\n`;

if (pkg) prompt += `New package.json:\n${pkg}\n\n`;
if (reqs) prompt += `New requirements.txt:\n${reqs}\n\n`;

prompt += `Please:
- Summarize the dependency changes.
- Assess risk (safe, minor, breaking, or unknown).
- Suggest a PR title and PR description.
`;

// Call OpenAI
async function summarize() {
  const chat = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You write concise changelogs for developers.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  const text = chat.choices[0].message.content;
  // Optionally, parse for PR title/desc using regex
  const match = text.match(/PR Title:(.*)\nPR Description:(.*)/s);
  if (match) {
    console.log("::set-output name=pr_title::" + match[1].trim());
    console.log("::set-output name=pr_body::" + match[2].trim());
  } else {
    // Fallback, output all
    console.log(text);
  }
}

summarize();
