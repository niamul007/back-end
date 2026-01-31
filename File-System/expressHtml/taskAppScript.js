const tbody = document.getElementById("tbody");
const taskForm = document.getElementById("taskForm");

// 1. ADD TASK (POST)
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const name = document.getElementById("taskInput").value; 
  const priority = document.getElementById("priority").value;
  const addBtn = document.getElementById("addBtn");

  addBtn.innerText = "Posting..";
  addBtn.disabled = true;

  try {
    const res = await fetch("/add-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, priority }), // 'name' matches backend
    });

    if (res.ok) {
      taskForm.reset();
      loadTask(); // Refresh the table
    }
  } catch (error) {
    console.error("Post failed:", error);
    alert("Could not save task.");
  } finally {
    addBtn.innerText = "Add Task";
    addBtn.disabled = false;
  }
});

// 2. LOAD TASKS (GET)
async function loadTask() {
  try {
    const res = await fetch("/tasks");
    const data = await res.json();

    tbody.innerHTML = "";

    data.forEach((task) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>#${task.id}</td>
                <td>${task.name}</td>
                <td><span class="status ${task.priority}">${task.priority}</span></td>
                <td>
                    <button class="btn-delete" onclick="deleteTask(${task.id})">
                        Delete
                    </button>
                </td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Failed to load tasks:", error);
    tbody.innerHTML = "<tr><td colspan='4' style='color:red;'>Server Error</td></tr>";
  }
}

// 3. DELETE TASK (DELETE)
async function deleteTask(id) {
    if (!confirm("Are you sure?")) return;

    try {
        const res = await fetch(`/delete-task/${id}`, { method: "DELETE" });
        if (res.ok) {
            loadTask(); // Reload table after deletion
        }
    } catch (error) {
        console.error("Delete failed:", error);
    }
}

loadTask();