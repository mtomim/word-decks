const expectedFields = ["word", "reading", "definition", "part"];

export function ParsingException(name, objects) {
  this.name = name;
  Object.assign(this, objects);
}

export class DataFile {
  static STORE_KEY = 'word-deck-parsed-csv-files';
  fileName = '';
  fileSize = 0;
  headers = [];
  modHeaders = [];
  content = [];
  creationDate = new Date().getTime();
  hdrInit = false;
  validateHeaders() {
    if (!expectedFields.every((key) => this.headers.includes(key))) {
      throw new ParsingException("error.headersmissing", { headers: this.headers });
    }
    return true;
  }
}

export const registry = JSON.parse(localStorage.getItem(DataFile.STORE_KEY) || '[]');

if (registry.length === 0) {
  registry.push(Object.assign(new DataFile(), {
    fileName: "(internal)",
    fileSize: 721505,
    headers: [ "word", "reading", "definition", "part" ],
    content: require("@/assets/words.json"),
    creationDate: new Date("2021-09-11"),
  }));
}

export class DataFileRegistry {
  static REGISTRY = registry;

  size = registry.length;

  add(file) {
    if (DataFileRegistry.REGISTRY.map((f) => f.fileName).includes(file.fileName)) {
      throw new Error(`${file.fileName} exists already, discarding the add request.`);
    }
    this.size = DataFileRegistry.REGISTRY.push(file);
    localStorage.setItem(DataFile.STORE_KEY, JSON.stringify(DataFileRegistry.REGISTRY));
  }

  remove(name) {
    const position = DataFileRegistry.REGISTRY.findIndex((f) => f.fileName === name);
    if (position !== -1) {
      DataFileRegistry.REGISTRY.splice(position, 1);
    }
    this.size = DataFileRegistry.REGISTRY.length;
    localStorage.setItem(DataFile.STORE_KEY, JSON.stringify(DataFileRegistry.REGISTRY));
  }
}
