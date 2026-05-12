# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when when working with code in this repository.

## Project Overview

**or-skill-crafter** is a cross-platform skill creation and iteration tool for AI assistants (Claude Code, OpenCode, OpenClaw). It helps write, test, evaluate, and improve agent skills using a structured workflow based on five core design patterns: Tool Wrapper, Generator, Reviewer, Inversion, and Pipeline (composable as Composite).

## Core Workflow

```
Understand intent -> Choose pattern -> Write skill -> Run tests -> Evaluate -> Improve -> Repeat -> Package
```

## Directory Structure

```
or-skill-crafter/
├── SKILL.md                # Main skill definition (this IS the skill-crafter skill)
├── agents/                 # Evaluation agent definitions
│   ├── grader.md           # How to grade assertions (includes pattern compliance)
│   ├── comparator.md       # Blind A/B comparison agent
│   └── analyzer.md         # Benchmark result analysis
├── references/             # Pattern docs and schemas
│   ├── adk-patterns.md     # Design pattern guide with examples + decision tree
│   ├── review-checklist.md # Review checklist for skills
│   ├── schemas.md          # JSON structure specifications
│   └── pattern-examples/   # Complete runnable examples per pattern
├── assets/                 # Templates
│   ├── skill-template.md   # Pattern-specific skill skeleton
│   └── eval_review.html    # HTML template for trigger evaluation review
├── scripts/                # Python utilities
│   ├── run_eval.py         # Run evaluation with claude -p (Claude Code)
│   ├── run_eval_opencode.py# Run evaluation via Task tool (OpenCode/OpenClaw)
│   ├── run_loop.py         # Description optimization loop
│   ├── aggregate_benchmark.py  # Aggregate eval results
│   ├── package_skill.py    # Package skill for distribution
│   ├── improve_description.py  # Auto-improve skill description
│   ├── init_workspace.py   # Initialize evaluation workspace
│   ├── quick_validate.py   # Quick validation of skill structure
│   └── platform.py         # Platform detection utilities
└── eval-viewer/            # Benchmark review tool
    ├── generate_review.py  # Generate HTML review page
    └── viewer.html         # Review UI template
```

## Key Commands

### Skill Development
- **Create/init workspace**: `python -m scripts.init_workspace <workspace-dir>`
- **Quick validate skill structure**: `python -m scripts.quick_validate <skill-path>`
- **Package skill**: `python -m scripts.package_skill <skill-path>`

### Evaluation
- **Run evals (Claude Code)**: Use `scripts/run_eval.py` with `claude -p` subprocess
- **Run evals (OpenCode/OpenClaw)**: Use `scripts/run_eval_opencode.py` with Task tool
- **Aggregate results**: `python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>`
- **Launch review viewer**: `python eval-viewer/generate_review.py <workspace>/iteration-N --skill-name <name>`
- **Static HTML output**: `python eval-viewer/generate_review.py <workspace> --skill-name <name> --static <output.html>`

### Description Optimization (Claude Code only)
- **Run optimization loop**: `python -m scripts.run_loop --eval-set <trigger-eval.json> --skill-path <path> --model <id> --max-iterations 5 --verbose`

## Architecture Notes

### Progressive Disclosure (3-layer loading)
1. **Metadata** (name + description) — always in context for trigger matching
2. **SKILL.md body** — loaded when skill triggers (< 500 lines)
3. **Bundled resources** — loaded on demand from references/assets/scripts

### Pattern System
Skills declare their design pattern in `metadata.pattern`. The five patterns and their key characteristics:

| Pattern | Must Include |
|---------|-------------|
| tool-wrapper | External `references/` files, dynamic load instructions |
| generator | `assets/template.md`, template fill-in steps |
| reviewer | `references/checklist.md`, severity grouping |
| inversion | "DO NOT proceed until..." gates, sequential questioning |
| pipeline | Numbered steps, hard checkpoints (`**[硬性检查点]**`) |
| composite | Components declared in metadata |

### Evaluation Structure
- Evals live in `evals/evals.json` with prompts, expected outputs, and assertions
- Each iteration creates `iteration-N/` directories with `with_skill/` and `without_skill/` runs
- Timing data saved per run; results aggregated into benchmarks
- `agents/grader.md` defines how assertions are graded, including pattern compliance checks

### Platform Detection
The skill auto-detects the host platform (Claude Code / OpenCode / OpenClaw) and adjusts behavior — use `scripts/platform.py` for detection logic.
