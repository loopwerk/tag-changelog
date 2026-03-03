import { parser, toConventionalChangelogFormat } from "@conventional-commits/parser";
import type { ParsedCommit, FetchUserFunc } from "./types";

const PR_REGEX = /#([1-9]\d*)/;

export default async function parseCommitMessage(message: string, repoUrl?: string, fetchUserFunc?: FetchUserFunc): Promise<ParsedCommit> {
  let cAst: ParsedCommit;

  try {
    const ast = parser(message);
    cAst = toConventionalChangelogFormat(ast) as ParsedCommit;
  } catch {
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
  if (found && repoUrl && fetchUserFunc) {
    const pullNumber = found[1];

    try {
      const { username, userUrl } = await fetchUserFunc(pullNumber);
      cAst.subject = cAst.subject.replace(PR_REGEX, () => `[#${pullNumber}](${repoUrl}/pull/${pullNumber}) by [${username}](${userUrl})`);
    } catch {
      // We found a #123 style hash, but it wasn't a valid PR. Ignore.
    }
  }

  return cAst;
}
