// This runs in the browser
console.log("Script loaded and running!");

const container = document.getElementById("cards");

async function loadStories() {
  try {
    const response = await fetch("/stories");
    if (!response.ok) throw new Error("Could not fetch stories");
    
    const data = await response.json();

    data.forEach(story => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <h3>${story.title}</h3>
        <p>${story.content}</p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading stories:", error);
    // Optionally show a message if the server is empty
    const info = document.createElement("p");
    info.textContent = "Waiting for new stories from the server...";
    container.appendChild(info);
  }
}

loadStories();