# Tool-Specific Rules

## Storybook
- Do not define `title` property, let Storybook infer

## MCP Servers
- Always use Context7 for code generation, setup/config steps, or library/API docs
- Automatically use Context7 MCP tools to resolve library ID and get docs without explicit request

## Figma
- Use Figma MCP tools to get design context without explicit request
- Document all instances of hitting context limit and how you dealt with it in a tmp folder

### Figma MCP Token Limits
- Always get screenshot first before full design context
- Target specific child nodes, never large parent containers
- If output saved to disk due to size: use grep for specific properties (padding, gap, fontSize, etc.)
- Never retry the same failing request with same parameters
- If limits persist, ask user for specific node-ids or manual values
