//services/azureModerateUrl.js
const axios = require('axios');
const { UnprocessableEntityError } = require('../utils/errors');

//analyze an image URL for adult, racy, and gory content using Azure Vision v3.2
async function moderateImageUrl(imageUrl) {
    const endpoint = `${process.env.AZURE_ENDPOINT.replace(/\/+$/, '')}/vision/v3.2/analyze?visualFeatures=Adult`;

    try {
        const response = await axios.post(
            endpoint,
            { url: imageUrl },
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY,
                    'Content-Type': 'application/json',
                }
            }
        );

        const adultResult = response.data.adult;

        return {
            isAdultContent: adultResult?.isAdultContent,
            isRacyContent: adultResult?.isRacyContent,
            isGoryContent: adultResult?.isGoryContent,
            adultScore: adultResult?.adultScore,
            racyScore: adultResult?.racyScore,
            goreScore: adultResult?.goreScore,
            usedFallback: false,
        };
    } catch (error) {
        console.warn('Azure moderation failed:', error?.response?.status, error?.message);
        throw new UnprocessableEntityError(
            'Failed to analyze image URL. Make sure the image is publicly accessible and in a supported format.'
        );
    }
}

module.exports = { moderateImageUrl };






