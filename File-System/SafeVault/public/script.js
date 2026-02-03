// --- Elements ---
const debtForm = document.getElementById("debtForm");
const addBtn = document.getElementById("addBtn");
const tbody = document.getElementById("clientTableBody");

// --- 1. Load & Render Clients ---
export async function loadClients() {
    try {
        // NOTE: Path must match your server's app.use('/api', ...)
        const res = await fetch("/api/clients");
        if (!res.ok) throw new Error("Failed to fetch clients");

        const data = await res.json();
        renderTable(data);
        updateStats(data); // Senior move: Update the dashboard totals
    } catch (err) {
        console.error("Load Error:", err.message);
        alert("Could not load client list.");
    }
}

function renderTable(clients) {
    tbody.innerHTML = "";
    
    if (clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">No clients registered yet.</td></tr>';
        return;
    }

    clients.forEach((client) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${client.clientName}</td>
            <td>$${client.debtAmount}</td>
            <td>$${client.remainingBalance}</td>
            <td><span class="status-pill ${client.status === 'cleared' ? 'status-cleared' : 'status-active'}">${client.status}</span></td>
            <td class="action-btns">
                <button class="pay-btn" onclick="handlePayment('${client.id}')">Pay</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- 2. Registration Logic ---
debtForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect data
    const formData = {
        clientName: document.getElementById("clientName").value,
        debtAmount: Number(document.getElementById("debtAmount").value),
        initialAmount: Number(document.getElementById("initialPay").value)
    };

    // UI Loading State
    addBtn.innerText = "Saving...";
    addBtn.disabled = true;

    try {
        const res = await fetch("/api/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await res.json();

        if (res.ok) {
            debtForm.reset();
            await loadClients();
        } else {
            // This displays the error message from your Validator Middleware!
            alert(`Error: ${result.error}`);
        }
    } catch (err) {
        alert("Critical server error. Check your connection.");
    } finally {
        addBtn.innerText = "Register";
        addBtn.disabled = false;
    }
});

// --- 3. Dashboard Stats Logic ---
function updateStats(clients) {
    const totalOwed = clients.reduce((sum, c) => sum + c.remainingBalance, 0);
    const totalCollected = clients.reduce((sum, c) => sum + (c.debtAmount - c.remainingBalance), 0);
    
    document.getElementById("totalOwed").innerText = `$${totalOwed}`;
    document.getElementById("totalPaid").innerText = `$${totalCollected}`;
    document.getElementById("clientCount").innerText = clients.length;
}

// Initial Run
loadClients();