const { execSync } = require("child_process");

function runCommand(cmd) {
  console.log(`> ${cmd}`);
  try {
    return execSync(cmd, { stdio: "inherit" });
  } catch (err) {
    console.error(`Command failed: ${cmd}`);
    throw err;
  }
}

async function main() {
  console.log("\n========================================================");
  console.log("  Creating NexoreUI v2.0.0 & latest Release Tags");
  console.log("========================================================\n");

  const tagName = "v2.0.0";
  const tagMessage = "NexoreUI v2.0.0: High-craft Swiss design system, 60+ UI components, remote CLI Pro delivery, and Neon PostgreSQL registry";

  // Create annotated tag
  try {
    runCommand(`git tag -a ${tagName} -m "${tagMessage}" -f`);
    console.log(`✔ Created tag ${tagName}`);
  } catch (e) {
    console.warn(`Tag ${tagName} creation warning:`, e.message);
  }

  // Create 'latest' pointer tag
  try {
    runCommand(`git tag -a latest -m "NexoreUI latest production release (v2.0.0)" -f`);
    console.log(`✔ Created tag latest`);
  } catch (e) {
    console.warn(`Tag latest creation warning:`, e.message);
  }

  // Push tags to origin
  console.log("\nPushing tags to GitHub...");
  try {
    runCommand(`git push origin ${tagName} --force`);
    runCommand(`git push origin latest --force`);
    console.log(`\n✔ Successfully pushed tags '${tagName}' and 'latest' to GitHub!`);
  } catch (e) {
    console.error(`Failed to push tags to remote:`, e.message);
  }

  console.log("\n========================================================");
  console.log(`  GitHub Release URL:`);
  console.log(`  https://github.com/Al1mov77/NexoreUI/releases/tag/${tagName}`);
  console.log("========================================================\n");
}

main().catch(() => process.exit(1));
