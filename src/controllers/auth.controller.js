import logger from "#config/logger.js";
import {signUpSchema, signInSchema} from "#validations/auth.validation.js";
import {formatValidationError} from "#utils/format.js";
import {createUser, authenticateUser} from "#services/auth.service.js";
import {jwttoken} from "#utils/jwt.js";
import {cookies} from "#utils/cookies.js";

export const signup = async (req, res, next) => {
    try {

        // Validation of user data with Zod User Schema
        const validationResult = signUpSchema.safeParse(req.body);

        if(!validationResult.success) {
            return res.status(400).json({
                error: 'Validation Failed',
                details: formatValidationError(validationResult.error)
            });
        }

        const  { name, email, password, role} = validationResult.data;

        // Creating user in database
        const user = await createUser({name, email, password, role});

        // Creating the JWT Token with user details
        const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

        // Setting Cookies
        cookies.set(res, 'token', token);

        logger.info(`User Registered Successfully: ${email}`)

        res.status(201).json({
            message: 'User Registered',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    }
    catch(err) {
        logger.error('Signup error',err);

        if(err.message === 'User with this email already exists')
        {
            return res.status(409).json({error: 'Email already exists'});
        }

        next(err);
    }
}

export const signin = async (req, res, next) => {
    try {
        // Validation of user data with Zod Sign In Schema
        const validationResult = signInSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation Failed',
                details: formatValidationError(validationResult.error)
            });
        }

        const { email, password } = validationResult.data;

        // Authenticate user
        const user = await authenticateUser({ email, password });

        // Creating the JWT Token with user details
        const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

        // Setting Cookies
        cookies.set(res, 'token', token);

        logger.info(`User Signed In Successfully: ${email}`);

        res.status(200).json({
            message: 'Sign In Successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    }
    catch (err) {
        logger.error('Signin error', err);

        if (err.message === 'User not found') {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (err.message === 'Invalid password') {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        next(err);
    }
}

export const signout = async (req, res, next) => {
    try {
        // Clear the authentication cookie
        cookies.clear(res, 'token');

        logger.info('User Signed Out Successfully');

        res.status(200).json({
            message: 'Sign Out Successful'
        });

    }
    catch (err) {
        logger.error('Signout error', err);
        next(err);
    }
}
