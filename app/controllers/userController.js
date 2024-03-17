import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    // generate otp
    const OTP = "0123";
    try{
        console.log(req.body);
        // hashing the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // creating new user
        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword,
            otp: OTP,
        });
        // saving the user
        const result = await newUser.save();

        // sending otp to email


        console.log(result);
        res.status(200).json({
            result: result,
            message: "Acount opened successfully, waiting for otp confirmation"
        });

    }
    catch (err){
        console.log(err.message);
        res.status(500).json({
            error: err.message,
            message: "Signup failed",
        })
    }
};

// login
export const login = async (req, res) => {
    console.log(req.body);
    try{
        // find user's email
        const user = await User.find({
            email: req.body.email
        });

        if(user && user.length > 0){
            // check password comparing hashed password
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
            if(isValidPassword){
                // check idle
                if(user[0].status === 'active'){
                    // generate token
                    const token = jwt.sign({
                        username: user[0].userName,
                        userID:user[0]._id,
                        email: user[0].email,
                    }, process.env.JWT_SECRET, {
                        expiresIn: '1h',
                    });
                    // take to user's profile
                    res.status(200).json({
                        ...user[0],
                        access_token: token,
                        message: 'Login Successful'
                    });
                    console.log(token);
                }
                else {
                    throw new Error('OTP has not verified');
                }

            }
            else{
                res.status(401).json({
                    error: "Authentication failed"
                })
                console.log("Authentication failed");
            }
        }
        else{
            res.status(401).json({
                error: "Authentication failed"
            });
            console.log("Authentication failed");
        }
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({
            error: err.message,
            message: "Login Failed",
        });
    }
};

export const verifyOTP = async (req, res) => {
    try{
        // find user's email
        const user = await User.find({
            email: req.body.email
        });
        if(user && user.length > 0){
            // check password comparing hashed password
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
            if(isValidPassword){
                // update status to active
                User
                    .findByIdAndUpdate({
                        _id: user[0]._id,
                    },{
                        $set: {
                            status: "active"
                        }
                    },{
                        new: true,
                        useFindAndModify: false,
                    })
                    .then(result => {
                        console.log(result);
                        res.status(200).json({
                            result: result,
                            message: "Signup Successful"
                        });
                    })
                    .catch(err => {
                        console.log(err.message);
                        res.status(500).json({
                            error: "OTP validation unsuccessful"
                        });
                    });
            }
            else{
                res.status(401).json({
                    error: "Authentication failed"
                })
                console.log("Authentication failed");
            }
        }
        else{
            res.status(401).json({
                error: "Authentication failed"
            });
            console.log("Authentication failed");
        }
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({
            error: err.message,
            message: "Otp verification Failed",
        });
    }
}