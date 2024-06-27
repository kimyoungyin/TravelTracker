import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET as string,
    },
});

export default s3;
