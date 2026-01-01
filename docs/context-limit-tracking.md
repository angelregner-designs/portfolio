# Context Limit Tracking

This document tracks instances of hitting context limits when working with large data and how they were resolved.

## Issue 1: Figma Metadata Too Large
- **Tool:** `mcp__figma__get_metadata`
- **Node:** 395:4442 (full portfolio tablet design)
- **Result:** 132,924 characters exceeded maximum allowed tokens
- **Solution:**
  1. Metadata was saved to temp file by the tool
  2. Read file in chunks using shell commands (`head -c 8000`)
  3. Used `get_screenshot` to get visual context of full page
  4. Fetched individual section designs using `get_design_context` for specific node IDs

## Strategy for Tablet Breakpoint Implementation
1. Get full page screenshot first for visual overview
2. Fetch Figma design context for each section individually (by node ID)
3. Apply tablet styles incrementally to each component
4. Use smaller, focused requests instead of fetching entire page design at once

## Key Takeaways
- For large Figma designs, request screenshots first for visual context
- Break down large designs into individual sections/components
- Use node IDs from metadata to fetch specific sections
- Rely on visual screenshots when detailed code context exceeds limits
