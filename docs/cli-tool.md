# CLI Tool

## Overview

The DevHub CLI brings CRM functionality to the terminal where
developers actually work. No context switching, no browser tabs—just
fast, keyboard-driven relationship management.

**Philosophy:** Developers live in the terminal. If we make it
effortless to log interactions and check follow-ups without leaving
the command line, they'll actually use it.

## Installation

```bash
# NPM (global)
npm install -g @devhub/cli

# Or use directly with npx
npx @devhub/cli

# Verify installation
devhub --version
```

## Authentication

```bash
# First time setup
devhub login

# Opens browser for OAuth
# OR paste API token manually
devhub login --token YOUR_API_TOKEN

# Check auth status
devhub whoami
```

## Core Commands

### `devhub` (Dashboard)

Show today's agenda in the terminal.

```bash
devhub

# Output:
╭─────────────────────────────────────────────────────╮
│  DevHub - Developer CRM                             │
│  Logged in as: @spences10                          │
├─────────────────────────────────────────────────────┤
│  📅 Today's Agenda                                  │
├─────────────────────────────────────────────────────┤
│  ⚠️  OVERDUE FOLLOW-UPS (2)                        │
│  → Marcus Rodriguez (3 days overdue)                │
│     "Check on team decision"                        │
│  → David Thompson (2 days overdue)                  │
│     "Schedule advanced debugging demo"              │
│                                                      │
│  📋 DUE TODAY (1)                                   │
│  → Sarah Chen                                       │
│     "Follow up on enterprise proposal"              │
│                                                      │
│  🎯 UPCOMING (next 7 days)                         │
│  → Alex Kumar (in 2 days)                           │
│  → Jessica Park (in 4 days)                         │
│                                                      │
│  🚀 GITHUB ACTIVITY (today)                        │
│  → Sarah Chen released v2.0                         │
│  → Marcus started new project "awesome-tool"        │
╰─────────────────────────────────────────────────────╯

# Shortcuts:
devhub -c    # Contacts summary
devhub -i    # Recent interactions
devhub -f    # Follow-ups only
```

### `devhub log` (Quick Logging)

Log an interaction in seconds.

```bash
# Basic: log with username/name
devhub log @sarah "discussed API design over coffee"
devhub log "Sarah Chen" "discussed API design over coffee"

# With interaction type
devhub log @sarah "quarterly sync" --type meeting
devhub log @sarah "sent pricing info" --type email

# With date (defaults to now)
devhub log @marcus "conference chat" --date "2024-10-01"
devhub log @marcus "conference chat" --date yesterday

# Multiple contacts (group interaction)
devhub log @sarah @marcus @alex "team lunch at SvelteConf"

# Pipe from stdin
echo "Caught up on Slack about deployment issues" | devhub log @sarah
```

**Examples:**

```bash
# Quick meeting note
devhub log @sarah "30min call - discussed hiring, scaling challenges, next steps"

# Email sent
devhub log @marcus "sent proposal for consulting engagement" -t email

# Conference interaction
devhub log @alex "met at SvelteConf booth, very interested in our tools" --date "Oct 1"
```

### `devhub contacts` (List & Search)

Find and view contacts.

```bash
# List all contacts
devhub contacts

# Search by name
devhub contacts sarah
devhub contacts "Sarah Chen"

# Filter by company
devhub contacts --company TechCorp

# Filter by VIP status
devhub contacts --vip

# Filter by tag/skill
devhub contacts --tag react
devhub contacts --tag rust

# Sort options
devhub contacts --sort name          # alphabetical
devhub contacts --sort recent        # recently added
devhub contacts --sort last-contact  # last contacted

# Output format
devhub contacts --json               # JSON output
devhub contacts --csv                # CSV output (for piping)

# Examples:
devhub contacts --vip --tag react    # VIP React developers
devhub contacts --company Google     # All Google contacts
```

**Output:**

```bash
$ devhub contacts --vip

VIP CONTACTS (3)
┌────────────────────────────────────────────────────┐
│  Sarah Chen                         @sarahchen     │
│  TechCorp · VP of Engineering                      │
│  Last contact: 3 days ago                          │
│  Tags: react, typescript, management               │
│  📧 sarah.chen@techcorp.io  📱 +1-555-0101       │
├────────────────────────────────────────────────────┤
│  Marcus Rodriguez                   @mrodriguez    │
│  StartupXYZ · CTO & Co-founder                     │
│  Last contact: 5 days ago                          │
│  Tags: node, postgresql, kubernetes                │
│  📧 marcus@startupxyz.com                         │
└────────────────────────────────────────────────────┘
```

### `devhub contact <name>` (View Details)

Show detailed contact info.

```bash
# View contact details
devhub contact sarah
devhub contact "Sarah Chen"
devhub contact @sarahchen

# Output options
devhub contact sarah --interactions    # include interaction history
devhub contact sarah --full            # everything
devhub contact sarah --json            # JSON format
```

**Output:**

```bash
$ devhub contact sarah --interactions

╭────────────────────────────────────────────────╮
│  Sarah Chen                                    │
│  @sarahchen                                    │
├────────────────────────────────────────────────┤
│  💼 TechCorp · VP of Engineering              │
│  📧 sarah.chen@techcorp.io                    │
│  📱 +1-555-0101                               │
│  🎂 March 15                                  │
│  🌟 VIP Contact                               │
├────────────────────────────────────────────────┤
│  🔗 Links                                     │
│  GitHub: github.com/sarahchen                 │
│  LinkedIn: linkedin.com/in/sarahchen          │
│  Twitter: twitter.com/sarahchen               │
├────────────────────────────────────────────────┤
│  📝 Notes                                     │
│  Met at SvelteConf 2024. Very interested in   │
│  our developer tools. Key decision maker.     │
├────────────────────────────────────────────────┤
│  📊 Stats                                     │
│  4 interactions · 1 pending follow-up         │
│  Last contact: 3 days ago                     │
├────────────────────────────────────────────────┤
│  📜 Recent Interactions                       │
│  Oct 2  Meeting  Technical deep dive          │
│  Jul 15 Email    Sent pricing proposal        │
│  May 10 Call     Follow-up after conference   │
│  Mar 1  Meeting  Initial meeting at SvelteConf│
╰────────────────────────────────────────────────╯
```

### `devhub add` (Create Contact)

Add a contact from the command line.

```bash
# Interactive mode
devhub add

# Quick add with name
devhub add "Jane Doe"

# Add from GitHub (auto-import)
devhub add --github janedoe

# Full details inline
devhub add "Jane Doe" \
  --email jane@example.com \
  --company "Acme Corp" \
  --github janedoe \
  --vip

# From vCard/CSV
devhub add --from contacts.vcf
devhub add --from conference-leads.csv
```

### `devhub follow-up` (Create Follow-up)

Schedule follow-ups.

```bash
# Quick follow-up
devhub follow-up @sarah "send proposal"

# With due date
devhub follow-up @sarah "send proposal" --due "next week"
devhub follow-up @sarah "check in" --due "Oct 15"
devhub follow-up @sarah "quarterly sync" --due "+30d"

# Relative dates
devhub follow-up @marcus "follow up on demo" --due tomorrow
devhub follow-up @alex "check progress" --due "next monday"

# Bulk follow-ups (conference workflow)
devhub follow-up --tag "svelteconf-2024" "send nice-to-meet-you email" --due "+2d"
```

### `devhub due` (Follow-up Management)

View and manage follow-ups.

```bash
# Show all pending
devhub due

# Show overdue only
devhub due --overdue

# Show upcoming
devhub due --upcoming

# Complete a follow-up
devhub due complete 123
devhub due done @sarah

# Snooze (reschedule)
devhub due snooze @sarah --until "next week"
```

**Output:**

```bash
$ devhub due

⚠️  OVERDUE (2)
┌─────────────────────────────────────────────────┐
│  Marcus Rodriguez (3 days overdue)              │
│  "Check on team decision"                       │
│  Created: 5 days ago                            │
│  [c]omplete [s]nooze [v]iew                    │
├─────────────────────────────────────────────────┤
│  David Thompson (2 days overdue)                │
│  "Schedule advanced debugging demo"             │
│  Created: 17 days ago                           │
│  [c]omplete [s]nooze [v]iew                    │
└─────────────────────────────────────────────────┘

📅 DUE TODAY (1)
┌─────────────────────────────────────────────────┐
│  Sarah Chen                                     │
│  "Follow up on enterprise proposal"             │
│  [c]omplete [s]nooze [v]iew                    │
└─────────────────────────────────────────────────┘

🎯 UPCOMING (3)
│  Oct 7  Alex Kumar     "Share security docs"   │
│  Oct 9  Jessica Park   "Send Storybook pricing"│
│  Oct 11 Priya Sharma   "ML deployment follow-up"│
```

### `devhub find` (Advanced Search)

Powerful search across all data.

```bash
# Search contacts by skill
devhub find rust
devhub find "typescript react"

# Search by company
devhub find --company google
devhub find @company:stripe

# Search interactions
devhub find --in interactions "API design"

# Combined filters
devhub find react --vip --company "Meta"

# Recent activity
devhub find --active "last 30 days"
devhub find --inactive "90+ days"
```

### `devhub stats` (Analytics)

View CRM statistics.

```bash
# Overall stats
devhub stats

# Specific metrics
devhub stats --contacts      # contact breakdown
devhub stats --activity      # interaction trends
devhub stats --network       # network insights
```

**Output:**

```bash
$ devhub stats

╭────────────────────────────────────────╮
│  DevHub Statistics                     │
├────────────────────────────────────────┤
│  📇 Contacts                           │
│  Total: 17 (3 VIP)                     │
│  Added this month: 5                   │
│  Active (< 30d): 12                    │
│  Going cold (> 90d): 2                 │
├────────────────────────────────────────┤
│  💬 Interactions                       │
│  Total: 32                             │
│  This week: 4                          │
│  This month: 12                        │
│  Types: 11 meetings, 11 calls, 9 emails│
├────────────────────────────────────────┤
│  ✅ Follow-ups                         │
│  Pending: 11                           │
│  Overdue: 2  ⚠️                       │
│  Completed this month: 7               │
├────────────────────────────────────────┤
│  🏆 Top Contacts (by interactions)    │
│  1. Marcus Rodriguez (4)               │
│  2. Sarah Chen (3)                     │
│  3. Alex Kumar (3)                     │
╰────────────────────────────────────────╯
```

### `devhub sync` (GitHub Sync)

Manually trigger GitHub sync.

```bash
# Sync all contacts
devhub sync

# Sync specific contact
devhub sync @sarah

# Check for GitHub activity
devhub sync --check

# Force refresh (ignore cache)
devhub sync --force
```

## Advanced Features

### Aliases

Create shortcuts for common commands.

```bash
# Set alias
devhub alias l "log"
devhub alias m "log --type meeting"
devhub alias c "contacts --vip"

# Use alias
devhub m @sarah "quarterly check-in"
```

### Configuration

```bash
# View config
devhub config

# Set preferences
devhub config set default-follow-up-days 7
devhub config set interaction-type meeting
devhub config set output-format table

# Config file location
~/.devhub/config.json
```

### Shell Completion

```bash
# Bash
devhub completion bash >> ~/.bashrc

# Zsh
devhub completion zsh >> ~/.zshrc

# Fish
devhub completion fish > ~/.config/fish/completions/devhub.fish
```

### Scripting & Pipes

```bash
# Export contacts to CSV, filter with tools
devhub contacts --json | jq '.[] | select(.company == "Google")'

# Bulk operations
cat conference-notes.txt | while read line; do
  devhub log @speaker "$line"
done

# Integration with other tools
devhub contacts --vip --json | \
  jq -r '.[].email' | \
  xargs -I {} echo "To: {}" >> email-list.txt

# Automated follow-ups
devhub due --overdue --json | \
  jq -r '.[] | "Reminder: \(.note) for \(.contact_name)"' | \
  notify-send
```

## Interactive Mode

```bash
# Launch interactive TUI
devhub interactive

# Or just
devhub -i
```

**Features:**

- Navigate with arrow keys
- Fuzzy search contacts
- Quick actions (log, follow-up, view)
- Vim-style keybindings

## Implementation Details

### Tech Stack

```typescript
// CLI Framework
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';

// API Client
import axios from 'axios';
```

### Project Structure

```
packages/cli/
├── src/
│   ├── commands/
│   │   ├── log.ts
│   │   ├── contacts.ts
│   │   ├── due.ts
│   │   ├── sync.ts
│   │   └── ...
│   ├── lib/
│   │   ├── api.ts          # API client
│   │   ├── auth.ts         # Authentication
│   │   ├── config.ts       # Config management
│   │   ├── formatter.ts    # Output formatting
│   │   └── utils.ts
│   ├── ui/
│   │   ├── tables.ts       # Table rendering
│   │   ├── prompts.ts      # Interactive prompts
│   │   └── colors.ts       # Color schemes
│   └── index.ts            # Entry point
├── package.json
└── tsconfig.json
```

### API Client

```typescript
// lib/api.ts
import axios from 'axios';
import { getConfig } from './config';

export class DevHubAPI {
	private baseURL: string;
	private token: string;

	constructor() {
		const config = getConfig();
		this.baseURL = config.apiURL || 'https://api.devhub.app';
		this.token = config.token;
	}

	async logInteraction(data: {
		contact: string;
		note: string;
		type?: string;
		date?: string;
	}) {
		// Resolve contact (by username, name, or ID)
		const contact = await this.findContact(data.contact);

		return axios.post(
			`${this.baseURL}/interactions`,
			{
				contact_id: contact.id,
				type: data.type || 'message',
				note: data.note,
				created_at: data.date
					? new Date(data.date).getTime()
					: Date.now(),
			},
			{
				headers: { Authorization: `Bearer ${this.token}` },
			},
		);
	}

	async findContact(query: string) {
		// Try @username first
		if (query.startsWith('@')) {
			const username = query.slice(1);
			const res = await axios.get(`${this.baseURL}/contacts`, {
				params: { github_username: username },
				headers: { Authorization: `Bearer ${this.token}` },
			});
			if (res.data.length > 0) return res.data[0];
		}

		// Search by name
		const res = await axios.get(`${this.baseURL}/contacts/search`, {
			params: { q: query },
			headers: { Authorization: `Bearer ${this.token}` },
		});

		if (res.data.length === 0) {
			throw new Error(`Contact not found: ${query}`);
		}

		if (res.data.length === 1) {
			return res.data[0];
		}

		// Multiple matches, prompt user
		return this.promptContactSelection(res.data);
	}
}
```

## Pricing

CLI tool is **free for all users**.

Why? Because it drives engagement and makes the CRM sticky. Users who
use the CLI daily are more likely to upgrade for premium features (AI
agents, unlimited GitHub sync, etc.).

## Success Metrics

**Adoption:**

- 60% of active users install CLI
- 40% use CLI weekly
- Average 10+ commands per week

**Retention:**

- CLI users churn 50% less than web-only
- CLI users upgrade 2x more often

**Power Users:**

- Top 10% run 50+ commands per week
- Scripting & automation use cases
