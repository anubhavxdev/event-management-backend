const catchAsync = require('../../utils/catchAsync');
const authService = require('./auth.service');

exports.register = catchAsync(async (req, res) => {
    const { name, email, password, role } = req.body;

    const result = await authService.register({
        name,
        email,
        password,
        role,
    });
    res.status(201).json({
        status: 'success',
        data: result,
    });
});

exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });
    res.status(200).json({
        status: 'success',
        data: result,
    });
});