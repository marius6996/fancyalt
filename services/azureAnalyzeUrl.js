//services/azureAnalyzeUrl.js
const axios = require('axios');
const { UnprocessableEntityError } = require('../utils/errors');

//analyze an image URL using Azure Vision v3.2 (multiservice endpoint)
async function analyzeImageUrl(imageUrl) {
    const endpoint = `${process.env.AZURE_ENDPOINT.replace(/\/+$/, '')}/vision/v3.2/analyze?visualFeatures=Description,Tags`;

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

        const { description, tags } = response.data;

        //return a normalized result object
        return {
            caption: description?.captions?.[0]?.text || 'No caption found',
            tags: tags || [],
            confidence: description?.captions?.[0]?.confidence || null,
            usedFallback: false,
        };
    } catch (err) {
        console.warn('Azure analyzeImageUrl failed:', err?.response?.status, err?.message);
        throw new UnprocessableEntityError('Failed to analyze the image URL. Make sure it is public, accessible, and points to a valid image.');
    }
}

module.exports = { analyzeImageUrl };





