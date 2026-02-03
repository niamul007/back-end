// src/middleware/validator.mjs

export const validateClient = (req, res, next) => {
    const { clientName, debtAmount, initialAmount } = req.body;

    // 1. Check if all fields exist
    if (clientName === undefined || debtAmount === undefined || initialAmount === undefined) {
        return res.status(400).json({ error: "Missing required fields: clientName, debtAmount, and initialAmount are all required." });
    }

    // 2. Validate clientName (must be a string and not empty)
    if (typeof clientName !== 'string' || clientName.trim().length < 2) {
        return res.status(400).json({ error: "Client Name must be at least 2 characters long." });
    }

    // 3. Validate debtAmount (must be a positive number)
    if (isNaN(debtAmount) || Number(debtAmount) <= 0) {
        return res.status(400).json({ error: "Total Debt must be a number greater than 0." });
    }

    // 4. Validate initialAmount (cannot be negative or more than the debt)
    if (isNaN(initialAmount) || Number(initialAmount) < 0) {
        return res.status(400).json({ error: "Initial Payment cannot be negative." });
    }

    if (Number(initialAmount) > Number(debtAmount)) {
        return res.status(400).json({ error: "Initial Payment cannot be greater than the Total Debt." });
    }

    // 5. IF EVERYTHING IS OK: Call next()
    // This tells Express to move to the Controller
    next();
};