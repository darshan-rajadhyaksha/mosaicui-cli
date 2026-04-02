const { PACKAGE_NAME } = require("./config");

const unsupportedNodeVersion = (requiredNodeVersion) => console.log(`
✖ Node.js ${requiredNodeVersion}+ is required.
Current version: ${process.versions.node}

Please upgrade Node.js to continue.
`.trimStart());

const componentInfoSuccess = (
  componentType,
  componentName
) => console.log(`
ℹ Creating component...

📦 Type : ${componentType}
📝 Name : ${componentName}
`.trimStart());

const componentInfoError = () => console.log(`
✖ Missing required arguments.

You must provide both:
- component type
- component name

👉 Usage:
npx ${PACKAGE_NAME} <component-type>/<component-name>

Example:
npx ${PACKAGE_NAME} essentials/circular-list
`.trimStart());


const componentPathError = () => console.log(`
⚠ Directory not specified!

Please enter the directory where the component should be created.

Hint: 
- e.g. ./src/components
`);

const fetchSourceCodeError = (componentLink) => console.log(`
✖ Failed to fetch component code.

You can still use manual mode:
👉 Copy the component code from:
${componentLink}

Then paste it into your project manually.
`);

const createComponentFilesSuccess = (componentLink) => console.log(`
🎉 Your component is ready!

📖 Check props & usage docs:
${componentLink}
`);

const createComponentFilesAlreadyExistsError = (files) => console.log(`
⚠ Below files already exist.

${files.join("\n")}

Please choose a different directory or use manual mode to copy-paste the code.
`);

const createComponentFilesError = (files) => console.log(`
⚠ Below files could not be created:

${files.join("\n")}

Please create these files manually and paste the code.
`);

module.exports = {
  unsupportedNodeVersion,
  componentInfoSuccess,
  componentInfoError,
  componentPathError,
  fetchSourceCodeError,
  createComponentFilesSuccess,
  createComponentFilesError,
  createComponentFilesAlreadyExistsError,
};