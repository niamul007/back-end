const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const habitInput = document.getElementById("habitInput").value;
    
    if (!habitInput.trim()) return alert("Please enter a habit!");

    const submitBtn = e.submitter || form.querySelector('button[type="submit"]');
    submitBtn.innerText = "Saving..";
    submitBtn.disabled = true;

    try {
        const res = await fetch("/api/add-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: habitInput }), 
        });

        if (res.ok) {
            form.reset();
            await loadTask();
        } else {
            // Handle Validation Errors from Zod
            const errorData = await res.json();
            alert(errorData.message || "Validation failed");
        }
    } catch (err) {
        console.error(err);
        alert("Critical Server Error");
    } finally {
        submitBtn.innerText = "Add";
        submitBtn.disabled = false;
    }
});

async function loadTask() {
    const habitList = document.getElementById("habitList");
    
    try {
        const res = await fetch("/api/get-task");
        const result = await res.json(); // This is the full object

        // FIX: Extract the actual array from the 'data' property
        const habits = result.data; 

        habitList.innerHTML = "";
        
        if (!habits || habits.length === 0) {
            habitList.innerHTML = `<p class="no-results">No habits found. Start striving!</p>`;
            return;
        }

        // Loop through 'habits' (the array), NOT 'result' (the object)
        habits.forEach((item) => {
            const div = document.createElement("div");
            div.className = `habit-item ${item.isDone ? 'completed' : ''}`;

            div.innerHTML = `
                <span>${item.task}</span>
                <div>
                    <button class="btn-delete" onclick="delTask('${item.id}')">Delete</button>
                    <button class="btn-done" onclick="comTask('${item.id}')">Done</button>
                </div>
            `;
            habitList.appendChild(div);
        });
    } catch (err) {
        console.error("Load error:", err);
    }
}

// --- Global Action Functions ---

window.delTask = async (id) => {
    if(!confirm("Delete this habit?")) return;
    await fetch(`/api/delete-task/${id}`, { method: 'DELETE' });
    await loadTask();
};

window.comTask = async (id) => {
    // You will need to build this route in your backend!
    await fetch(`/api/toggle-task/${id}`, { method: 'PATCH' });
    await loadTask();
};

// Initialize
loadTask();