const feed = document.getElementById("feed");

async function loadNotes() {
  try {
    const res = await fetch("/notes");
    const data = await res.json();

    feed.innerHTML = "";

    data.forEach((note) => {
      const postDiv = document.createElement("div");
      postDiv.className = "post";

      postDiv.innerHTML = `
            <b>@${note.username}</b>
            <p>@${note.message}</
              <button 
                  style="background:red; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" 
                  onclick="deleteNote(${note.id}, this)">
                  Delete
              </button>
            `;
      feed.appendChild(postDiv);
    });
  } catch (error) {
    console.error("Failed to load notes:", error);
    feed.innerHTML =
      "<p style='color:red;'>Could not load messages. Is the server running?</p>";
  }
}

async function delBtn(id, buttonElement) {
  if (buttonElement.innerText === "Delete") {
    buttonElement.innerText = "Are you sure";
    buttonElement.style.backgroundColor = "orange";

    setTimeout(() => {
      buttonElement.innerText = "Delete";
      buttonElement.style.backgroundColor = "red";
    }, 3000);
    return;
  }

  buttonElement.innerText = "Deleting..";
  buttonElement.disabled = true;

  try {
    const res = await fetch(`/delete-note/${id}`, { method: "DELETE" });
    if (res.ok) {
      loadNotes();
    }
  } catch (error) {
    buttonElement.innerText = "Error!";
    buttonElement.disabled = false;
  }
  loadNotes();
}
