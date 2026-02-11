const catchAsync = (fn) => {
    return (req, res, next) => {
        // This is the magic: it catches any 'rejected' promise and sends it to the Manager
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;