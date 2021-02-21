const groupByType = require("./groupByType");
const { translateType } = require("./translateType");

function generateChangelog(releaseName, commitObjects, excludeTypes) {
  const commitsByType = groupByType(commitObjects);
  let changes = "";

  commitsByType
    .filter((obj) => {
      return !excludeTypes.includes(obj.type);
    })
    .forEach((obj) => {
      const niceType = translateType(obj.type);
      changes += `\n## ${niceType}\n`;

      obj.commits.forEach((commit) => {
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
