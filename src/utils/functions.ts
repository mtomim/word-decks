import parse from "csv-parse/lib/sync";
import { DataFile, DataFileRegistry, ParsingError, SimpleObject, Word } from "./types";

export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const levenshteinDistance = (str1 = "", str2 = ""): number => {
  const track = Array(str2.length + 1)
    .fill(undefined)
    .map(() => Array(str1.length + 1).fill(undefined));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return track[str2.length][str1.length];
};

export function partitionBySize<T>(array: T[], size: number): T[][] {
  return array.reduce((arr, cur, i) => {
    const index = Math.floor(i / size);
    (arr[index] || (arr[index] = [])).push(cur);
    return arr;
  }, Array<T[]>());
}

export const getSetting = (): { difficulty: number, numWords: number } =>
  JSON.parse(
    localStorage.getItem("wd-setting") ||
    JSON.stringify({ difficulty: 1, numWords: 20 })
  );

export function shorten(str: string, len: number) {
  if (str.length + 3 > len) {
    return `${str.substring(0, len)}...`;
  }
  return str;
}

export async function readFile(file: File, sep: ','|';'): Promise<DataFile> {
  const lines: [] = [];
  const headers: string[] = [];
  const dataFile = new DataFile();
  Object.assign(dataFile, {
    fileName: file.name,
    fileSize: file.size,
    headers,
    content: lines,
  });

  if (file.type.match("application/json")) {
    return await readJson(file, dataFile);
  } else if (file.type.match("text/csv")) {
    return await readCsv(file, dataFile, sep);
  } else {
    throw new ParsingError("error.filetype", {});
  }
}

export function uniq(array: string[]): string[] {
  return Object.keys(array.reduce((obj,cur) => {
    obj[cur] = true;
    return obj;
  }, {} as { [key:string]: boolean }));
}

async function readCsv(file: File, dataFile: DataFile, sep: ','|';') {
  const records = parse(await file.text(), { delimiter: sep });
  const [headers]: [string[]] = records;
  dataFile.headers.push(...headers);
  dataFile.content.push(
    ...records.slice(1)
      .map((arr: []) =>
        arr.reduce((p, c: string, i) => Object.assign(p, { [headers[i]]: c }), new Word())
      )
  );
  return dataFile;
}

export const readJson = async (file: File, dataFile: DataFile) => {
  const content = JSON.parse(await file.text());
  content.forEach((row: Word) => {
    const keys = Object.keys(row);
    if (dataFile.headers.length === 0) {
      dataFile.headers.push(...keys);
    }
    dataFile.content.push(row);
  });
  return dataFile;
};

const WORD_SET_NAME = "wd-word-set-name";

export function getCurrentWordSet(): DataFile | undefined {
  const name = localStorage.getItem(WORD_SET_NAME) || "(internal)";
  return DataFileRegistry.REGISTRY.find((file) => file.fileName === name);
}

export function setCurrentWordSet(name: string) {
  localStorage.setItem(WORD_SET_NAME, name);
}
