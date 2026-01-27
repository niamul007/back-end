const taskContainer = document.getElementById("task-list");

async function loadTask() {
  try {
    const res = await fetch("/tasks");
    
    // FIX 1: You MUST await res.json()
    const tasks = await res.json(); 

    taskContainer.innerHTML = "";

    // FIX 2: Use 'tasks' (the variable we just created above)
    tasks.forEach((task) => {
      const card = document.createElement("div");

      card.className = `task-card ${task.category}`;

      card.innerHTML = `
        <div>
            <strong>${task.taskName}</strong> 
            <small>(${task.category})</small>
        </div>
        <span>ID: ${task.id.toString().slice(-4)}</span>
      `;

      // FIX 3: Use 'taskContainer' (the variable at the top of the file)
      taskContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load tasks:", error);
  }
}

loadTask();