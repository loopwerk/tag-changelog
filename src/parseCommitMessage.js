const { parser, toConventionalChangelogFormat } = require("@conventional-commits/parser");

const PR_REGEX = /#([1-9]\d*)/;

async function parseCommitMessage(message, repoUrl, fetchUserFunc) {
  let cAst;

  try {
    const ast = parser(message);
    cAst = toConventionalChangelogFormat(ast);
  } catch (error) {
    // Not a valid commit
    const lines = message.split("\n");
    cAst = {
      subject: lines[0],
      type: "other",
    };
    const bodyStart = message.indexOf("\n\n");
    if (bodyStart !== -1) {
      cAst.body = message.substring(bodyStart + 2);
    }
  }

  const found = cAst.subject.match(PR_REGEX);
  if (found) {
    const pullNumber = found[1];

    try {
      const { username, userUrl } = await fetchUserFunc(pullNumber);
      cAst.subject = cAst.subject.replace(PR_REGEX, () => `[#${pullNumber}](${repoUrl}/pull/${pullNumber}) by [${username}](${userUrl})`);
    } catch (error) {
      // We found a #123 style hash, but it wasn't a valid PR. Ignore.
    }
  }

  return cAst;
}

module.exports = parseCommitMessage;
