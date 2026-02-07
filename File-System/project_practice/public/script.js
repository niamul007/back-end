const form = document.getElementById("groceryForm");
const container = document.getElementById("listContainer");

// --- 1. The Unified "Chef" (Handles the HTML for BOTH search and load) ---
const renderItems = (data) => {
  const container = document.getElementById("listContainer");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = `<p class="no-results">No items found...</p>`;
    return;
  }

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item-row";

    // This is the "Full" HTML including your buttons and classes
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
};
// --- 1. Load & Render ---
async function loadItems() {
  try {
    const res = await fetch("/api/items");
    if (!res.ok) throw new Error("Failed to fetch items");
    const data = await res.json();
    renderItems(data); // Send data to the Chef
  } catch (err) {
    console.error("Load error:", err);
  }
}

window.editItem = async (id, buttonElement) => {
  const textSpan = document.getElementById(`text-${id}`);
  if (!textSpan) return;

  const originalTxt = textSpan.innerText;

  // FIX: Added onclick="event.stopPropagation()" to the input
  textSpan.innerHTML = `
    <input 
      type="text" 
      id="input-${id}" 
      value="${originalTxt}" 
      onclick="event.stopPropagation()" 
    >
  `;

  buttonElement.innerText = "Save";
  buttonElement.onclick = (e) => {
    e.stopPropagation(); // Senior move: stop bubbling on the Save button too
    window.saveData(id, buttonElement);
  };
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
  const term = e.target.value;
  try {
    const res = await fetch(`/api/search?name=${encodeURIComponent(term)}`);
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    renderItems(data); // Send filtered data to the SAME Chef
  } catch (err) {
    console.error("Search error:", err);
  }
});

// Initial Run
loadItems();
