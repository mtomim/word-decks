const REQUIRED_FIELDS = ["word", "reading", "definition", "part"];

export class ParsingError extends Error {
  constructor(name: string, object: { headers?: string[] }) {
    super();
    Object.setPrototypeOf(this, ParsingError.prototype);
    this.name = name;
    Object.assign(this, object);
  }
}

export interface SimpleObject {
  [key: string]: (string | number | boolean);
}

export class Word implements SimpleObject {
  [key: string]: string | number | boolean
  word: string = '';
  reading: string = ''
  definition: string = ''
  part: string = ''
}

export class Answer implements SimpleObject {
  [key: string]: string | number | boolean
  word: string = '';
  right: boolean = false;
  answer: string = '';
}

export class DataFile {
  static STORE_KEY = 'word-deck-parsed-csv-files';
  fileName = '';
  fileSize = 0;
  headers: string[] = [];
  modHeaders: string[] = [];
  content: Word[] = [];
  creationDate: number = new Date().getTime();
  hdrInit = false;
  validateHeaders() {
    if (!REQUIRED_FIELDS.every((key) => this.headers.includes(key))) {
      throw new ParsingError("error.headersmissing", { headers: this.headers });
    }
    return true;
  }
}

export const registry: DataFile[] = JSON.parse(localStorage.getItem(DataFile.STORE_KEY) || '[]');

if (registry.length === 0) {
  registry.push(Object.assign(new DataFile(), {
    fileName: "(internal)",
    fileSize: 721505,
    headers: ["word", "reading", "definition", "part"],
    content: require("@/assets/words.json"),
    creationDate: new Date("2021-09-11").getTime(),
  }));
}

if (!registry.find((f) => f.fileName === "(internal easy 500)")) {
  registry.push(Object.assign(new DataFile(), {
    fileName: "(internal easy 500)",
    fileSize: 56533,
    headers: ["word", "reading", "definition", "part"],
    content: require("@/assets/easy500.json"),
    creationDate: new Date("2021-10-11").getTime(),
  }));
}

export class DataFileRegistry {
  static REGISTRY = registry;

  size = registry.length;

  add(file: DataFile) {
    if (DataFileRegistry.REGISTRY.map((f) => f.fileName).includes(file.fileName)) {
      throw new Error(`${file.fileName} exists already, discarding the add request.`);
    }
    this.size = DataFileRegistry.REGISTRY.push(file);
    localStorage.setItem(DataFile.STORE_KEY, JSON.stringify(DataFileRegistry.REGISTRY));
  }

  remove(name: string) {
    const position = DataFileRegistry.REGISTRY.findIndex((f) => f.fileName === name);
    if (position !== -1) {
      DataFileRegistry.REGISTRY.splice(position, 1);
    }
    this.size = DataFileRegistry.REGISTRY.length;
    localStorage.setItem(DataFile.STORE_KEY, JSON.stringify(DataFileRegistry.REGISTRY));
  }
}
