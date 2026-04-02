const fs = require("fs/promises");
const path = require("path");
const { prompt } = require("enquirer");
const {
  CODE_PATH,
  BASE_COMPONENT_PATH,
} = require("./config");

const getComponentLink = (componentName) => (
  `${BASE_COMPONENT_PATH}/${componentName}/`
);

const getSourceCodePath = (
  componentType,
  componentName
) => ({ 
  [`${componentName}.jsx`]: `${CODE_PATH}/${componentType}/${componentName}/${componentName}.jsx`,
  [`${componentName}.moudle.css`]: `${CODE_PATH}/${componentType}/${componentName}/${componentName}.module.css`,
});

const getWhereToAddComponent = async () => {
  try {
    const response = await prompt({
      type: "input",
      name: "path",
      message: "Where should we create this component?",
      initial: "./src/components/",
      hint: "e.g. ./src/components",
    });
    return response.path.trim();
  } catch (error) {
    return null;
  }
};

const getComponentSourceCode = async (
  componentType,
  componentName
) => {
  try {
    const files = getSourceCodePath(componentType, componentName);
    const codes = await Promise.all(
      Object.entries(files).map(([_fileName, filePath]) => (
        fetch(filePath)
        .then(response => {
          if(response.status === 200) {
            return response.text();
          }
          throw new Error();
        })
      ))
    );
    return (
      Object.keys(files)
      .map((fileName, index) => ({
        fileName,
        soruceCode: codes[index],
      }))
    );
  } catch(error) {
    throw new Error("unable to fetch source code");
  }
};

const createCodeFiles = async (
  componentsPath,
  componentName,
  files
) => {
  const componentsParentDir = path.join(
    process.cwd(),
    componentsPath,
    componentName
  );
  const existingFiles = [];
  for(const file of files) {
    const filePath = path.join(componentsParentDir, file.fileName);
    try {
      await fs.access(filePath);
      existingFiles.push(filePath);
    } catch(error) { /* No need */ }
  }
  if(existingFiles.length !== 0) {
    throw ({
      reason: "already-exist",
      files: existingFiles,
    })
  }
  let failedFiles = [];
  for(const file of files) {
    const filePath = path.join(componentsParentDir, file.fileName);
    try {
      try {
        await fs.access(componentsParentDir);
      } catch(error) {
        await fs.mkdir(componentsParentDir, { recursive: true });
      }
      await fs.writeFile(filePath, file.soruceCode, "utf8");
    } catch(err) {
      failedFiles.push(filePath);
    }
  }
  if(failedFiles.length !== 0) {
    throw ({
      reason: "writing-files",
      files: failedFiles,
    });
  }
};

module.exports = {
  getComponentLink,
  getWhereToAddComponent,
  getComponentSourceCode,
  createCodeFiles,
};