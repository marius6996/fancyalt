# ✨ FancyAlt

**Created by: Jill Platts**

FancyAlt is a creative AI-powered API for analyzing images and generating accessible, human-friendly alt-text captions, vivid storytelling, and content moderation.

Perfect for improving accessibility, storytelling, and visual content understanding.
---
## 📸 What FancyAlt Can Do

- 🖼️ Analyze uploaded images or public image URLs
- 📝 Generate short alt-text for accessibility
- 📖 Create creative 2–3 sentence stories based on the image
- 🚫 Moderate images for adult, racy, or gory content
- 🧹 Clean, beautiful API docs and front-end for easy testing
---
## 🚀 Features

- Built with **Azure AI Vision API** and **OpenAI API**
- Supports **file uploads** (`POST`) and **public image URLs** (`GET`)
- Images are moderated before any captions or stories are generated
- Manual dark mode toggle 🌗 and mobile-friendly front-end
- Full error handling and validation
- Swagger-powered API docs
---
## 🛠 Tech Stack

- **Backend:** Node.js, Express.js (v5)
- **Image Upload & Handling:** Multer
- **Image Analysis:** Azure AI Vision API (v3.2)
- **Story Generation:** OpenAI API (o4-mini, GPT-4.1 fallback)
- **Scheduling:** node-cron (for upload cleanup)
- **Frontend:** Bootstrap 5 (with dark mode toggle)
- **Documentation:** Swagger UI with YAML + custom styling
- **Security:** Helmet (CSP off), Rate Limiting, CORS (dev + prod), Input Sanitization
---
## 🔍 How It Works (API Usage)

FancyAlt combines the power of **Azure AI Vision** and **OpenAI** to deliver smart, creative, and accessible image analysis.

Azure capabilities are accessed through a single deployable resource:

- **Multiservice Cognitive Services**: Supports Vision **v3.2** features including image description, tags, and adult content moderation.

### Azure Vision API

FancyAlt uses Azure Vision **v3.2** to extract high-confidence image descriptions, semantic tags, and moderation scores.

- **Description**: Azure provides a short, human-readable caption summarizing the image.
- **Tags**: A list of relevant concepts detected in the image (e.g., objects, scenery, actions).
- **Moderation**: Adult, racy, and gory content scores are evaluated before further analysis.

The API supports both:
- Binary image uploads (`POST /generate-caption`)
- Public image URLs (`GET /analyze-url`)

> ✅ Every image is **always moderated first**, regardless of the selected output mode. This ensures content safety before any captions or stories are generated.

### OpenAI API

FancyAlt uses the **OpenAI API** for one mode:

- `storyCaption`: Creates creative 2–3 sentence stories based on Azure Vision's caption and tags

- Uses the lightweight `o4-mini` model by default
- Falls back to `gpt-4.1` if needed

> ✅ All OpenAI outputs are grounded in Azure Vision output.
---
## ⚙️ Installation

1. Clone the repo:
  ```
    git clone https://github.com/yourusername/fancyalt.git
    cd fancyalt
  ```
2. Install dependencies:
```
   npm install
```
3. Create a `.env` file in root:
```
AZURE_ENDPOINT=your-endpoint
AZURE_REGION=your-region
AZURE_KEY=your-key

OPENAI_API_KEY=your-openai-api-key
```
4. Start the server:
```
   npm start
```
5. Visit:
- Frontend: http://localhost:5000/
- API Docs: http://localhost:5000/docs

> 💡 FancyAlt only accepts image files in JPEG, PNG, or WEBP format for uploads.
---
## 📦 API Quick Overview

### Upload an Image
#### POST /api/generate-caption

  - image: image file (required)
  - mode: basicCaption, storyCaption, or moderateOnly

### Analyze a Public Image URL
#### GET /api/analyze-url?img={url}&mode={mode}

  - img: public image URL (required)
  - mode: urlAnalyze or urlModerate
---
## 🧪 API Modes Explained

| Mode            | What it Does                                              |
|-----------------|-----------------------------------------------------------|
| `basicCaption`  | Short alt-text caption (Azure Vision description)         |
| `storyCaption`  | Short alt-text + small story (Azure Vision + OpenAI)      |
| `moderateOnly`  | ONLY moderation check (adult/racy/gory content detection) |
| `urlAnalyze`    | Same as `basicCaption`, but for public URLs               |
| `urlModerate`   | Same as `moderateOnly`, but for public URLs               |
---
## 📊 Sample Response
#### Example of a successful API response when uploading an image for `basicCaption` mode:

```json
{
  "flagged": false,
  "moderation": {
    "isAdultContent": false,
    "isRacyContent": false,
    "isGoryContent": false,
    "adultScore": 0.00398498959839344,
    "racyScore": 0.01634090021252632,
    "goreScore": 0.0009480605367571115
  },
  "mode": "basicCaption",
  "caption": "a woman in a white dress",
  "tags": [
    { "name": "clothing", "confidence": 0.9953645467758179 },
    { "name": "person", "confidence": 0.9935345649719238 },
    { "name": "human face", "confidence": 0.9734236001968384 },
    { "name": "female person", "confidence": 0.9730096459388733 },
    { "name": "wedding dress", "confidence": 0.9693393111228943 },
    { "name": "lady", "confidence": 0.9644873142242432 },
    { "name": "bride", "confidence": 0.9532013535499573 },
    { "name": "embellishment", "confidence": 0.9497784376144409 },
    { "name": "fashion accessory", "confidence": 0.9264097213745117 },
    { "name": "woman", "confidence": 0.9227453470230103 },
    { "name": "wedding", "confidence": 0.917339026927948 },
    { "name": "dress", "confidence": 0.9169780611991882 },
    { "name": "makeover", "confidence": 0.8949828743934631 },
    { "name": "ivory", "confidence": 0.8900606632232666 },
    { "name": "gown", "confidence": 0.8875101804733276 },
    { "name": "headpiece", "confidence": 0.8802722692489624 },
    { "name": "haute couture", "confidence": 0.8744122385978699 },
    { "name": "indoor", "confidence": 0.867213785648346 },
    { "name": "smile", "confidence": 0.8636630177497864 },
    { "name": "bridal party dress", "confidence": 0.8449397683143616 },
    { "name": "photo shoot", "confidence": 0.8443934321403503 }
  ],
  "confidence": 0.4768536388874054,
  "usedFallback": true
}
```
---
## 🚨 Error Handling

FancyAlt uses a structured custom error system with consistent HTTP status codes and clear messages.

If something goes wrong (e.g., invalid input, file too large, missing parameters, or external API issues), the API responds with a descriptive JSON error like:

```
{
  "error": "Unprocessable Entity",
  "details": "Failed to process the provided image URL. Ensure it is publicly accessible and in a supported format."
}
```
### Common Error Codes

- **400 – Bad Request**  
  Missing or invalid input (e.g., no image uploaded or unsupported mode)

- **401 – Unauthorized**  
  Reserved for future use (e.g., when authentication is added)

- **403 – Forbidden**  
  The request is valid, but not allowed (e.g., restricted endpoint)

- **404 – Not Found**  
  The requested route or resource does not exist

- **413 – Payload Too Large**  
  File exceeds the 5MB upload limit

- **415 – Unsupported Media Type**  
  File type not accepted (only JPEG, PNG, WEBP)

- **422 – Unprocessable Entity**  
  Input could not be processed (e.g., inaccessible image URL or corrupt content)

- **500 – Internal Server Error**  
  Unexpected failure (e.g., Azure or OpenAI service error)
----
## 🔐 Security, Scalability, and Maintainability

FancyAlt was designed with modern best practices for API security, scalability, and long-term maintainability in mind:

### Security

- **Helmet:** Sets secure HTTP headers to reduce common web vulnerabilities (CSP disabled for development and Swagger compatibility).
- **Input Sanitization:** Custom middleware strips keys like `$` and `__proto__` from all incoming requests.
- **Rate Limiting:** Limits each IP to 25 requests per 15 minutes to prevent abuse.
- **CORS:** Accepts requests from `https://fancyalt.com`, `http://fancyalt.com`, `http://localhost:3000`, and `http://localhost:5000`.
- **Upload Rules:** Accepts only JPEG, PNG, or WEBP images up to 5MB.
- **URL Safety:** Invalid or unreachable public image URLs return a 422 error.
- **Content Moderation:** Every image is checked for adult, racy, or gory content before any captions or stories are generated.

### Scalability & Maintainability

- **Modular Middleware:** Separated for validation, sanitization, and async error handling.
- **Daily Upload Cleanup:** Cron job wipes `uploads/` every 24 hours.
- **Centralized Errors:** All exceptions are caught and formatted in one global handler.
- **Responsive UI:** Built with Bootstrap 5 and custom CSS for mobile support.
- **Themed Docs:** Swagger UI with branded styling and interactive testing.

---
## 📄 License

See the full license terms in the [LICENSE.txt](./LICENSE.txt) file.

---
## 📬 Contact

For questions or support, email: [fancyaltdotcom@gmail.com](mailto:fancyaltdotcom@gmail.com)
