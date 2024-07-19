import Enquiry from '../models/enquiryModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all enquiries
 const getEnquiries = asyncHandler(async (req, res) => {
    const { status, keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;


    let query =  {} ;
    if (status) query.status = status;
    if(keyword){
        query = {
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } },
            ],
        };
    }
    const count = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
    .sort({ name: 1 })
    .limit(limit)
    .skip((page - 1) * limit);
    if (count === 0) {
        return res.status(404).json({ error: "No enquiries found" });
    }
    return res.status(200).json({
        message: "Enquiries retrieved successfully",
        page,
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        enquiries,
    });
});

// @desc    Create a new enquiry
 const createEnquiry = asyncHandler(async (req, res) => {
    const { name, email, mobile, message } = req.body;

    const enquiry = await Enquiry.create({ name, email, mobile, message });

    res.status(201).json({
        message: "Enquiry created successfully",
        enquiry,
    });
});

//@desc     Update an enquiry
 const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
        return res.status(404).json({ error: "Enquiry not found" });
    }
    const updatedEnq = await Enquiry.findByIdAndUpdate(id, {status: 'resolved'}, { new: true });
    res.status(200).json({
        message: "Enquiry updated successfully",
        enquiry: updatedEnq
    });
});

// @desc    Delete an enquiry
 const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) {
        return res.status(404).json({ error: "Enquiry not found" });
    }
    res.status(200).json({
        message: "Enquiry deleted successfully",
    });
});

// @desc    Get enquiry by id
 const getEnquiryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
        return res.status(404).json({ error: "Enquiry not found" });
    }
    res.status(200).json({
        message: "Enquiry retrieved successfully",
        enquiry,
    });
});



export { getEnquiries, createEnquiry, updateEnquiry, deleteEnquiry, getEnquiryById};