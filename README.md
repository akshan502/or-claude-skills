# or-skill-crafter

一个跨平台的技能创建和迭代改进工具，支持 Claude Code、OpenCode 和 OpenClaw 平台。

## 功能

- 创建结构化技能（基于 5 种核心设计模式）
- 运行测试用例评估技能效果
- A/B 对比（带技能 vs 不带技能）
- 描述优化以提高触发准确性
- HTML 审查可视化

## 设计模式

| 模式 | 适用场景 |
|------|----------|
| Tool Wrapper | Agent 需要按需获取库/框架的专业知识 |
| Generator | 需要从模板生成一致的输出结构 |
| Reviewer | 系统性的代码/输出质量检查 |
| Inversion | 必须在行动前收集完整需求 |
| Pipeline | 带有硬性检查点的多步骤工作流 |
| Composite | 上述模式的组合 |

完整模式指南见 [references/adk-patterns.md](references/adk-patterns.md)。

## 快速开始

### 1. 创建技能

使用 Skill Crafter 技能创建新技能：

```bash
# 初始化评估工作区
python -m scripts.init_workspace <workspace-dir>

# 快速验证技能结构
python -m scripts.quick_validate <skill-path>
```

### 2. 运行评估

编写测试用例后，运行评估：

```bash
# Claude Code 平台
python scripts/run_eval.py <skill-path> <evals.json>

# OpenCode/OpenClaw 平台
python scripts/run_eval_opencode.py <skill-path> <evals.json>
```

### 3. 聚合结果并查看

```bash
# 聚合基准结果
python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>

# 启动审查查看器（浏览器）
python eval-viewer/generate_review.py <workspace>/iteration-N --skill-name "my-skill"

# 生成静态 HTML（OpenCode/OpenClaw）
python eval-viewer/generate_review.py <workspace>/iteration-N --skill-name "my-skill" --static output.html
```

### 4. 描述优化（仅 Claude Code）

```bash
python -m scripts.run_loop \
  --eval-set trigger-eval.json \
  --skill-path ./my-skill \
  --model claude-sonnet-4-6 \
  --max-iterations 5 \
  --verbose
```

## 项目结构

```
or-skill-crafter/
├── SKILL.md                # 技能定义文件
├── CLAUDE.md               # Claude Code 上下文文件
├── agents/                 # 评估代理定义
│   ├── grader.md           # 断言评分标准
│   ├── comparator.md       # A/B 对比代理
│   └── analyzer.md         # 基准结果分析
├── references/             # 设计模式和规范文档
│   ├── adk-patterns.md     # 设计模式指南（含示例和决策树）
│   ├── review-checklist.md # 审查清单
│   ├── schemas.md          # JSON 结构定义
│   └── pattern-examples/   # 每种模式的完整示例
├── assets/                 # 模板文件
│   ├── skill-template.md   # 模式特定的技能骨架
│   └── eval_review.html    # 触发评估审查模板
├── scripts/                # Python 工具脚本
│   ├── run_eval.py         # 评估运行器（Claude Code）
│   ├── run_eval_opencode.py# 评估运行器（OpenCode/OpenClaw）
│   ├── run_loop.py         # 描述优化循环
│   ├── aggregate_benchmark.py  # 结果聚合
│   ├── package_skill.py    # 技能打包
│   ├── improve_description.py  # 描述优化
│   ├── init_workspace.py   # 工作区初始化
│   ├── quick_validate.py   # 技能结构验证
│   └── platform.py         # 平台检测工具
└── eval-viewer/            # 评估审查查看器
    ├── generate_review.py  # HTML 审查页面生成器
    └── viewer.html         # 查看器模板
```

## 技能结构

每个技能应遵循以下结构：

```
skill-name/
├── SKILL.md              # 必需：YAML frontmatter + Markdown 指令
└── 打包资源
    ├── scripts/          # 可执行代码
    ├── references/       # 按需加载的文档
    └── assets/           # 模板文件
```

关键原则：保持 SKILL.md 少于 500 行，使用三层渐进式披露加载机制。

## 工作流

```
理解意图 → 选择模式 → 编写技能 → 运行测试 → 评估 → 改进 → 重复 → 打包
```

## 许可

See [LICENSE.txt](LICENSE.txt).
