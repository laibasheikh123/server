require('dotenv').config();
const express = require('express');
const { connect } = require('mongoose');
const { hash, compare } = require('bcrypt');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { sign } = require('jsonwebtoken');
const UserSchema = require('../schema/users');

const signup = async (req, res) => {
    const { username, email, password, gender } = req.body;


    if (username && email && password && gender) {
        try {
            await connect(process.env.MONGO_URI);
            const checkUser = await UserSchema.exists({ email });

            if (!checkUser) {
                const user = await UserSchema.create({ username, email, gender, password: await hash(password, 16) });
                res.status(201).json({ message: "User Created Successfully"});
            }

            else {
                res.json({ message: "User already exists" });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }


    }
    else {
        res.status(403).json({ message: "Required Field Missing" });
    }
};

const user = (req, res) => {
    res.send("Hello I am " + req.body.username);
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        try {
            await connect(process.env.MONGO_URI);
            const checkUser = await UserSchema.findOne({ email });
            if (checkUser) {
                const decryptpass = await compare(password, checkUser.password);
                if (decryptpass && email === checkUser.email) {
                    const token = sign(
                        {
                            name: checkUser.username,
                            email: checkUser.email,
                            gender: checkUser.gender,
                        },
                        process.env.JWT_SECRET
                    );

                    res.json({
                        message: "Successfully Login",
                        token,
                    });
                } else {
                    res.status(400).json({ message: "Incorrect Password" });
                }
            } else {
                res.status(404).json({ message: "User Not Found" });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        res.status(400).json({ message: "Required Field Missing" });
    }
};

const userByEmail = async (req, res) => {
    const { email } = req.query;

    try {
        await connect(process.env.MONGO_URI);
        const user = await UserSchema.findOne({ email: email });
        res.json({ user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const all_users = async (req, res) => {
    try {
        await connect(process.env.MONGO_URI);
        const all_users = await UserSchema.find();
        res.status(201).json({ users: all_users });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const userByID = async (req, res) => {
    const { id } = req.params;

    try {
        await connect(process.env.MONGO_URI);
        const user = await UserSchema.findOne({ _id: id });
        res.json({ user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { email, username, profile_pic, gender } = req.body;

    try {
        const filter = { email };
        const update = { username, profile_pic, gender };
        await connect(process.env.MONGO_URI);
        const doc = await UserSchema.findOneAndUpdate(filter, update, {
            new: true,
        });

        res.json({ user: doc, message: "Profile Updated Successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await connect(process.env.MONGO_URI);
        const deleteUser = await UserSchema.findOneAndDelete({ email: req.body.email });
        const updatedUsers = await UserSchema.find();
        res.json({
            message: "Successfully Deleted",
            users: updatedUsers,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const newletter = async (req, res) => {
    const { email } = req.body;

    const config = {
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    };

    const transporter = nodemailer.createTransport(config);

    var mailGenerator = new Mailgen({
        theme: 'salted',
        product: {
            name: 'Fast NUCES',
            link: 'https://www.nu.edu.pk/',
            logo: 'https://khi.nu.edu.pk/wp-content/uploads/2023/01/FAST-NU-logo.png',
        },
    });

    var emailDetails = {
        body: {
            name: 'User',
            intro: 'Thanks for Subscribing us, you will get all the updates on your email',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
            table: {
                data: [
                    {
                        name: "laiba",
                        email: "hello123@gmail.com",
                    },
                    {
                        name: "esha",
                        email: "esha@gmail.com",
                    },
                ],
            },
            action: [
                {
                    instructions: 'To get started with Mailgen, please click here:',
                    button: {
                        color: '#22BC66',
                        text: 'Confirm your account',
                        link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010',
                        fallback: true,
                    },
                },
                {
                    instructions: 'To read our frequently asked questions, please click here:',
                    button: {
                        text: 'Read our FAQ',
                        link: 'https://mailgen.js/faq',
                        fallback: {
                            text: 'This is my custom text for fallback',
                        },
                    },
                },
            ],
        },
    };

    var emailBody = mailGenerator.generate(emailDetails);

    if (!email) {
        res.status(404).json({ message: "Email Required" });
    } else {
        try {
            const emailText = {
                from: process.env.NODEMAILER_EMAIL,
                to: email,
                subject: "Thanks for Subscribing to Us",
                html: emailBody,
            };
            const info = await transporter.sendMail(emailText);
            res.json({ message: "EMAIL SENT SUCCESSFULLY" });
        } catch (error) {
            res.json({ message: error.message });
        }
    }
};

module.exports = {
    newletter,
    user,
    all_users,
    login,
    signup,
    userByEmail,
    userByID,
    updateProfile,
    deleteUser,
};
