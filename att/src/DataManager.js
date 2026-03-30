import fs from 'node:fs/promises';

export class DataManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch { return []; }
  }

  async save(newItem) {
    const data = await this.read();
    data.push({ ...newItem, id: Date.now(), data: new Date().toISOString() });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }
}