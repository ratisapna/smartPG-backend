import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Generate a pre-signed URL for uploading a file to S3
 * @param {string} fileName - Original file name
 * @param {string} fileType - MIME type of the file
 * @returns {Promise<{uploadUrl: string, key: string}>}
 */
export const getUploadPresignedUrl = async (fileName, fileType) => {
  const key = `uploads/${Date.now()}-${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  
  return { uploadUrl, key };
};

/**
 * Generate a pre-signed URL for reading a file from S3 (optional if bucket is private)
 * @param {string} key - S3 object key
 * @returns {Promise<string>}
 */
export const getReadPresignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
