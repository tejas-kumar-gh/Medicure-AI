import { body, validationResult } from 'express-validator';

// Helper to run validations and return errors
export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

export const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
];

export const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const profileValidationRules = [
  body('age')
    .isInt({ min: 1, max: 120 })
    .withMessage('Age must be a valid integer between 1 and 120'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('weight')
    .isFloat({ min: 1, max: 500 })
    .withMessage('Weight must be a number in kg (between 1 and 500)'),
  body('height')
    .isFloat({ min: 10, max: 300 })
    .withMessage('Height must be a number in cm (between 10 and 300)'),
  body('activityLevel')
    .isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active'])
    .withMessage('Invalid activity level selection'),
  body('fitnessGoal')
    .isIn(['weight_loss', 'weight_gain', 'muscle_building', 'general_fitness'])
    .withMessage('Invalid fitness goal selection'),
];
