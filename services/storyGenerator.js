//services/storyGenerator.js
require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//generate a short, creative story based on image caption and tags
async function generateStory({ caption, tags }) {
    //prompt instructing the AI to generate a 2–3 sentence creative story
    const prompt = `You are an imaginative storyteller. Based on the following image description and tags, write a vivid, creative, but concise 2-3 sentence story that stays true to the content.

Description: "${caption}"
Tags: ${tags.join(', ')}

Story:`;

    try {
        const response = await openai.responses.create({
            model: "o4-mini",
            reasoning: { effort: "medium" },
            input: [
                {
                    role: 'user',
                    content: prompt,
                }
            ]
        });

        return response.output_text.trim();

    } catch (error) {
        console.error('o4-mini failed:', error.message);

        //check if the failure justifies falling back to a more powerful model
        const shouldFallback = error.status === 404 || error.status === 429 || error.status === 500;

        if (shouldFallback) {
            console.log('Falling back to gpt-4.1...');

            //fallback to GPT-4.1 model with adjusted parameters for creativity
            const fallbackResponse = await openai.chat.completions.create({
                model: "gpt-4.1",
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.85,
                max_tokens: 100,
            });

            //return the fallback story
            return fallbackResponse.choices[0].message.content.trim();
        } else {
            throw error;
        }
    }
}

module.exports = { generateStory };

