// config for cloudinary (image hosting site)
const cloudinary = require('cloudinary').v2;

/** 
 * @author github copilot
 * @description: Configures cloudinary with the api key, secret and cloud name
 * @returns: [Postcondition] Cloudinary is configured with the api key, secret and cloud name via env
 *  config was generated by AI copilot via cloudinary documentation but modified to use env variables for security
 */
cloudinary.config({
    // cloud_name: at env
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: at env
    api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: at env
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// export cloudinary
module.exports = cloudinary;

