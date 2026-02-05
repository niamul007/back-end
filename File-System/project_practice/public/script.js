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
            <span class="${item.bought ? 'bought' : ''}">${item.itemName}</span>
            <small>x${item.itemQty}</small>
          </div>
          <button class="del-btn" onclick="window.deleteItem('${item.id}')">Delete</button>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

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

// Initial Run
loadItems();