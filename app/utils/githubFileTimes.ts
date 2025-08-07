import { Octokit } from "@octokit/rest";
import fs from "fs";

export interface FileTimes {
  createdAt: Date;
  updatedAt: Date;
}

interface FileDataWithIds extends FileTimes {
  cId: string;
  uId: string;
  dirId: string;
}

interface FileItemWithIds {
  [key: string]: FileDataWithIds;
}

export async function fetchRepoFileTimes(options: {
  owner: string;
  repo: string;
  branch: string;
  token?: string;
  sortConfig?: {
    sortBy: "createdAt" | "updatedAt";
    order: "asc" | "desc";
  };
}): Promise<FileItemWithIds> {
  const octokit = new Octokit({ auth: options.token });
  const cache: Record<string, FileTimes> = {};

  // 递归获取目录内容
  async function processDirectory(path: string) {
    try {
      console.log("正在获取目录：", path);
      const { data } = await octokit.rest.repos.getContent({
        owner: options.owner,
        repo: options.repo,
        ref: options.branch,
        path,
      });
      // console.log("获取目录内容：", data);
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

  // 递归处理目录结构
  function processDirectoryStructure(
    data: Record<string, FileTimes>
  ): FileItemWithIds {
    const result: FileItemWithIds = {};
    const allPaths = new Set(Object.keys(data));
    const dirMap: Record<string, string[]> = {};
    const fileMap: Record<string, boolean> = {};

    // 第一步：识别所有目录
    Object.keys(data).forEach((path) => {
      const parts = path.split("/");

      // 记录每个路径是文件还是目录
      fileMap[path] = true;

      // 为所有父目录添加记录
      for (let i = 1; i < parts.length; i++) {
        const dirPath = parts.slice(0, i).join("/");
        if (!dirMap[dirPath]) dirMap[dirPath] = [];
        dirMap[dirPath].push(path);

        // 添加目录到所有路径
        allPaths.add(dirPath);
      }
    });

    // 第二步：为所有目录创建时间数据（基于目录下文件的时间）
    allPaths.forEach((path) => {
      if (!data[path] && dirMap[path]) {
        let minCreated = new Date();
        let maxUpdated = new Date(0);

        dirMap[path].forEach((childPath) => {
          const times = data[childPath];
          if (times) {
            if (times.createdAt < minCreated) minCreated = times.createdAt;
            if (times.updatedAt > maxUpdated) maxUpdated = times.updatedAt;
          }
        });

        // 创建目录的时间数据
        data[path] = {
          createdAt: minCreated,
          updatedAt: maxUpdated,
        };
      }
    });

    // 第三步：按父目录分组并排序
    const groups: Record<string, string[]> = {};

    // 创建分组
    allPaths.forEach((path) => {
      const parts = path.split("/");
      const dirPath = parts.slice(0, parts.length - 1).join("/") || "root";

      if (!groups[dirPath]) groups[dirPath] = [];
      groups[dirPath].push(path);
    });

    // 第四步：对每组排序并分配ID
    Object.keys(groups).forEach((dirPath) => {
      const items = groups[dirPath] || [];

      // 使用配置的排序方式
      const sortField = options.sortConfig?.sortBy || "createdAt";
      const sortOrder = options.sortConfig?.order === "asc" ? 1 : -1;

      items.sort((a, b) => {
        const aTime = data[a]?.[sortField]?.getTime() || 0;
        const bTime = data[b]?.[sortField]?.getTime() || 0;
        return (aTime - bTime) * sortOrder || a.localeCompare(b);
      });

      // 计算需要补零的位数
      const padding = Math.max(2, Math.ceil(Math.log10(items.length + 1)));

      // 分配ID
      items.forEach((item, index) => {
        const id = (index + 1).toString().padStart(padding, "0");
        const isDirectory = dirMap[item] !== undefined;

        result[item] = {
          ...(data[item] || {
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
          cId: id,
          uId: id,
          // 目录使用自己的cId作为dirId（之前是使用子项的最小ID）
          dirId: id,
        };
      });
    });

    return result;
  }

  console.log("Fetching GitHub file times...");
  await processDirectory("");
  console.log(`Fetched times for ${Object.keys(cache).length} files`);
  const result = processDirectoryStructure(cache);
  // console.log(result);
  // 写入到当前路径下的result.json
  fs.writeFileSync(
    `${process.cwd()}/result.json`,
    JSON.stringify(result, null, 2)
  );
  return result;
}
