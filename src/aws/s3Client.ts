import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: "us-east-2",
    credentials: {
        accessKeyId: process.env._AWS_ACCESS_KEY || "",
        secretAccessKey: process.env._AWS_SECRET_ACCESS_KEY || "",
    },
});
