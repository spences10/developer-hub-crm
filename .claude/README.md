# Claude Skills for devhub-crm

Project-specific skills for the devhub-crm application.

## What's in This Directory

### Skills (`skills/`)
- **database-patterns** - SQLite operations with better-sqlite3 for devhub-crm schema
  - Prepared statements, transactions, user-scoped queries
  - Contact, company, interaction, tag, follow-up, and social link tables

### Documentation (`docs/`)
Reference documentation for understanding and creating skills:
- **SKILLS-ARCHITECTURE.md** - How the 3-level progressive disclosure system works
- **SKILL-DEVELOPMENT.md** - 6-step workflow for creating effective skills
- **SKILL-EXAMPLES.md** - Real-world examples and patterns from Anthropic

### Configuration (`settings.local.json`)
Local Claude Code settings and preferences.

---

## Creating New Skills

Use the [claude-skills-cli](https://github.com/spences10/claude-skills-cli) tool to create, validate, and package skills:

```bash
# Initialize a new skill
pnpx claude-skills-cli init --name my-skill --description "What it does and when to use it"

# Validate the skill
pnpx claude-skills-cli validate .claude/skills/my-skill

# Package for distribution
pnpx claude-skills-cli package .claude/skills/my-skill
```

**Note:** The CLI tool is maintained separately and can be used across any project. The Python scripts have been replaced with a TypeScript CLI for better portability.

---

## Skill Development Workflow

1. **Understand** - Gather 3-5 concrete examples of skill usage
2. **Plan** - Identify what goes in SKILL.md vs references/ vs scripts/
3. **Initialize** - Run `pnpx claude-skills-cli init`
4. **Edit** - Write SKILL.md with imperative voice, add references
5. **Validate** - Run `pnpx claude-skills-cli validate`
6. **Test** - Use skill in real conversations, iterate
7. **Package** - Run `pnpx claude-skills-cli package` for distribution

---

## Skills Architecture (Quick Reference)

Skills use **progressive disclosure** - a three-level loading system:

### Level 1: Metadata (~100 tokens)
**Always loaded**
```yaml
name: skill-name
description: What it does and when to use it
```

### Level 2: Instructions (<5k tokens)
**Loaded when triggered**
- SKILL.md body with core patterns
- Links to references and scripts

### Level 3: Resources (unlimited)
**Loaded as needed**
- `references/` - Detailed documentation
- `scripts/` - Executable code
- `assets/` - Templates and resources

For complete details, see [SKILLS-ARCHITECTURE.md](docs/SKILLS-ARCHITECTURE.md).

---

## Best Practices

### Do:
✅ Use imperative voice ("Use X" not "You should use X")
✅ Include "when to use" keywords in description
✅ Keep SKILL.md under 5k words
✅ Move detailed content to references/
✅ Use scripts for repeated code
✅ Test on real tasks

### Don't:
❌ Use second person ("you")
❌ Create generic descriptions
❌ Duplicate content across files
❌ Leave TODO placeholders
❌ Skip validation before packaging

---

## Planned Skills for devhub-crm

Future skills to create:
- **sveltekit-patterns** - SvelteKit routing, server functions, form actions
- **github-integration** - GitHub API patterns, OAuth, rate limiting
- **daisyui-conventions** - DaisyUI v5 component styling and theming

---

## Resources

- [SKILLS-ARCHITECTURE.md](docs/SKILLS-ARCHITECTURE.md) - System design and token economics
- [SKILL-DEVELOPMENT.md](docs/SKILL-DEVELOPMENT.md) - Complete creation workflow
- [SKILL-EXAMPLES.md](docs/SKILL-EXAMPLES.md) - Real examples with analysis
- [claude-skills-cli](https://github.com/spences10/claude-skills-cli) - CLI tool for managing skills
- [Anthropic Skills Repo](https://github.com/anthropics/skills) - Official examples
- [Claude Cookbooks](https://github.com/anthropics/claude-cookbooks/tree/main/skills) - Practical guides

---

## Contributing

When creating new skills for devhub-crm:

1. Use real examples from the codebase (not invented)
2. Follow the 6-step process documented in SKILL-DEVELOPMENT.md
3. Validate with `pnpx claude-skills-cli validate` before committing
4. Test in actual Claude Code conversations
5. Document what works and what doesn't

---

**Questions?** See [SKILL-DEVELOPMENT.md](docs/SKILL-DEVELOPMENT.md) for the complete guide.
