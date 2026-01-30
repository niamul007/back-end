const tbody = document.getElementById("tbody");

async function loadTask() {
    try {
        const res = await fetch("/tasks");
        const data = await res.json();

        // 1. Always clear the table first
        tbody.innerHTML = "";

        // 2. Loop through the data array
        data.forEach((task) => {
            const tr = document.createElement("tr");

            // 3. Inject the REAL data using template literals
            tr.innerHTML = `
                <td>#${task.id}</td>
                <td>${task.name}</td>
                <td><span class="status ${task.priority}">${task.priority}</span></td>
                <td>
                    <button class="btn-delete" onclick="deleteTask(${task.id}, this)">
                        Delete
                    </button>
                </td>
            `;

            // 4. Attach the row to the table body
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Failed to load tasks:", error);
        tbody.innerHTML = "<tr><td colspan='4' style='color:red;'>Server Error</td></tr>";
    }
}

loadTask();