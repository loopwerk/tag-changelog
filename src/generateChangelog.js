const groupByType = require("./groupByType");
const translateType = require("./translateType");

function generateChangelog(releaseName, commitObjects, excludeTypes) {
  const commitsByType = groupByType(commitObjects);
  let changes = "";

  Object.keys(commitsByType)
    .filter((type) => {
      return !excludeTypes.includes(type);
    })
    .forEach((key) => {
      const commits = commitsByType[key];

      const niceType = translateType(key);
      changes += `\n## ${niceType}\n`;

      commits.forEach((commit) => {
        changes += `- ${commit.subject}\n`;
      });
    });

  const now = new Date();
  const changelog = `# ${releaseName} - ${now.toISOString().substr(0, 10)}\n` + changes + "\n\n";

  return {
    changelog: changelog,
    changes: changes,
  };
}

module.exports = generateChangelog;
