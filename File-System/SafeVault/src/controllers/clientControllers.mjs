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
  const { id } = req.params; // The ID comes from the URL
  const paymentAmount = 50; // Let's hardcode $50 for now

  try {
    const clients = await getAllClients();

    // --- YOUR TURN: Find the client ---
    // Hint: Use .find() to find the client where client.id === id
    const client = clients.find((c) => c.id === id);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // --- YOUR TURN: Update the math ---
    // 1. Subtract paymentAmount from client.remainingBalance
    // 2. Add paymentAmount to client.initialAmount (total paid)
    // 3. If remainingBalance <= 0, set client.status = "cleared"

    /* WRITE YOUR MATH HERE */
    client.remainingBalance -= paymentAmount;
    client.initialAmount += paymentAmount;

    if (client.remainingBalance <= 0) {
      client.status = "cleared";
      client.remainingBalance = 0; // The "Floor": ensures no negative debt
    }

    await updateClientsFile(clients);
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};
