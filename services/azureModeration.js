//services/azureModeration.js
const axios = require('axios');
const fs = require('fs');

//analyze a local image file for adult, racy, and gory content using Azure Vision v3.2
async function moderateImage(filePath) {
    const imageData = fs.readFileSync(filePath);

    const endpoint = `${process.env.AZURE_ENDPOINT.replace(/\/+$/, '')}/vision/v3.2/analyze?visualFeatures=Adult`;

    const response = await axios.post(endpoint, imageData, {
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY,
            'Content-Type': 'application/octet-stream',
        }
    });

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
}

module.exports = { moderateImage };

