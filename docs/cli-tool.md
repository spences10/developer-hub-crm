# CLI Tool

## Overview

Devhub CLI brings CRM functionality to the terminal. No context
switching, no browser tabs - fast, keyboard-driven relationship
management.

**Philosophy:** Developers live in the terminal. Make it effortless to
log interactions and check follow-ups without leaving the command
line.

## Installation

```bash
npm install -g @devhub/cli
# Or: npx @devhub/cli
devhub --version
```

## Authentication

```bash
devhub login              # Opens browser for OAuth
devhub login --token YOUR_API_TOKEN   # Or paste token
devhub whoami             # Check auth status
```

## Core Commands

### `devhub` (Dashboard)

Show today's agenda in terminal.

```bash
devhub
devhub -c    # Contacts summary
devhub -i    # Recent interactions
devhub -f    # Follow-ups only
```

Shows: Overdue follow-ups, due today, upcoming (next 7 days), GitHub
activity (today)

### `devhub log` (Quick Logging)

Log an interaction in seconds.

```bash
devhub log @sarah "discussed API design over coffee"
devhub log "Sarah Chen" "discussed API design over coffee"
devhub log @sarah "quarterly sync" --type meeting
devhub log @marcus "conference chat" --date "2024-10-01"
devhub log @sarah @marcus @alex "team lunch at SvelteConf"

# Pipe from stdin
echo "Caught up on Slack" | devhub log @sarah
```

### `devhub contacts` (List & Search)

Find and view contacts.

```bash
devhub contacts                    # List all
devhub contacts sarah              # Search by name
devhub contacts --company TechCorp # Filter by company
devhub contacts --vip              # Filter by VIP
devhub contacts --tag react        # Filter by tag
devhub contacts --sort recent      # Sort: name, recent, last-contact
devhub contacts --json             # JSON output
devhub contacts --csv              # CSV output
```

### `devhub contact <name>` (View Details)

Show detailed contact info.

```bash
devhub contact sarah
devhub contact @sarahchen
devhub contact sarah --interactions   # Include interaction history
devhub contact sarah --full           # Everything
devhub contact sarah --json           # JSON format
```

### `devhub add` (Create Contact)

Add a contact from command line.

```bash
devhub add                         # Interactive mode
devhub add "Jane Doe"              # Quick add
devhub add --github janedoe        # Add from GitHub (auto-import)
devhub add "Jane Doe" --email jane@example.com --company "Acme Corp" --vip
devhub add --from contacts.vcf     # From vCard/CSV
```

### `devhub follow-up` (Create Follow-up)

Schedule follow-ups.

```bash
devhub follow-up @sarah "send proposal"
devhub follow-up @sarah "send proposal" --due "next week"
devhub follow-up @sarah "check in" --due "Oct 15"
devhub follow-up @marcus "follow up on demo" --due tomorrow
devhub follow-up --tag "svelteconf-2024" "send nice-to-meet-you email" --due "+2d"
```

### `devhub due` (Follow-up Management)

View and manage follow-ups.

```bash
devhub due                  # Show all pending
devhub due --overdue        # Show overdue only
devhub due --upcoming       # Show upcoming
devhub due complete 123     # Complete a follow-up
devhub due done @sarah
devhub due snooze @sarah --until "next week"
```

Shows: Overdue (with days), due today, upcoming

### `devhub find` (Advanced Search)

Search across all data.

```bash
devhub find rust                          # Search by skill
devhub find "typescript react"
devhub find --company google
devhub find --in interactions "API design"
devhub find react --vip --company "Meta"
devhub find --active "last 30 days"
devhub find --inactive "90+ days"
```

### `devhub stats` (Analytics)

View CRM statistics.

```bash
devhub stats                # Overall stats
devhub stats --contacts     # Contact breakdown
devhub stats --activity     # Interaction trends
devhub stats --network      # Network insights
```

Shows: Total contacts, VIP count, interactions (week/month/types),
follow-ups (pending/overdue/completed), top contacts

### `devhub sync` (GitHub Sync)

Manually trigger GitHub sync.

```bash
devhub sync              # Sync all contacts
devhub sync @sarah       # Sync specific contact
devhub sync --check      # Check for GitHub activity
devhub sync --force      # Force refresh (ignore cache)
```

## Advanced Features

**Aliases:**

```bash
devhub alias l "log"
devhub alias m "log --type meeting"
devhub m @sarah "quarterly check-in"
```

**Configuration:**

```bash
devhub config                                  # View config
devhub config set default-follow-up-days 7
devhub config set interaction-type meeting
# Config file: ~/.devhub/config.json
```

**Shell Completion:**

```bash
devhub completion bash >> ~/.bashrc   # Bash
devhub completion zsh >> ~/.zshrc     # Zsh
devhub completion fish > ~/.config/fish/completions/devhub.fish
```

**Scripting & Pipes:**

```bash
# Export contacts, filter with jq
devhub contacts --json | jq '.[] | select(.company == "Google")'

# Bulk operations
cat conference-notes.txt | while read line; do
  devhub log @speaker "$line"
done

# Integration with other tools
devhub contacts --vip --json | jq -r '.[].email' | xargs -I {} echo "To: {}" >> email-list.txt

# Automated follow-up reminders
devhub due --overdue --json | jq -r '.[] | "Reminder: \(.note) for \(.contact_name)"' | notify-send
```

**Interactive Mode:**

```bash
devhub interactive    # Launch interactive TUI
devhub -i

# Features: Navigate with arrow keys, fuzzy search, quick actions, vim-style keybindings
```

## Implementation

**Tech Stack:** Clack, Chalk, Ora

**Project Structure:**

```
packages/cli/
├── src/
│   ├── commands/        # log.ts, contacts.ts, due.ts, sync.ts
│   ├── lib/
│   │   ├── api.ts       # API client
│   │   ├── auth.ts      # Authentication
│   │   ├── config.ts    # Config management
│   │   ├── formatter.ts # Output formatting
│   │   └── utils.ts
│   ├── ui/
│   │   ├── tables.ts    # Table rendering
│   │   ├── prompts.ts   # Interactive prompts
│   │   └── colors.ts    # Color schemes
│   └── index.ts
```

**API Client:**

- Resolve contacts by @username, name, or ID
- Same REST endpoints as web UI
- JWT auth header
- Prompt user for disambiguation if multiple matches

**Distribution:** NPM package `@devhub/cli`

## Pricing

CLI tool is **free for all users**.

Why? Drives engagement, makes CRM sticky. CLI users churn 50% less,
upgrade 2x more often.

## Success Metrics

**Adoption:**

- 60% of active users install CLI
- 40% use CLI weekly
- Average 10+ commands per week

**Retention:**

- CLI users churn 50% less than web-only
- CLI users upgrade 2x more often

**Power users:**

- Top 10% run 50+ commands per week
- Scripting & automation use cases
