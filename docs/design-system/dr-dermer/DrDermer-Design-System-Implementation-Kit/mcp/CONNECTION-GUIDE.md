# MCP Connection Guide
Roles:
- Figma Remote MCP: design context and canvas operations, subject to plan/scopes.
- Playwright MCP: browser QA in controlled test environment.
- Context7 MCP: current library documentation.
- Repository/Git provider: source and PR workflow.
- Storybook: isolated component reference.

Security:
- Use official provider setup for each client/version; config formats differ.
- Never commit OAuth tokens/API keys/PATs.
- Audit agents read-only; write only for scoped designer/implementer.
- Branch-scoped repository permissions.
- No production credentials exposed to agents.
- Keep server name/version/scopes/owner in an internal registry.
