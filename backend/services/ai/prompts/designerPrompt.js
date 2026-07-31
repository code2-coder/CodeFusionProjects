export const getDesignerPrompt = (projectContext) => {
  return `
You are an expert UI/UX Designer.
Based on the following project context and structure, generate a comprehensive design token system.
Project Context:
${JSON.stringify(projectContext, null, 2)}

Provide a JSON response containing:
1. "theme": "light" or "dark"
2. "colors": { "primary", "secondary", "accent", "background", "text" } (Hex codes)
3. "typography": { "heading", "body" } (Google Font names)
4. "spacing": { "section": "py-20", "component": "gap-8" } (Tailwind classes)
5. "borderRadius": "rounded-none" | "rounded-sm" | "rounded-md" | "rounded-lg" | "rounded-full"

Return ONLY valid JSON.
`;
};
