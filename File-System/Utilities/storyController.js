import getData from "./getData.mjs";
// We will eventually import a saveData function here too

export async function handleAddStory(req, res) {
  let body = "";

  // Collect the data chunks
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  // Once all data is here
  req.on("end", async () => {
    // 1. Parse the URL-encoded data from the form
    const params = new URLSearchParams(body);
    const newStory = {
      title: params.get("title"),
      content: params.get("content"),
      id: Date.now() // Give it a unique ID
    };

    console.log("Controller received new story:", newStory);

    // 2. Respond to the browser
    res.writeHead(201, { "Content-Type": "text/html" });
    res.end(`
      <h1>Success!</h1>
      <p>Story "${newStory.title}" was received.</p>
      <a href="/">Go back to Home</a>
    `);
  });
}