# MCP Library

[![MCP Servers](https://img.shields.io/badge/MCP-Servers-blue.svg)](https://github.com/modelcontextprotocol/servers)

A collection of Model Context Protocol (MCP) servers for various integrations and tools.

## 📚 Overview

This library serves as a centralized collection of MCP (Model Context Protocol) servers that can be used with Claude Desktop and other MCP-compatible applications. Each server provides specific functionality through well-defined tool interfaces.

## 🎯 Philosophy

- **Modular Design**: Each server is self-contained and focused on specific functionality
- **Optimized Integration**: Servers are designed to minimize Claude Desktop authorization prompts
- **Extensible**: Easy to add new MCP servers for different services and tools

## 📦 Available Servers

### 🐙 GitHub MCP Server
**Location:** `./github-mcp/`  
**Purpose:** Complete GitHub automation and management

**Features:**
- Repository operations (create, list, analyze)
- Issue and PR management
- User and organization data
- Batch operations to reduce API calls
- Optimized tool grouping for Claude Desktop

**[📖 View GitHub Server Documentation →](./github-mcp/README.md)**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Claude Desktop application
- Relevant API tokens (GitHub, etc.)

### Quick Setup
1. Navigate to the desired server directory
2. Follow the server-specific setup instructions
3. Configure Claude Desktop to use the server

### Example: GitHub MCP Server
```bash
cd github-mcp/
npm install
cp .env.example .env
# Edit .env with your GitHub token
npm start
```

## 🎯 Claude Desktop Integration

Each MCP server in this library is designed to work seamlessly with Claude Desktop. Once configured, you can use natural language commands like:

- "Show me my GitHub dashboard"
- "Create a new repository for my project"
- "Analyze the activity in my top repositories"

## 🛠️ Development

### Adding a New MCP Server

1. Create a new directory for your server
2. Implement the MCP protocol using the SDK
3. Follow the established patterns for tool organization
4. Include comprehensive documentation
5. Add configuration examples

### Best Practices
- Group related tools to minimize authorization prompts
- Implement robust error handling
- Provide clear tool descriptions
- Include usage examples in documentation

## 📁 Repository Structure

```
mcp-library/
├── README.md                 # This overview document
├── github-mcp/              # GitHub MCP Server
│   ├── src/                 # Server implementation
│   ├── scripts/             # Utility scripts
│   ├── README.md           # Server documentation
│   └── package.json        # Dependencies and scripts
└── [future-servers]/        # Additional MCP servers
    ├── src/
    ├── README.md
    └── package.json
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Follow the established server structure
2. Include comprehensive documentation
3. Test with Claude Desktop
4. Ensure proper error handling

## 📄 License

See individual server directories for specific license information.

## 🔗 Links

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP SDK Repository](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop](https://claude.ai/docs)
