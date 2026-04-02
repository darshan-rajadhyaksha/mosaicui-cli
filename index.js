#!/usr/bin/env node

const {
  getComponentLink,
  getWhereToAddComponent,
  getComponentSourceCode,
  createCodeFiles,
} = require("./util");
const messages = require("./messages");
const { MIN_NODE_MAJOR_VERSION } = require("./config");

(async () => {
  /**
   * Check node version
   */
  const major = Number(process.versions.node.split(".")[0]);
  if(major < MIN_NODE_MAJOR_VERSION) {
    messages.unsupportedNodeVersion(MIN_NODE_MAJOR_VERSION);
    process.exit();
  }

  /**
   * Extract component type and name from args
   */
  const [, , componentTypeAndName] = process.argv;
  const [componentType, componentName] = (
    componentTypeAndName.split("/").map(t => t.trim())
  );
  if (!(
    componentType &&
    componentName && 
    componentType.length > 0 &&
    componentName.length > 0
  )) {
    messages.componentInfoError();
    process.exit();
  }
  messages.componentInfoSuccess(
    componentType,
    componentName
  );

  /**
   * Generate component link
   */
  const componentLink = getComponentLink(componentName);

  /**
   * Get path to add component
   */
  let componentsPath = "";
  try {
    componentsPath = await getWhereToAddComponent();
    if(!componentsPath) {
      throw new Error();  
    }
  } catch(error) {
    messages.componentPathError();
    process.exit();
  } 

  /**
   * Get source code
   */
  let soruceCodeFiles;
  try {
    soruceCodeFiles = await getComponentSourceCode(
      componentType,
      componentName
    );
  } catch(error) {
    messages.fetchSourceCodeError(componentLink);
    process.exit();
  }

  /**
   * Write code to disk
   */
  try {
    await createCodeFiles(
      componentsPath,
      componentName,
      soruceCodeFiles,
    );
    messages.createComponentFilesSuccess(componentLink);
  } catch(error) {
    switch(error.reason) {
      case "already-exist":
        messages.createComponentFilesAlreadyExistsError(error.files);
        break;
      default: 
        messages.createComponentFilesError(
          error.files,
          componentLink
        );
        break;
    }
  }
})();