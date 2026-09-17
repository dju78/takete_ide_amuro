import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "content", "audio", "oriki");
const outputDir = path.join(root, "public", "audio", "oriki");

const recordings = ["eseha-jare", "eseyin-telu", "mesami-olu"];

await mkdir(outputDir, { recursive: true });

for (const recording of recordings) {
  const files = (await readdir(sourceDir))
    .filter((name) => name.startsWith(`${recording}.part`) && name.endsWith(".b64"))
    .sort();

  if (files.length === 0) {
    throw new Error(`No encoded audio chunks found for ${recording}`);
  }

  const chunks = await Promise.all(
    files.map(async (name) => (await readFile(path.join(sourceDir, name), "utf8")).trim()),
  );

  const audio = Buffer.from(chunks.join(""), "base64");
  await writeFile(path.join(outputDir, `${recording}.ogg`), audio);
}

console.log(`Materialized ${recordings.length} Oriki audio recordings.`);
