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
            debtAmount: Number(debtAmount),    // Ensure it's a number!
            initialAmount: Number(initialAmount), 
            remainingBalance: Number(debtAmount) - Number(initialAmount),
            status: (Number(initialAmount) >= Number(debtAmount)) ? "cleared" : "active",
            createdAt: new Date().toISOString()
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