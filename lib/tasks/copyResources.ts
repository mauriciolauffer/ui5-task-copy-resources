interface Resource {
  getPath(): string;
}

interface DuplexCollection {
  byGlob(glob: string | string[]): Promise<Resource[]>;
  write(resource: Resource): Promise<void>;
}

interface AbstractReader {
  byGlob(glob: string | string[]): Promise<Resource[]>;
}

interface TaskOptions {
  projectName: string;
  projectNamespace?: string;
  configuration: {
    resources: string | string[];
    includeDependencies?: boolean;
  };
}

interface TaskParameters {
  workspace: DuplexCollection;
  dependencies: AbstractReader;
  options: TaskOptions;
}

/**
 * Task to copy resources without any changes, just move from one place to another
 *
 * @param resources List of resources
 * @param workspace DuplexCollection to read and write files
 * @returns Promise resolving once data has been written
 */
function writeResources(
  resources: Resource[],
  workspace: DuplexCollection,
): Promise<void[]> {
  return Promise.all(resources.map((resource) => workspace.write(resource)));
}

/**
 * Task to copy resources without any changes, just move from one place to another
 *
 * @param parameters Parameters
 * @returns Promise resolving once data has been written
 */
export default async function task({
  workspace,
  dependencies,
  options,
}: TaskParameters): Promise<void[]> {
  const config = options.configuration;
  const projectResources = await workspace.byGlob(config.resources);
  const dependenciesResources =
    config && config.includeDependencies
      ? await dependencies.byGlob(config.resources)
      : [];
  const resources = projectResources.concat(dependenciesResources);
  return writeResources(resources, workspace);
}
