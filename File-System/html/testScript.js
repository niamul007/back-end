const feed = document.getElementById("feed");
const noteForm = document.getElementById("noteForm");

noteForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Stop the page from refreshing

  const btn = document.getElementById("submitBtn");
  const username = document.getElementById("username").value;
  const message = document.getElementById("message").value;

  // 1. Loading State
  btn.innerText = "Posting...";
  btn.disabled = true;

  try {
    // 2. The Fetch Request
    const res = await fetch("/add-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, message }),
    });

    if (res.ok) {
      noteForm.reset(); // Clear the form
      loadNotes(); // Refresh the list instantly
    }
  } catch (error) {
    console.error("Post failed:", error);
    alert("Could not save message.");
  } finally {
    // 3. Reset Button State
    btn.innerText = "Post Message";
    btn.disabled = false;
  }
});

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
    <p id="msg-${note.id}">${note.message}</p>
    <button onclick="editNote(${note.id}, this)">Edit</button>
    <button style="background:red;" onclick="delBtn(${note.id}, this)">Delete</button>
`;
      feed.appendChild(postDiv);
    });
  } catch (error) {
    console.error("Failed to load notes:", error);
    feed.innerHTML =
      "<p style='color:red;'>Could not load messages. Is the server running?</p>";
  }
}
function editNote(id, editBtn) {
  const pTag = document.getElementById(`msg-${id}`);
  const originalText = pTag.innerText;

  // Turn the paragraph into an input field
  pTag.innerHTML = `<input type="text" id="input-${id}" value="${originalText}">`;

  // Change "Edit" button to "Save"
  editBtn.innerText = "Save";
  editBtn.onclick = () => saveUpdate(id, editBtn);
}

async function saveUpdate(id, saveBtn) {
  const newMessage = document.getElementById(`input-${id}`).value;

  const res = await fetch(`/update-note/${id}`, {
    method: "PUT", // PUT is the standard for Updating
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: newMessage }),
  });

  if (res.ok) {
    loadNotes(); // Refresh to show the new text
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
}
loadNotes();
