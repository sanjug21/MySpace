const cloudinary = require('cloudinary').v2;
const Joi = require('joi');

const postSchemaJoi = Joi.object({
    pic: Joi.string().uri().required(),
    caption: Joi.string().allow(''),
    id: Joi.string().allow(null),
});

const validatePost = (req, res, next) => {
    const { error } = postSchemaJoi.validate(req.body);

    if (error) {
        const formattedError = error.details.map(detail => ({
            message: detail.message,
            field: detail.context.label || detail.context.key,
        }));
        return res.status(400).json({ errors: formattedError });
    }

    req.body.userId = req.user.userId;
    next();
};

const uploadToCloudinary = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        
        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
        });

        req.body.pic = result.secure_url;
        req.body.id = result.public_id;
        next();
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ error: 'Failed to upload file', details: error.message });
    }
};

const deleteFromCloudinary = async (id) => {
    try {
        const response = await cloudinary.uploader.destroy(id);
        return response;
    } catch (error) {
        console.error("Cloudinary deletion error:", error);
        throw error;
    }
};

module.exports = {
    validatePost,
    uploadToCloudinary,
    deleteFromCloudinary,
};