import { S3DAO } from "../DAOInterfaces/S3DAO";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";

export class DynamoS3DAO implements S3DAO {
  private readonly BUCKET = "tweeter-userprofile-bucket";
  private readonly REGION = "us-east-1";

  async putImage(
    fileName: string,
    imageStringBase64Encoded: string,
  ): Promise<string> {
    // The base64 string sent from the client includes a data URI prefix
    // (e.g., "data:image/png;base64,") that needs to be removed before decoding.
    const cleanedImageString = imageStringBase64Encoded.replace(
      /^data:image\/\w+;base64,/,
      "",
    );

    const decodedImageBuffer: Buffer = Buffer.from(
      cleanedImageString,
      "base64",
    );
    const s3Params = {
      Bucket: this.BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
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
