import { Octokit } from "@octokit/rest";

// 定义文件时间类型
export interface FileTimes {
  [path: string]: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// GitHub 文件时间获取函数
export async function fetchRepoFileTimes(options: {
  owner: string;
  repo: string;
  branch: string;
  token?: string;
}): Promise<FileTimes> {
  const octokit = new Octokit({ auth: options.token });
  const cache: FileTimes = {};

  // 递归获取目录内容
  async function processDirectory(path: string) {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: options.owner,
        repo: options.repo,
        ref: options.branch,
        path,
      });

      if (!Array.isArray(data)) return;

      for (const item of data) {
        if (item.type === "dir") {
          await processDirectory(item.path);
        } else if (item.type === "file") {
          // 获取文件提交历史
          const commits = await octokit.rest.repos.listCommits({
            owner: options.owner,
            repo: options.repo,
            path: item.path,
            per_page: 1,
          });

          if (commits.data.length > 0) {
            const firstCommit = commits.data[commits.data.length - 1];
            const lastCommit = commits.data[0];

            cache[item.path] = {
              createdAt: new Date(
                firstCommit?.commit?.author?.date ||
                  firstCommit?.commit?.committer?.date ||
                  ""
              ),
              updatedAt: new Date(
                lastCommit?.commit?.author?.date ||
                  lastCommit?.commit?.committer?.date ||
                  ""
              ),
            };
          }
        }
      }
    } catch (error) {
      console.error(`Error processing directory ${path}:`, error);
    }
  }

  console.log("Fetching GitHub file times...");
  await processDirectory("");
  console.log(`Fetched times for ${Object.keys(cache).length} files`);

  return cache;
}
