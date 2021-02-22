const groupByType = require("./groupByType");
const translateType = require("./translateType");

function generateChangelog(releaseName, commitObjects, excludeTypes, config) {
  const commitsByType = groupByType(commitObjects, config.types);
  let changes = "";

  commitsByType
    .filter((obj) => {
      return !excludeTypes.includes(obj.type);
    })
    .forEach((obj) => {
      const niceType = translateType(obj.type, config.types);
      changes += config.renderTypeSection(niceType, obj.commits);
    });

  const changelog = config.renderChangelog(releaseName, changes);

  return {
    changelog: changelog,
    changes: changes,
  };
}

module.exports = generateChangelog;
