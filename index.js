#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import { exec } from "child_process";
import { stderr, stdout } from "process";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.join(process.cwd(), "src");
const foldersToCreate = ["Layout", "Components", "Pages"];

const layoutWithoutRouter = `
  import React from 'react';

  const Layout = () => {
    return (
      <div>
        {/* Add your layout structure here */}
      </div>
    );
  };

  export default Layout;
`;

const layoutWithRouter = `
  import React from 'react';
  import {Outlet} from 'react-router-dom';

  const Layout = () => {
    return (
      <div>
        {/* Add your layout structure here */}
        <Outlet/>
      </div>
    );
  };

  export default Layout;
`;

const mainFile = `
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout/Layout.jsx'



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>} >
    {/* Make your page routes here */}
     
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
 
    <RouterProvider router={router} />
)

`;

if (!fs.existsSync(srcPath)) {
  console.error(
    "❌ Couldn't find 'src' folder. Make sure you're in the root of a Vite project."
  );
  process.exit(1);
}

foldersToCreate.forEach((folder) => {
  const folderPath = path.join(srcPath, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`✅ Created ${folder}/`);
  }
});

function writeLayoutFile(useRouter) {
  const layoutFilePath = path.join(srcPath, "Layout", "Layout.jsx");
  if (!fs.existsSync(layoutFilePath)) {
    const layoutContent = useRouter ? layoutWithRouter : layoutWithoutRouter;
    fs.writeFileSync(layoutFilePath, layoutContent.trim());
    if(useRouter){
    console.log(`✅ Added Routing in Layout.jsx`);
    }
    else{
      console.log(`✅ Basic layout set up in Layout.jsx.`);
    }
  }
}

function writeMainFileIfRouterSelected(useRouter) {
  const mainFilePath = path.join(srcPath, "main.jsx");
  if (useRouter) {
    fs.writeFileSync(mainFilePath, mainFile.trim());
    console.log(`✅ Created main.jsx with router setup`);
  } else if (useRouter) {
    console.log(`⚠️ Skipped main.jsx – already exists`);
  }
}

function installTailwind() {
  const spinner = ora("Setting up Tailwind CSS...").start();

  exec(
    `npm install -D tailwindcss@3 postcss autoprefixer && npx tailwindcss init -p`,
    (error, stdout, stderr) => {
      if (error) {
        spinner.fail(`❌ Tailwind setup failed: ${error.message}`);
        return;
      }

      const tailwindContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;
    `.trim();

      const indexCssPath = path.join(srcPath, "index.css");

      if (fs.existsSync(indexCssPath)) {
        fs.writeFileSync(indexCssPath, tailwindContent);
      }

      const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.js");

      if (fs.existsSync(tailwindConfigPath)) {
        const updatedConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`.trim();
        fs.writeFileSync(tailwindConfigPath, updatedConfig);
      }
      spinner.succeed("✅ Tailwind CSS set up successfully!");
      showFinalMessage();
    }
  );
}

// Ask the user for installing more pakages

inquirer
  .prompt([
    {
      type: "checkbox",
      name: "packages",
      message: "📦 Which packages would you like to install?",
      choices: [
        {
          name: "tailwindcss (with PostCSS & autoprefixer)",
          value: "tailwindcss",
        },
        { name: "axios", value: "axios" },
        { name: "react-router-dom", value: "react-router-dom" },
        { name: "react-icons", value: "react-icons" },
      ],
    },
  ])

  .then((answer) => {
    const selectedPackages = answer.packages;

    const wantsTailwind = selectedPackages.includes("tailwindcss");
    const wantsRouter = selectedPackages.includes("react-router-dom");

    writeLayoutFile(wantsRouter);
    writeMainFileIfRouterSelected(wantsRouter);

    const packagesToInstall = selectedPackages.filter(
      (pkg) => pkg !== "tailwindcss"
    );

    const installCmd =
      packagesToInstall.length > 0
        ? `npm install ${packagesToInstall.join(" ")}`
        : "";

    const spinner = ora(
      packagesToInstall.length > 0
        ? `Installing ${packagesToInstall.join(", ")}...`
        : "Setting up Tailwind CSS..."
    ).start();

    if (installCmd) {
      exec(installCmd, (error, stdout, stderr) => {
        if (error) {
          spinner.fail(`❌ Failed to install packages: ${error.message}`);
          return;
        }
        spinner.succeed("✅ Packages installed successfully!");
        if (wantsTailwind) {
          installTailwind();
        } else {
          showFinalMessage();
        }
      });
    } else {
      spinner.stop();
      if (wantsTailwind) {
        installTailwind();
      } else {
        console.log("\n⚠️ No packages selected. Skipping installation.\n");
        showFinalMessage();
      }
    }
  });

function showFinalMessage() {
  console.log(`\n🎉 Setup Complete! Here's what we did for you:\n`);
  console.log(`📁 Created folders: ${foldersToCreate.join(", ")}`);
  console.log(`🧩 Setup routing with: ${fs.existsSync(path.join(srcPath, "main.jsx")) ? "✅ main.jsx" : "❌ (react-router-dom not selected)"}`);
  console.log(
    `🎨 Tailwind CSS: ${
      fs.existsSync(path.join(process.cwd(), "tailwind.config.js"))
        ? "Configured ✅"
        : "Not installed ❌"
    }`
  );
  console.log(
    `📦 Installed packages: axios, react-router-dom, react-icons (based on your selection)`
  );
  console.log(
    `\n✨ You're now ready to start building your React app with a clean structure!`
  );
  console.log(
    `📌 Tip: Add your routes inside <Route> in main.jsx and components under Components/ folder.`
  );
  console.log(
    `🚀 Happy hacking, and may your bugs be tiny and easy to squash!\n`
  );
}
