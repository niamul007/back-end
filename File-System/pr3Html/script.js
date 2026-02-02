// === PROJECT CHALLENGE ===
// 1. SELECTORS: Grab the form and the list container.
// 2. LOAD DATA: Fetch existing expenses and render them.
// 3. ADD: Submit listener to POST new expense { name, amount }.
// 4. UPDATE: Function to PUT a new amount to the server.
// 5. DELETE: Function to DELETE an expense by ID.

// Tips:
// - Use `Date.now()` for unique IDs.
// - Remember to use `res.ok` to refresh the list after every action.

const budgetForm = document.getElementById("budgetForm");
const addBtn = document.getElementById("addBtn");

budgetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cause = document.getElementById("expenseName").value;
  const amount = document.getElementById("expenseAmount").value;

  addBtn.innerText = "Saving..";
  addBtn.disabled = true;
  try {
    const res = await fetch("/add-expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cause, amount }),
    });
    if (res.ok) {
      budgetForm.reset();
      loadExpense();
    }
  } catch (error) {
    console.error("Post failed:", error);
    alert("Could not save message.");
  } finally {
    // 3. Reset Button State
    addBtn.innerText = "Save";
    addBtn.disabled = false;
  }

  return;
});

async function loadExpense() {
  const expenseList = document.getElementById("expenseList");

  const res = await fetch("/expense");
  const data = await res.json();

  expenseList.innerHTML = "";

  data.forEach((ex) => {
    const div = document.createElement("div");
    div.className = "ex-card";
    div.innerHTML = `
        <p id="cause-${ex.id}">${ex.cause}</p> <p>$${ex.amount}</p>
        <div class="button-group">
            <button class="edit-btn" onclick="editEx(${ex.id}, this)">Edit</button>
            <button class="del-btn" onclick="delEx(${ex.id}, this)">Delete</button>
        </div>
    `;
    expenseList.appendChild(div);
  });
}

// --- FIXED EDIT ---
function editEx(id, editBtn) {
  const causeEl = document.getElementById(`cause-${id}`); // Changed ex.id to id
  const pTag = causeEl.innerText;
  causeEl.innerHTML = `<input type="text" id="input-${id}" value="${pTag}">`;
  editBtn.innerText = "Save";
  editBtn.onclick = () => saveEx(id, editBtn); // Fixed lowercase onclick
}

// --- FIXED SAVE ---
async function saveEx(id, saveBtn) {
  const newValue = document.getElementById(`input-${id}`).value; // Get .value, not the element
  const res = await fetch(`/update-expense/${id}`, {
    // Added leading slash
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cause: newValue }), // Moved body outside headers
  });
  if (res.ok) loadExpense();
}

async function delEx(id) {
  try {
    const res = await fetch(`/delete-expense/${id}`, { method: "DELETE" });

    if (res.ok) {
      loadExpense();
    }
  } catch (err) {
    console.log(err);
  }
}

loadExpense();

// === STEP 2: THE GET FUNCTION (loadData) ===
// 1. Create an async function
// 2. Fetch the data from your GET route
// 3. Convert response to JSON
// 4. Clear the container (innerHTML = "")
// 5. Loop (forEach) through data to create elements and appendChild
