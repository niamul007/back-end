const form = document.getElementById("groceryForm");
const container = document.getElementById("listContainer");

// --- 1. Load & Render ---
async function loadItems() {
  try {
    const res = await fetch("/api/items");
    if (!res.ok) throw new Error("Failed to fetch items");

    const data = await res.json();
    container.innerHTML = "";

    data.forEach((item) => {
      // FIX: Create a NEW div for every item, don't try to get a non-existent "div" id
      const div = document.createElement("div");
      div.className = "item-row"; // Add styling class

      // FIX: Use item.itemName (check your backend field names!)
      div.innerHTML = `
    <div class="item-info">
        <span 
            class="item-text ${item.bought ? "bought" : ""}" 
            id="text-${item.id}" 
            onclick="window.toggleBought('${item.id}')"
        >
            ${item.item}
        </span>
        <span class="item-qty">x${item.itemQty}</span>
    </div>
    <div class="actions">
        <button class="edit-btn" onclick="window.editItem('${item.id}', this)">Edit</button>
        <button class="del-btn" onclick="window.deleteItem('${item.id}')">Delete</button>
    </div>
`;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

window.editItem = async (id, buttonElement) => {
  // 1. YOU MUST DEFINE IT FIRST:
  const textSpan = document.getElementById(`text-${id}`);

  // 2. Check if it actually exists (Senior safety check)
  if (!textSpan) {
    console.error("Could not find the span element!");
    return;
  }

  const originalTxt = textSpan.innerText;

  // 3. NOW you can use it:
  textSpan.innerHTML = `<input type="text" id="input-${id}" value="${originalTxt}">`;

  buttonElement.innerText = "Save";
  buttonElement.onclick = () => window.saveData(id, buttonElement);
};

window.saveData = async (id, buttonElement) => {
  const inputField = document.getElementById(`input-${id}`);
  if (!inputField) return;

  const newTxt = inputField.value;

  try {
    const res = await fetch(`/api/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newTxt: newTxt }), // Matches your controller
    });

    if (res.ok) {
      // Once saved, reload the list to show the plain text again
      await loadItems();
    } else {
      const errorData = await res.json();
      alert("Update failed: " + errorData.error);
    }
  } catch (error) {
    console.error("Critical error in saveData:", error);
  }
};
window.toggleBought = async (id) => {
  try {
    const res = await fetch(`/api/toggle/${id}`, { method: "PATCH" });
    if (res.ok) {
      await loadItems(); // This will re-render and apply the .bought class
    }
  } catch (error) {
    console.error("Toggle failed", error);
  }
};

// --- 2. Submit Logic ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // FIX: You need the .value of the input, not the whole HTML element
  const formData = {
    item: document.getElementById("itemName").value,
    itemQty: Number(document.getElementById("itemQty").value),
  };

  const submitBtn = e.submitter || form.querySelector('button[type="submit"]');
  submitBtn.innerText = "Saving..";
  submitBtn.disabled = true;

  try {
    // FIX: Added 'await' before fetch
    const res = await fetch("/api/add-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      form.reset();
      await loadItems();
    }
  } catch (error) {
    alert("Critical server error.");
  } finally {
    submitBtn.innerText = "Add";
    submitBtn.disabled = false;
  }
});

window.deleteItem = async (id) => {
  if (!confirm("Are you sure?")) return; // Senior tip: Always ask before deleting!
  try {
    const res = await fetch(`/api/delete-item/${id}`, { method: "DELETE" });
    if (res.ok) {
      loadItems();
    }
  } catch (error) {
    console.error("Delete method failed");
  }
};

document.getElementById("searchInput").addEventListener("input", async (e) => {
  const term = e.target.value.toLowerCase();

  // Path A: Filter existing data in memory (Faster)
  // Path B: Fetch from your new /api/search?name=... route
  const res = await fetch(`/api/search?name=${term}`);
  const filteredData = await res.json();

  renderItems(filteredData); // Your function that clears and refills the listContainer
});

// Initial Run
loadItems();
