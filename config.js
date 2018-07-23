 /*
  * Create and export configuration variables
  */

 // Container for all the environments
 const environments = {};

 // Developement (default) environment
 environments.development = {
   'httpPort'   : 3000,
   'envName'    : 'development'
 };

 // Production environment
 environments.production = {
   'httpPort'   : 80,
   'envName'    : 'production'
 };

 // Determine which environment was passed as a command-line argument
 const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

 // Check that the current environment is one of the environments above, if not, default to staging
 const environmentToExport = typeof (environments[currentEnvironment]) !== 'undefined' ? environments[currentEnvironment] : environments.development;

 // Export the module
 module.exports = environmentToExport;