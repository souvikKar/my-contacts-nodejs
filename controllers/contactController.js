//middleware for handling exceptions inside of async express routes
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
    // res.send("Get all contacts");
    //res.json({ message: "Get all contacts" });
});


//@desc Create New contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    console.log("The request body is: ", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are required !");
    }


    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User dont have permission to update other user contacts");
    }

    res.status(201).json(contact);
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User dont have permission to delete other user contacts");
    }
    res.status(200).json(contact);
    // res.status(200).json({ message: `Get contacts for ${req.params.id}` });
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    res.status(200).json(updatedContact);
    // res.status(200).json({ message: `Update for ${req.params.id}` });
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findByIdAndRemove(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    // await Contact.remove();
    res.status(200).json(contact);

    // res.status(200).json({ message: `Delete for ${req.params.id}` });
});

module.exports = { getContacts, createContact, getContact, updateContact, deleteContact };