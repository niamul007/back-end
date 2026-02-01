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
    <p>${ex.cause}</p>
    <p>$${ex.amount}</p>
        <div class="button-group">
            <button class="edit-btn" onclick="editEx(${ex.id}, this)">Edit</button>
            <button class="del-btn" onclick="delEx(${ex.id}, this)">Delete</button>
        </div>
    `;
    expenseList.appendChild(div);
  });
}

loadExpense();

// === STEP 2: THE GET FUNCTION (loadData) ===
// 1. Create an async function
// 2. Fetch the data from your GET route
// 3. Convert response to JSON
// 4. Clear the container (innerHTML = "")
// 5. Loop (forEach) through data to create elements and appendChild
