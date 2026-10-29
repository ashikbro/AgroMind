const jwt = require('jsonwebtoken');
jest.mock('../models/User', () => ({ findOne: jest.fn() }));
const User = require('../models/User');
const { forgotPassword, generateToken } = require('./authController');

const originalSecret = process.env.JWT_SECRET;

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalSecret;
  }
});

test('generateToken rejects missing JWT secrets', () => {
  delete process.env.JWT_SECRET;
  const { generateToken } = require('./authController');
  expect(() => generateToken('user-1')).toThrow('JWT_SECRET must be configured');
});

test('generateToken signs tokens with the configured secret', () => {
  process.env.JWT_SECRET = 'test-secret';
  const { generateToken } = require('./authController');
  const token = generateToken('user-1');
  expect(jwt.verify(token, 'test-secret')).toMatchObject({ userId: 'user-1' });
});

test('forgotPassword never returns the raw reset token', async () => {
  const user = {
    save: jest.fn().mockResolvedValue(undefined),
  };
  User.findOne.mockResolvedValue(user);
  const response = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  await forgotPassword({ body: { email: 'user@example.com' } }, response);

  expect(response.json).toHaveBeenCalledWith({
    success: true,
    message: 'If the account exists, a password reset link will be sent.',
  });
  expect(response.json.mock.calls[0][0]).not.toHaveProperty('resetToken');
});

test('forgotPassword does not disclose whether an email exists', async () => {
  User.findOne.mockResolvedValue(null);
  const response = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  await forgotPassword({ body: { email: 'unknown@example.com' } }, response);

  expect(response.status).not.toHaveBeenCalled();
  expect(response.json).toHaveBeenCalledWith({
    success: true,
    message: 'If the account exists, a password reset link will be sent.',
  });
});
