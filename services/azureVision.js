//services/azureVision.js
const axios = require('axios');
const fs = require('fs');

//analyze an image file to generate caption and tags using Azure Vision v3.2
async function analyzeImage(filePath) {
    const imageData = fs.readFileSync(filePath);

    const endpoint = `${process.env.AZURE_ENDPOINT.replace(/\/+$/, '')}/vision/v3.2/analyze?visualFeatures=Description,Tags`;

    const response = await axios.post(endpoint, imageData, {
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY,
            'Content-Type': 'application/octet-stream',
        }
    });

    const { description, tags } = response.data;

    return {
        caption: description?.captions?.[0]?.text || 'No caption found',
        tags: tags || [],
        confidence: description?.captions?.[0]?.confidence || null,
        usedFallback: false,
    };
}

module.exports = { analyzeImage };


