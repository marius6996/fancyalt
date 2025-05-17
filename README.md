# FancyAlt: AI-Powered Image Analysis API 🌟

![FancyAlt](https://img.shields.io/badge/FancyAlt-API-brightgreen)

Welcome to **FancyAlt**, a full-stack AI-powered image analysis API. This project leverages Node.js, Express.js, Azure AI Vision, and OpenAI to provide an efficient solution for image uploads and public URLs. With FancyAlt, you can easily generate accessible alt-text, perform content moderation, and engage in creative storytelling through images.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

- **AI-Powered Analysis**: Utilize Azure AI Vision and OpenAI for advanced image processing.
- **Accessible Alt-Text**: Automatically generate alt-text for images, enhancing accessibility.
- **Content Moderation**: Ensure that uploaded images meet community standards.
- **Creative Storytelling**: Generate narratives based on image content.
- **Public URL Support**: Easily upload images and access them via public URLs.

## Getting Started

To get started with FancyAlt, you will need to clone the repository and set up your environment. 

1. Clone the repository:
   ```bash
   git clone https://github.com/marius6996/fancyalt.git
   cd fancyalt
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables. Create a `.env` file in the root directory and include your Azure AI Vision and OpenAI API keys.

4. Start the server:
   ```bash
   npm start
   ```

Now you can begin using the API!

## Installation

You can download the latest release of FancyAlt from the [Releases](https://github.com/marius6996/fancyalt/releases) section. Follow the instructions to execute the file after downloading.

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)
- Azure AI Vision API key
- OpenAI API key

## Usage

Once the server is running, you can interact with the API. Below are some example requests you can make.

### Uploading an Image

To upload an image, send a POST request to `/upload` with the image file.

```bash
curl -X POST http://localhost:3000/upload -F "image=@path/to/image.jpg"
```

### Generating Alt-Text

After uploading, you can generate alt-text for the image by sending a GET request to `/alt-text/{imageId}`.

```bash
curl -X GET http://localhost:3000/alt-text/{imageId}
```

### Content Moderation

To check if an image meets content standards, send a GET request to `/moderate/{imageId}`.

```bash
curl -X GET http://localhost:3000/moderate/{imageId}
```

## API Endpoints

| Endpoint                     | Method | Description                                   |
|------------------------------|--------|-----------------------------------------------|
| `/upload`                    | POST   | Upload an image for analysis.                 |
| `/alt-text/{imageId}`       | GET    | Get generated alt-text for the uploaded image. |
| `/moderate/{imageId}`       | GET    | Check if the image meets content standards.   |

## Contributing

We welcome contributions! If you would like to contribute to FancyAlt, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need assistance, please check the [Releases](https://github.com/marius6996/fancyalt/releases) section for updates. You can also open an issue in the repository for support.

![AI Image Analysis](https://example.com/ai-image-analysis.jpg)

Thank you for using FancyAlt! We hope you find it useful for your image analysis needs.