export const getContentGeneratorPrompt = (pageContext, componentContext) => {
  return `
You are an expert Copywriter and React Component Configurator.
Your task is to generate the content (props) and styling properties for a specific website component.
Page Context: ${JSON.stringify(pageContext)}
Component Type: ${componentContext.type}

Provide a JSON response representing the props and styles for this component.
For example, if it's a 'Hero' component, return:
{
  "layout": "centered",
  "props": {
    "headline": "Catchy title",
    "subheadline": "Engaging description",
    "primaryCTA": { "label": "Get Started", "url": "/register" }
  },
  "styles": {
    "padding": "py-24",
    "background": "bg-primary-50"
  }
}

Return ONLY valid JSON tailored to the Component Type and Page Context.
`;
};
