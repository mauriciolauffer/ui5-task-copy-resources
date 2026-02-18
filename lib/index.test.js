'use strict';

/* global describe, it, expect, vi */

const task = require('./index.js');

describe('ui5-task-copy-resources', () => {
  it('should copy project resources', async () => {
    const workspace = {
      byGlob: vi.fn().mockResolvedValue(['res1', 'res2']),
      write: vi.fn().mockResolvedValue(true),
    };
    const dependencies = {
      byGlob: vi.fn().mockResolvedValue([]),
    };
    const options = {
      configuration: {
        resources: ['**/*.js'],
      },
    };

    await task({workspace, dependencies, options});

    expect(workspace.byGlob).toHaveBeenCalledWith(['**/*.js']);
    expect(workspace.write).toHaveBeenCalledTimes(2);
    expect(workspace.write).toHaveBeenCalledWith('res1');
    expect(workspace.write).toHaveBeenCalledWith('res2');
  });

  it('should copy dependencies resources if includeDependencies is true', async () => {
    const workspace = {
      byGlob: vi.fn().mockResolvedValue(['res1']),
      write: vi.fn().mockResolvedValue(true),
    };
    const dependencies = {
      byGlob: vi.fn().mockResolvedValue(['dep1']),
    };
    const options = {
      configuration: {
        resources: ['**/*.js'],
        includeDependencies: true,
      },
    };

    await task({workspace, dependencies, options});

    expect(workspace.byGlob).toHaveBeenCalledWith(['**/*.js']);
    expect(dependencies.byGlob).toHaveBeenCalledWith(['**/*.js']);
    expect(workspace.write).toHaveBeenCalledTimes(2);
    expect(workspace.write).toHaveBeenCalledWith('res1');
    expect(workspace.write).toHaveBeenCalledWith('dep1');
  });
});
