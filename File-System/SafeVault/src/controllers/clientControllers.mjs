import { getAllClients, updateClientsFile } from "../models/clientModel.mjs";
import crypto from "crypto";

export const getClients = async (req, res) => {
  try {
    const clients = await getAllClients();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch clients" });
  }
};

export const addClient = async (req, res) => {
  const { clientName, debtAmount, initialAmount } = req.body;

  try {
    const clients = await getAllClients();

    const newClient = {
      id: crypto.randomUUID(),
      clientName,
      debtAmount: Number(debtAmount), // Ensure it's a number!
      initialAmount: Number(initialAmount),
      remainingBalance: Number(debtAmount) - Number(initialAmount),
      status:
        Number(initialAmount) >= Number(debtAmount) ? "cleared" : "active",
      createdAt: new Date().toISOString(),
    };

    clients.push(newClient);
    await updateClientsFile(clients);

    // SUCCESS: Send 201
    res.status(201).json(newClient);
  } catch (error) {
    // FAILURE: Send 500
    res.status(500).json({ error: "Failed to save client to database" });
  }
};

export const updatePayment = async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body; // Getting the dynamic amount from the frontend

    try {
        const clients = await getAllClients();
        const client = clients.find(c => c.id === id);

        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        // --- Senior Logic: Don't let them pay more than they owe ---
        if (amount > client.remainingBalance) {
            return res.status(400).json({ error: "Payment exceeds remaining balance" });
        }

        // Apply the payment
        client.remainingBalance -= amount;
        client.initialAmount += amount; // Tracking total paid

        if (client.remainingBalance === 0) {
            client.status = "cleared";
        }

        await updateClientsFile(clients);
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};