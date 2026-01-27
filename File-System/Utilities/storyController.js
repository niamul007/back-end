import { getData } from "./getData.mjs";
import { saveData } from "./saveData.mjs"; // 1. Import the writer

export async function handleAddStory(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const params = new URLSearchParams(body);
    const newStory = {
      title: params.get("title"),
      content: params.get("content"),
      id: Date.now(),
    };

    // 2. GET existing stories
    const currentStories = await getData();

    // 3. ADD the new story to the list
    currentStories.push(newStory);

    // 4. SAVE the updated list back to data.json
    await saveData(currentStories);

    console.log("Story saved successfully!");

    // 5. REDIRECT back home to see the new card
    res.writeHead(302, { Location: "/" });
    res.end();
  });
}