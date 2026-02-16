// ============================================================
// Dev Notes & Weather MCP Server
// This is a Model Context Protocol (MCP) server that gives
// an AI assistant two abilities:
//   1. Save, list, and read developer notes (markdown files)
//   2. Check the weather for any city
// ============================================================

// --- Imports ------------------------------------------------
// McpServer  – the main class that sets up our MCP server
// StdioServerTransport – lets the server talk over stdin/stdout
//   (this is how Claude Desktop communicates with MCP servers)
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Node built-ins we need for file I/O and paths
import fs from "fs/promises";
import path from "path";
import os from "os";

// z (Zod) is used by the MCP SDK to define & validate tool inputs
import { z } from "zod";

// --- Configuration ------------------------------------------
// All notes are stored in a "dev-notes" folder inside your home
// directory (e.g. C:\Users\you\dev-notes  or  /home/you/dev-notes)
const NOTES_DIR = path.join(os.homedir(), "dev-notes");

// Make sure the notes folder exists (creates it if it doesn't)
await fs.mkdir(NOTES_DIR, { recursive: true });

// --- Create the MCP Server ----------------------------------
const server = new McpServer({
  name: "dev-notes-server",        // shown to the AI client
  version: "1.0.0",
});

// ============================================================
// TOOL 1: save_note
// Saves a markdown note to ~/dev-notes/<title>.md
// ============================================================
server.tool(
  "save_note",                              // tool name
  "Save a markdown note to ~/dev-notes/",   // description the AI sees
  {
    // Input schema – what the AI must provide when calling this tool
    title: z.string().describe("Filename for the note (without .md)"),
    content: z.string().describe("Markdown content of the note"),
  },
  async ({ title, content }) => {
    // Build the full file path and write the note
    const filePath = path.join(NOTES_DIR, `${title}.md`);
    await fs.writeFile(filePath, content, "utf-8");

    // Return a success message to the AI
    return {
      content: [{ type: "text", text: `Note saved to ${filePath}` }],
    };
  }
);

// ============================================================
// TOOL 2: list_notes
// Lists all .md files in ~/dev-notes/
// ============================================================
server.tool(
  "list_notes",
  "List all saved notes in ~/dev-notes/",
  {},  // no inputs needed
  async () => {
    // Read the directory and keep only .md files
    const files = await fs.readdir(NOTES_DIR);
    const notes = files.filter((f) => f.endsWith(".md"));

    // If no notes exist yet, say so
    if (notes.length === 0) {
      return {
        content: [{ type: "text", text: "No notes found. Save one first!" }],
      };
    }

    // Return a numbered list of note names
    const list = notes.map((n, i) => `${i + 1}. ${n}`).join("\n");
    return {
      content: [{ type: "text", text: `Your notes:\n${list}` }],
    };
  }
);

// ============================================================
// TOOL 3: read_note
// Reads and returns the content of a specific note
// ============================================================
server.tool(
  "read_note",
  "Read the content of a saved note",
  {
    title: z.string().describe("Filename of the note (without .md)"),
  },
  async ({ title }) => {
    const filePath = path.join(NOTES_DIR, `${title}.md`);

    try {
      const content = await fs.readFile(filePath, "utf-8");
      return {
        content: [{ type: "text", text: content }],
      };
    } catch {
      // If the file doesn't exist, let the AI know
      return {
        content: [{ type: "text", text: `Note "${title}" not found.` }],
      };
    }
  }
);

// ============================================================
// TOOL 4: get_weather
// Fetches current weather from wttr.in (free, no API key needed)
// ============================================================
server.tool(
  "get_weather",
  "Get the current weather for a city",
  {
    city: z.string().describe("City name (e.g. Orlando, London)"),
  },
  async ({ city }) => {
    try {
      // wttr.in returns plain-text weather when you ask for ?format=...
      // %C = condition, %t = temperature, %h = humidity, %w = wind
      const url = `https://wttr.in/${encodeURIComponent(city)}?format=%C+%t+%h+%w`;
      const response = await fetch(url);
      const weather = await response.text();

      return {
        content: [
          { type: "text", text: `Weather in ${city}: ${weather.trim()}` },
        ],
      };
    } catch {
      return {
        content: [
          { type: "text", text: `Could not fetch weather for "${city}".` },
        ],
      };
    }
  }
);

// --- Start the server ---------------------------------------
// StdioServerTransport connects stdin/stdout so Claude Desktop
// (or any MCP client) can communicate with this server.
const transport = new StdioServerTransport();
await server.connect(transport);
