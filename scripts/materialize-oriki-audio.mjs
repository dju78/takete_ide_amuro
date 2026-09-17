import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "content", "audio", "oriki");
const outputDir = path.join(root, "public", "audio", "oriki");

const recordings = [
  {
    name: "eseha-jare",
    sourcePrefix: "eseha-jare.part",
    bytes: 23187,
    sha256: "17c3fb80abf4a53eeb53383c80b0e05b0193501a272b1abe7bb458b099b5ffe2",
  },
  {
    name: "eseyin-telu",
    sourcePrefix: "eseyin-telu.part",
    bytes: 14021,
    sha256: "b343cfdab707ca6d04e79eb5f7a8f970f65b214407c232ae58bbeb1fef2ecbdd",
  },
  {
    name: "mesami-olu",
    sourcePrefix: "mesami-olu.part",
    bytes: 24672,
    sha256: "8877210eddb3ba24ddcefd9b453edd7fbf37d28a390cf379534ee25f281d977c",
  },
];

await mkdir(outputDir, { recursive: true });
const directoryEntries = await readdir(sourceDir);

for (const recording of recordings) {
  const chunkRegex = new RegExp(`^${recording.name}\\.part\\d+\\.b64$`);
  const files = directoryEntries
    .filter((name) => chunkRegex.test(name))
    .sort();

  if (files.length === 0) {
    throw new Error(`No encoded audio chunks found for ${recording.name}`);
  }

  const chunks = await Promise.all(
    files.map(async (name) => (await readFile(path.join(sourceDir, name), "utf8")).trim()),
  );

  const audio = Buffer.from(chunks.join(""), "base64");
  const digest = createHash("sha256").update(audio).digest("hex");

  if (audio.length !== recording.bytes || digest !== recording.sha256) {
    throw new Error(
      `Audio verification failed for ${recording.name}: got ${audio.length} bytes and ${digest}`,
    );
  }

  await writeFile(path.join(outputDir, `${recording.name}.ogg`), audio);
}

console.log(`Materialized and verified ${recordings.length} Oriki audio recordings.`);
