import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const archiver = require('archiver');

const getPackageJson = (projectName) => {
  return JSON.stringify({
    name: projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "lucide-react": "^0.292.0"
    },
    devDependencies: {
      "@types/react": "^18.2.37",
      "@types/react-dom": "^18.2.15",
      "@vitejs/plugin-react": "^4.2.0",
      "autoprefixer": "^10.4.16",
      "postcss": "^8.4.31",
      "tailwindcss": "^3.3.5",
      "vite": "^5.0.0"
    }
  }, null, 2);
};

const getViteConfig = () => {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`;
};

const getIndexHtml = (projectName) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
};

const getTailwindConfig = (branding) => {
  const colors = branding?.colors || {};
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '${colors.primary || "#3b82f6"}',
        secondary: '${colors.secondary || "#10b981"}',
        accent: '${colors.accent || "#f59e0b"}',
        background: '${colors.background || "#ffffff"}',
        text: '${colors.text || "#1f2937"}'
      }
    },
  },
  plugins: [],
}`;
};

const getPostcssConfig = () => {
  return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
};

const getIndexCss = () => {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-background text-text;
  }
}
`;
};

const getMainJsx = () => {
  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;
};

const getAppJsx = (pages, componentsByPage) => {
  const homePage = pages.find(p => p.isHomePage) || pages[0];
  if (!homePage) {
    return `export default function App() { return <div>No pages found</div> }`;
  }
  
  const pageComponents = componentsByPage[homePage._id.toString()] || [];
  
  return `import React from 'react';
import { Mail, Phone, MapPin, Search, Menu, X, ArrowRight, CheckCircle, Star, Quote, ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Linkedin, Shield, Camera, Lock, Eye, MonitorPlay } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen">
      {/* Generated layout for ${homePage.title} */}
      ${pageComponents.length === 0 ? '<div className="p-8 text-center">Empty Page</div>' : ''}
      ${pageComponents.map(comp => renderComponentFallback(comp)).join('\n      ')}
    </div>
  );
}`;
};

// In a real sophisticated exporter, we would map `comp.type` to a real React Component template file
// and inject the props dynamically. For this prototype, we'll output placeholder divs indicating the component.
const renderComponentFallback = (comp) => {
  const propsJson = JSON.stringify(comp.props || {}, null, 2).replace(/\n/g, '\n        ');
  return `<section className="py-20 border-b border-gray-200" id="${comp.type.toLowerCase()}">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 capitalize">{/* Component: ${comp.type} */}</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto text-black">
            <code>
{/* PROPS DATA: 
${propsJson}
*/}
            </code>
          </pre>
          <div className="mt-4 p-8 bg-primary/10 rounded-lg text-primary text-center font-semibold">
            {/* Replace this placeholder with actual ${comp.type} component logic */}
            ${comp.type} Component Placeholder
          </div>
        </div>
      </section>`;
};

export const generateProjectZip = async (project, pages, components, res) => {
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_export.zip"`);
  
  archive.on('error', function(err) {
    throw err;
  });

  // Pipe archive data to the response
  archive.pipe(res);

  // Group components by page
  const componentsByPage = {};
  components.forEach(comp => {
    const pId = comp.page.toString();
    if (!componentsByPage[pId]) componentsByPage[pId] = [];
    componentsByPage[pId].push(comp);
  });

  // Add standard files
  archive.append(getPackageJson(project.name), { name: 'package.json' });
  archive.append(getViteConfig(), { name: 'vite.config.js' });
  archive.append(getIndexHtml(project.name), { name: 'index.html' });
  archive.append(getTailwindConfig(project.branding), { name: 'tailwind.config.js' });
  archive.append(getPostcssConfig(), { name: 'postcss.config.js' });
  
  // Add src files
  archive.append(getIndexCss(), { name: 'src/index.css' });
  archive.append(getMainJsx(), { name: 'src/main.jsx' });
  archive.append(getAppJsx(pages, componentsByPage), { name: 'src/App.jsx' });

  // Finalize the archive (ie we are done appending files but streams have to finish yet)
  await archive.finalize();
};
