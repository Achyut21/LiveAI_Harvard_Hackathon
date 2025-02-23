import userStorage from "../models/userstorage.models.js";
import userBill from "../models/userbills.models.js";
//import { use } from "react";

export const add_user = async (req, res) => {
    try {
        const { address, magicAPT } = req.body;
        const existingUser = await userStorage.findOne({ address });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new userStorage({ address, magicAPT });
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const update_user = async (req, res) => {
    try {
        const { address, magicAPT } = req.body;
        console.log(address, magicAPT);
        const user = await userStorage.findOne({ address });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.magicAPT = magicAPT;
        await user.save();
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const get_user = async (req, res) => {
    try {
        const { address } = req.body;
        const user = await userStorage.findOne({
            address
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const add_bill = async (req, res) => {
    try{
        const { address, merchant, magicAPTEarned } = req.body;
        const bill = new userBill({ address, merchant, magicAPTEarned });
        await bill.save();
        res.status(201).json(bill);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const get_bills = async (req, res) => {
    try {
        const { address } = req.body;
        const bills = await userBill.find({ address });
        if (!bills) {
            return res.status(404).json({ message: "Bill not found" });
        }
        res.json(bills);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const transfer = async (req, res) => {
    try {
        const { address, amount, receiverAddress } = req.body;
        console.log(address, amount, receiverAddress);
        const user = await userStorage.findOne({address});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.magicAPT < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        var num1 = parseInt(user.magicAPT,10);
        num1 -= amount;
        user.magicAPT = String(num1);
        await user.save();
        const receiver = await userStorage.findOne({address: receiverAddress});
        console.log(receiver);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }
        var num2 = parseInt(receiver.magicAPT,10);
        num2 += amount;
        receiver.magicAPT = String(num2);
        await receiver.save();
        res.json({ message: "Transfer successful" });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}