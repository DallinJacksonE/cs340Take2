import { S3DAO } from "../DAOInterfaces/S3DAO";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";

export class DynamoS3DAO implements S3DAO {
  private readonly BUCKET = "cs340-tweeter-profile-images-dj"; // Replace with your bucket name
  private readonly REGION = "us-west-1"; // Replace with your bucket region

  async putImage(
    fileName: string,
    imageStringBase64Encoded: string,
  ): Promise<string> {
    const decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64",
    );
    const s3Params = {
      Bucket: this.BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: this.REGION });
    try {
      await client.send(c);
      return `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
