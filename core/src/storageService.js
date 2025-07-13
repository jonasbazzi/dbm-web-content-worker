export async function fetchJson(fileName, env) {
  const object = await env.WEB_BUCKET.get(fileName);

  if (object === null) {
    throw new Error(`File ${fileName} not found.`);
  }

  const jsonFile = await object.text();
  console.log(`Successfully fetched file: ${fileName}`);
  return jsonFile;
}

export async function store(fileName, fileContent, env) {
  await env.WEB_BUCKET.put(fileName, fileContent);
  console.log(`Successfully stored file: ${fileName}`);
}
