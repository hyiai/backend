const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const multer = require('multer');
const sharp = require('sharp');

// Create an S3 client
const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

// Configure Multer for file upload handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file to S3 (Generalized for both profile pictures and resumes)
const uploadFileToS3 = async (file, folderName) => {
  const fileName = `${Date.now()}_${file.originalname}`;
  const params = {
    Bucket: 'hyvadata',
    Key: `${folderName}${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://hyvadata.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${folderName}${fileName}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('S3 Upload Failed');
  }
};

// Function to delete file from S3
const deleteFileFromS3 = async (fileUrl, folderName) => {
  const fileName = fileUrl.split('/').pop(); // Extract file name from the URL

  const params = {
    Bucket: 'hyvadata',
    Key: `${folderName}${fileName}`, // Full path in the bucket
  };

  try {
    await s3.send(new DeleteObjectCommand(params)); // Use DeleteObjectCommand to delete the file
    console.log(`Successfully deleted file: ${fileName}`);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error(`Failed to delete file from folder: ${folderName}`);
  }
};

// Function to process and upload image in different sizes
const processAndUploadImage = async (file, folderName, fullName) => {
  try {
    const baseFolder = `${folderName}${fullName}/`;
    const sizes = [
      { name: 'original', dimensions: null },
      { name: 'thumbnail', dimensions: { width: 50, height: 50 } },
      { name: 'small', dimensions: { width: 150, height: 150 } },
      { name: 'medium', dimensions: { width: 300, height: 300 } },
      { name: 'large', dimensions: { width: 600, height: 600 } },
    ];

    const uploadPromises = sizes.map(async (size) => {
      const folderPath = `${baseFolder}${size.name}/`;
      const fileName = `${file.originalname}`;

      // Resize the image if dimensions are specified
      const buffer =
        size.dimensions !== null
          ? await sharp(file.buffer).resize(size.dimensions).toBuffer()
          : file.buffer;

      // Upload to S3
      const params = {
        Bucket: 'hyvadata',
        Key: `${folderPath}${fileName}`,
        Body: buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);

      return `https://hyvadata.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${folderPath}${fileName}`;
    });

    // Resolve all upload promises and return URLs
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error processing and uploading images:', error);
    throw new Error('Image processing or upload failed');
  }
};

module.exports = {
  upload,
  uploadFileToS3,
  deleteFileFromS3,
  processAndUploadImage,
};
