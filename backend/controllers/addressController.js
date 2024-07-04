import Address from '../models/addressModel.js';
import asyncHandler from 'express-async-handler';

const createAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const existingAddress = await Address.findOne({ user: _id });
        if (!existingAddress) {
            const newAddress = {
                recipientName: req.body.recipientName,
               country: req.body.country,
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                landmark: req.body?.landmark || " ",
                recipientMobile: req.body.recipientMobile,
                user: _id,
            };

            const address = await Address.create(newAddress);
            res.status(201).json({
                message: "Address created",
                data: address,
            });
        } else {
            const updatedAddress = {
                recipientName: req.body.recipientName,
               country: req.body.country,
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                landmark: req.body?.landmark || " ",
                recipientMobile: req.body.recipientMobile,
                user: _id,
            };
            const address = await Address.findOneAndUpdate(
                { user: _id },
                updatedAddress,
                { new: true }
            );
            res.status(201).json({
                message: "Address Updated",
                data: address,
            });
        }
});

const getAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const address = await Address.findOne({ user: _id });
    if (!address) {
        return res.status(404).json({error: "No address found"});
    }
    return res.status(200).json({
        message: "Success",
        address,
    });
});

export { createAddress, getAddress };