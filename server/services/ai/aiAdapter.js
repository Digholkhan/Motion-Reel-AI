export class BaseAIAdapter {
  async generateScript(params) {
    throw new Error('generateScript must be implemented by adapter');
  }

  async generateStoryboard(params) {
    throw new Error('generateStoryboard must be implemented by adapter');
  }

  async regenerateScene(params) {
    throw new Error('regenerateScene must be implemented by adapter');
  }
}

