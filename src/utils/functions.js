import parse from "csv-parse/lib/sync";
import { DataFile, DataFileRegistry, ParsingException } from "./types";

export const shuffle = (array) => {
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
};

export const levenshteinDistance = (str1 = "", str2 = "") => {
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

export const getSetting = () =>
  JSON.parse(
    localStorage.getItem("wd-setting") ||
      JSON.stringify({ difficulty: 10, numWords: 20 })
  );

export function shorten(str, len) {
  if (str.length + 3 > len) {
    return `${str.substring(0, len)}...`;
  }
  return str;
}

export async function readFile(file) {
  const lines = [];
  const headers = [];
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
    return await readCsv(file, dataFile);
  } else {
    throw new ParsingException("error.filetype", {});
  }
}

async function readCsv(file, dataFile) {
  const records = parse(await file.text());
  const [param] = records;
  dataFile.headers.push(...param);
  dataFile.content.push(
    ...records.slice(1).map((arr) =>
      arr.reduce((p, c, i) => {
        p[param[i]] = c;
        return p;
      }, {})
    )
  );
  return dataFile;
}

export const readJson = async (file, dataFile) => {
  const content = JSON.parse(await file.text());
  content.forEach((row) => {
    const keys = Object.keys(row);
    if (dataFile.headers.length === 0) {
      dataFile.headers.push(...keys);
    }
    dataFile.content.push(row);
  });
  return dataFile;
};

export function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

const WORD_SET_NAME = "wd-word-set-name";

export function getCurrentWordSet() {
  const name = localStorage.getItem(WORD_SET_NAME) || "(internal)";
  return DataFileRegistry.REGISTRY.find((file) => file.fileName === name);
}

export function setCurrentWordSet(name) {
  localStorage.setItem(WORD_SET_NAME, name);
}
