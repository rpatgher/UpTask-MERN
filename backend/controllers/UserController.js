import User from '../models/User.js';
import generateToken from '../helpers/generateToken.js';
import generateJWT from '../helpers/generateJWT.js';
import { emailRegistration, emailResetPassword } from '../helpers/emails.js';

const register = async (req, res) => {
    const {email} = req.body;
    const userExists = await User.findOne({email});
    if (userExists) {
        const error = new Error('User already exists');
        return res.status(400).json({msg: error.message});
    }

    try {
        const user = new User(req.body);
        user.token = generateToken();
        await user.save();
        await emailRegistration({
            name: user.name,
            email: user.email,
            token: user.token
        });
        res.json({msg: 'Registered successfully, please confirm your email'});
    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        const error = new Error('User does not exist');
        return res.status(404).json({msg: error.message});
    }
    if (!user.confirmed) {
        const error = new Error('User is not confirmed');
        return res.status(403).json({msg: error.message});
    }
    if(await user.validPassword(password)){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user._id)
        });
    }else{
        const error = new Error('Password is not valid');
        return res.status(403).json({msg: error.message});
    }
}

const confirm = async (req, res) => {
    const { token } = req.params;
    const confirmUser = await User.findOne({ token });
    if( !confirmUser ){
        const error = new Error('Token is not valid');
        return res.status(404).json({msg: error.message});
    }
    try {
        confirmUser.confirmed = true;
        confirmUser.token = '';
        await confirmUser.save();
        res.json({msg: 'User confirmed'});
    } catch (error) {
        console.log(error);
    }
}

const forgotPassword = async (req,res) => {
    const { email } = req.body;
    const user = await User.findOne({email});
    if (!user) {
        const error = new Error('User does not exist');
        return res.status(404).json({msg: error.message});
    }
    try {
        user.token = generateToken();
        await user.save();
        emailResetPassword({
            name: user.name,
            email: user.email,
            token: user.token
        });
        res.json({msg: "We've sent you an email to reset your password"});
    } catch (error) {
        console.log(error);
    }

}

const validateToken = async (req,res) => {
    const { token } = req.params;
    const validToken = await User.findOne({token});
    if (!validToken) {
        const error = new Error('Token is not valid');
        return res.status(404).json({msg: error.message});
    }
    res.json({msg: 'Token is valid and user exists'});
}

const resetPassword = async (req,res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({token});
    if (!user) {
        const error = new Error('Token is not valid');
        return res.status(404).json({msg: error.message});
    }
    user.password = password;
    user.token = '';
    try {
        await user.save();
        res.json({msg: 'Password Reset Successfully'});
    } catch (error) {
        console.log(error);
    }
}

const profile = async (req,res) => {
    const { user } = req;
    res.json(user);
}

export {
    register,
    login,
    confirm,
    forgotPassword,
    validateToken,
    resetPassword,
    profile
}