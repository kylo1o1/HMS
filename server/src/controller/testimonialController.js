const Testimonial = require("../model/testimonialModel");

exports.getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            status: 200,
             testimonials
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Failed to retrieve testimonials',
            error: err.message
        });
    }
};

exports.createTestimonial = async (req, res) => {
    try {
        const { name, position, message, rating } = req.body;
        
        if (!name || !position || !message || !rating) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Missing required fields: name, position, message, rating'
            });
        }

        const newTestimonial = new Testimonial({ name, position, message, rating });
        const savedTestimonial = await newTestimonial.save();

        res.status(201).json({
            success: true,
            status: 201,
             savedTestimonial
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            status: 400,
            message: 'Failed to create testimonial',
            error: err.message
        });
    }
};

exports.getTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: 'Testimonial not found'
            });
        }
        res.status(200).json({
            success: true,
            status: 200,
            testimonial
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Failed to retrieve testimonial',
            error: err.message
        });
    }
};

exports.updateTestimonial = async (req, res) => {
    try {
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedTestimonial) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: 'Testimonial not found'
            });
        }
        
        res.status(200).json({
            success: true,
            status: 200,
             updatedTestimonial
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            status: 400,
            message: 'Failed to update testimonial',
            error: err.message
        });
    }
};

exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: 'Testimonial not found'
            });
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: 'Testimonial deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Failed to delete testimonial',
            error: err.message
        });
    }
};