'use strict';

/**
 * Task to copy resources without any changes, just move from one place to another
 *
 * @param {module:@ui5/fs.Resource[]} resources List of resources
 * @param {module:@ui5/fs.DuplexCollection} workspace DuplexCollection to read and write files
 * @returns {Promise} Promise resolving once data has been written
 */
function writeResources(resources, workspace) {
  return Promise.all(resources.map((resource) => workspace.write(resource)));
}

/**
 * Task to copy resources without any changes, just move from one place to another
 *
 * @param {object} parameters Parameters
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {module:@ui5/fs.AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {object} parameters.options Options
 * @param {string} parameters.options.projectName Project name
 * @param {string} [parameters.options.projectNamespace] Project namespace if available
 * @param {object} [parameters.options.configuration] Task configuration if given in ui5.yaml
 * @returns {Promise} Promise resolving once data has been written
 */
module.exports = async function({workspace, dependencies, options}) {
  const config = options.configuration;
  const projectResources = await workspace.byGlob(config.resources);
  const dependenciesResources = (config && config.includeDependencies) ? await dependencies.byGlob(config.resources) : [];
  const resources = projectResources.concat(dependenciesResources);
  return writeResources(resources, workspace);
};
