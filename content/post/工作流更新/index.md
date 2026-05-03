+++
title = "工作流更新"
slug = "工作流更新"
date = "2026-05-03T14:25:17.000Z"
lastmod = "2026-05-03T18:14:53.000Z"
draft = false
siyuan_id = "20260503222517-16jmoik"
siyuan_path = "/工作流更新"
+++
# 工作流更新

这篇博客旨在为从 Claude 转到 Codex 的工作者提供一些注意事项与 Tips。

Claude code 的工作方式与 Codex 还是有些许不一样，Claude code 更适合长对话的上下文，将模糊的想法转为可实现的东西，而 Codex 更专注于任务的执行，所以需要稍微改变一下我们的使用习惯。

先介绍下我的 Claude 工作流，大致为：先沉淀想法 → 生成规格文档 → 拆架构与里程碑 → issue 化 bug → 研究报告驱动修复 → commit 同步 changelog/status，维护项目的变更日志与进度。

首先最明显的改变即是 `CLAUDE.md` 改为 `AGENTS.md`，但他们维护重心都是要求要短、准确、实用，不要写成又长又泛的“愿景文档”。

我的长期维护文件也有变化，新增了`decisions.md`

```bash
.
├── AGENTS.md                  # Codex 的长期项目指令，替代 CLAUDE.md
├── docs/
│   ├── brainstorm.md          # 想法池，偏发散
│   ├── project_spec.md        # 产品规格，偏稳定
│   ├── architecture.md        # 架构设计
│   ├── project_status.md      # 当前进度与里程碑
│   ├── changelog.md           # 用户可读/开发可读变更记录
│   ├── decisions.md           # 重要技术决策记录
│   └── bugs/
│       └── issue-xxx-research.md
```

我之前的工作流有一个问题，即每次commit会把变化放在 `project_status` 和 `changelog`，时间长了这部分记录会非常长，这类决策后面会反复影响实现。`decisions.md` 专门记录技术取舍，比放进 `changelog` 更清除
