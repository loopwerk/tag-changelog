const { parser, toConventionalChangelogFormat } = require("@conventional-commits/parser");

const PR_REGEX = /#([1-9]\d*)/g;

function parseCommitMessage(message, repoUrl) {
  let cAst;

  try {
    const ast = parser(message);
    cAst = toConventionalChangelogFormat(ast);
  } catch (error) {
    // Not a valid commit
    cAst = {
      subject: message.split("\n")[0],
      type: "other",
    };
  }

  cAst.subject = cAst.subject.replace(PR_REGEX, (match, pull) => `[${match}](${repoUrl}/pull/${pull})`);

  return cAst;
}

module.exports = parseCommitMessage;
