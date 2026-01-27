import { readTask } from "../Utilities/fileHandler.js";
import { writeTask } from "../Utilities/fileHandler.js";

export async function handleTask(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const perams = new URLSearchParams(body);
    const newTask = {
      taskName: perams.get("taskName"),
      category: perams.get("category"),
      id: Date.now(),
    };

    const currentTask = await readTask();
    currentTask.push(newTask);
    await writeTask(currentTask)
    console.log("Task saved successfully");

    res.writeHead(302,{Location: '/'})
    res.end()
  });
}
