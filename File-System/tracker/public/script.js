
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
    const result = await res.json();
    const habits = result.data;

    habitList.innerHTML = "";

    // 1. Calculate the percentage using the WHOLE array
    // Do this BEFORE or AFTER the loop, but not INSIDE it.
    calculate(habits); 

    if (!habits || habits.length === 0) {
      habitList.innerHTML = `<p class="no-results">No habits found. Start striving!</p>`;
      // Optional: set percent to 0 if list is empty
      document.getElementById("percent").innerText = "0%";
      return;
    }

    habits.forEach((item) => {
      const div = document.createElement("div");
      div.className = `habit-item ${item.isDone ? "completed" : ""}`;

      div.innerHTML = `
                <span>${item.task}</span>
                <div>
                    <button class="btn-delete" onclick="delTask('${item.id}')">Delete</button>
                    <button class="btn-done" onclick="comTask('${item.id}')">Done</button>
                </div>
            `;
      habitList.appendChild(div);
      // REMOVED: calculate(item) from here
    });
  } catch (err) {
    console.error("Load error:", err);
  }
}

function calculate(item) {
    // This finds ALL items where isDone is true
    const doneTasks = item.filter((h) => h.isDone === true);

    // This gives you the total count (2, 3, 4, etc.)
    const sum = doneTasks.length; 

    const total = item.length;
    const perCal = total > 0 ? Math.round((sum / total) * 100) : 0;

    document.getElementById("percent").innerText = perCal + "%";
}

// --- Global Action Functions ---

window.delTask = async (id) => {
  if (!confirm("Delete this habit?")) return;
  await fetch(`/api/delete-task/${id}`, { method: "DELETE" });
  console.log("clicked");
  await loadTask();
};

window.comTask = async (id) => {
  // You will need to build this route in your backend!
  await fetch(`/api/toggle-task/${id}`, { method: "PATCH" });
  console.log("Toggle trigger");
  await loadTask();
};

document.getElementById("resetAll").addEventListener("click", async () => {
  await fetch("/api/empty", { method: "PUT" });
  console.log("Clickeed reset");
  await loadTask();
});
// Initialize
loadTask();
