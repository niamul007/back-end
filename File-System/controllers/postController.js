import { readPost, writePost } from "../Utilities/postHandelers.js";

export async function controlPost(req, res) {
  // FIX 1: Use 'let' so we can update the string
  let body = ""; 

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    // FIX 2: Added 'new' keyword
    const params = new URLSearchParams(body); 
    
    const newPost = {
      // Check: Make sure these names match your HTML <input name="..."> exactly!
      username: params.get("username"),
      message: params.get("message"), 
      id: Date.now(),
    };
    
    const currentPosts = await readPost();
    currentPosts.push(newPost);
    await writePost(currentPosts);
    
    console.log("Post saved successfully");

    // FIX 3: Correct method name and destination
    res.writeHead(302,{Location:"/"});
    res.end();
  });
}