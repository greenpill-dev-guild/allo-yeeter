const fs = require("fs");
const glob = require("glob");
const path = require("path");

// Function to read file contents
function readFileContents(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

// Function to write updated contents back to the file
function writeFileContents(filePath, contents) {
  fs.writeFileSync(filePath, contents, "utf8");
}

// Function to resolve the full path of the import
function resolveFullPath(filePath, importPath) {
  return path.resolve(path.dirname(filePath), importPath);
}

// Function to check if a path is a directory
function isDirectory(fullPath) {
  return fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory();
}

// Function to check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Function to update import statements for directories and `..` or `.`
function updateDirectoryOrDotImport(fromKeyword, importPath, quote, fullPath) {
  const indexPath = path.join(fullPath, "index.mjs");
  if (fileExists(indexPath)) {
    return `${fromKeyword}${importPath}/index.mjs${quote}`;
  } else {
    return `${fromKeyword}${importPath}${quote}`;
  }
}

// Function to update import statements for files
function updateFileImport(fromKeyword, importPath, quote, fullPath) {
  const mjsPath = `${fullPath}.mjs`;
  if (fileExists(mjsPath)) {
    return `${fromKeyword}${importPath}.mjs${quote}`;
  } else {
    return `${fromKeyword}${importPath}${quote}`;
  }
}

// Function to update specific import statements
function updateSpecificImports(fromKeyword, importPath, quote) {
  if (importPath === "posthog-js/react") {
    return `${fromKeyword}posthog-js/react/dist/esm/index.js${quote}`;
  } else if (importPath === "@allo-team/allo-v2-sdk/dist/Allo/allo.config") {
    return `${fromKeyword}@allo-team/allo-v2-sdk/dist/Allo/allo.config.js${quote}`;
  }
  return null;
}

// Function to update import statements
function updateImportStatement(fromKeyword, importPath, quote, filePath) {
  const specificImport = updateSpecificImports(fromKeyword, importPath, quote);
  if (specificImport) {
    return specificImport;
  }

  const fullPath = resolveFullPath(filePath, importPath);

  if (importPath === ".." || importPath === "." || isDirectory(fullPath)) {
    return updateDirectoryOrDotImport(fromKeyword, importPath, quote, fullPath);
  } else if (!importPath.endsWith(".mjs")) {
    return updateFileImport(fromKeyword, importPath, quote, fullPath);
  }

  return `${fromKeyword}${importPath}${quote}`;
}

// Main function to update imports in .mjs files
function updateImports(filePath) {
  const contents = readFileContents(filePath);

  const updatedContents = contents.replace(
    /(from\s+['"])(\.\.?\/[^'"\s]+|\.|..|posthog-js\/react|@allo-team\/allo-v2-sdk\/dist\/Allo\/allo.config)(['"])/g,
    (match, fromKeyword, importPath, quote) => {
      return updateImportStatement(fromKeyword, importPath, quote, filePath);
    },
  );

  if (contents !== updatedContents) {
    writeFileContents(filePath, updatedContents);
  }
}

// Get all .mjs files in the dist directory
function getAllMjsFiles() {
  return glob.sync("dist/**/*.mjs");
}

// Update imports in each .mjs file
function updateAllImports() {
  const files = getAllMjsFiles();
  files.forEach(updateImports);
  console.log("Imports updated in .mjs files");
}

// Run the update process
updateAllImports();
