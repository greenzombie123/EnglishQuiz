// Get the path module from Node
import path from 'path';

// Provides correct absolute path no matter what platform
import { fileURLToPath } from 'url';

// import.meta.url returns the url of the module within the context of the hosting
// environment
const __filename = fileURLToPath(import.meta.url);

// Create url of the current directory of module
const dirname = path.dirname(__filename);

const views = path.join(dirname, "views") as string
const errors = path.join(dirname, "errors") as string

export default [views, errors]