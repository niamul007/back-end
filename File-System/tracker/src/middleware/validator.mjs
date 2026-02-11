export const validate = (Schema) => (req, res, next) => {
    // We parse specifically the body against the schema
    const result = Schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            status: 'fail',
            errors: result.error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message
            }))
        });
    }

    // Replace req.body with the cleaned/validated data
    req.body = result.data;
    next();
};