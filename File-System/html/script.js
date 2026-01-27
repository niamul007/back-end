const container = document.getElementById("cards");

async function loadStories() {
  try {
    const response = await fetch("/stories"); // This triggers your GET /stories route
    const data = await response.json();

    // Clear the container first so we don't double the stories
    container.innerHTML = ""; 

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
  }
}

loadStories();