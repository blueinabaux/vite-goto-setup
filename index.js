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

const layoutFile = `
  import React from 'react';

  const Layout = ({ children }) => {
    return (
      <div>
        {/* Add your layout structure here */}
        {children}
      </div>
    );
  };

  export default Layout;
`;

if (!fs.existsSync(srcPath)) {
  console.error("❌ Couldn't find 'src' folder. Make sure you're in the root of a Vite project.");
  process.exit(1);
}

foldersToCreate.forEach((folder) => {
  const folderPath = path.join(srcPath, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`✅ Created ${folder}/`);
  }
});

const layoutFilePath = path.join(srcPath, "Layout", "Layout.jsx");
if (!fs.existsSync(layoutFilePath)) {
  fs.writeFileSync(layoutFilePath, layoutFile.trim());
  console.log(`✅ Created Layout.jsx`);
}



// Ask the user for installing more pakages

inquirer.prompt([
    {
        type:"checkbox",
        name:"packages",
        message:"📦 Which packages would you like to install?",
        choices:[
            {name: "axios"},
            {name: "react-router-dom"},
            {name: "react-icons"}
        ]

    }
])

.then((answer) => {
    const selectedPackages = answer.packages;
    if(selectedPackages.length === 0){
        console.log("⚠️ No packages selected. Skipping installation.");
        return;
    }

    const spinner = ora(`Installing ${selectedPackages.join(", ")}...`).start();

    exec(`npm install ${selectedPackages.join(" ")}`, (error, stdout, stderr) => {
        if (error) {
            spinner.fail(`❌ Failed to install: ${error.message}`);
            return;
          }
          spinner.succeed("✅ Dependencies installed successfully!");
    })
})