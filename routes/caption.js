//routes/caption.js
//handles image uploads and URLs to generate captions, stories, and content moderation
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { body, query } = require('express-validator');

const { analyzeImage } = require('../services/azureVision');
const { generateStory } = require('../services/storyGenerator');
const { moderateImage } = require('../services/azureModeration');
const { moderateImageUrl } = require('../services/azureModerateUrl');
const { analyzeImageUrl } = require('../services/azureAnalyzeUrl');
const { BadRequestError } = require('../utils/errors');
const { UnsupportedMediaTypeError } = require('../utils/errors');
const { UnprocessableEntityError } = require('../utils/errors');
const validate = require('../middlewares/validate');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

//multer configuration to allow only image files up to 5MB to be uploaded
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new UnsupportedMediaTypeError('Only JPEG, PNG, and WEBP image files are allowed.'));
        }
    }
});

//POST route to generate captions, stories, or moderate content
router.post(
    '/generate-caption',
    upload.single('image'),
    body('mode').optional().isIn(['basicCaption', 'storyCaption', 'moderateOnly']),
    validate,
    asyncHandler(async (req, res) => {
        const mode = req.body.mode || 'basicCaption';

        if (!req.file) {
            throw new BadRequestError('Image file is required.');
        }

        const filePath = req.file.path;
        const moderationResult = await moderateImage(filePath); //always moderate first

        let result;

        if (mode === 'moderateOnly') {
            fs.unlinkSync(filePath);
            return res.json({
                mode: 'moderateOnly',
                moderation: moderationResult,
            });
        } else if (mode === 'basicCaption') {
            const visionResult = await analyzeImage(filePath);
            result = { mode, ...visionResult };
        } else if (mode === 'storyCaption') {
            const visionResult = await analyzeImage(filePath);
            const story = await generateStory(visionResult);
            result = { mode, ...visionResult, story };
        } else {
            fs.unlinkSync(filePath);
            throw new BadRequestError('Invalid mode selected.');
        }

        fs.unlinkSync(filePath);

        return res.json({
            flagged:
                moderationResult.adultScore > 0.7 ||
                moderationResult.racyScore > 0.7 ||
                moderationResult.goreScore > 0.7,
            moderation: moderationResult,
            ...result,
        });
    })
);

//GET route to analyze a public image URL based on mode
router.get(
    '/analyze-url',
    query('img').isURL(),
    query('mode').isIn(['urlAnalyze', 'urlModerate']),
    validate,
    asyncHandler(async (req, res) => {
        const imageUrl = req.query.img;
        const mode = req.query.mode || 'urlAnalyze';

        let result;

        try {
            if (mode === 'urlModerate') {
                const moderationResult = await moderateImageUrl(imageUrl);
                const flagged =
                    moderationResult.adultScore > 0.7 ||
                    moderationResult.racyScore > 0.7 ||
                    moderationResult.goreScore > 0.7;

                result = {
                    mode,
                    flagged,
                    moderation: moderationResult,
                    imageUrl,
                };
            } else if (mode === 'urlAnalyze') {
                const analysisResult = await analyzeImageUrl(imageUrl);
                result = {
                    mode,
                    imageUrl,
                    ...analysisResult,
                };
            } else {
                throw new BadRequestError('Invalid mode selected.');
            }

            return res.json(result);
        } catch (err) {
            console.error('Failed to process image URL:', err.message);
            throw new UnprocessableEntityError(
                'Failed to process the provided image URL. Ensure it is publicly accessible and in a supported format.'
            );
        }
    })
);

module.exports = router;



