import server from "./index.ts"

server.listen(3000, (error) => {
  if (error) throw error;

  console.log("Running server on port 3000");
});

//  "dev:client": "npx tsc -p tsconfig.client.json --watch",