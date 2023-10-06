import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import * as fs from 'fs';
import * as path from 'path';


const CLIENT_ID = process.env.BACKEND_CLIENT_ID;
const CLIENT_SECRET = process.env.BACKEND_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error. In order to authenticate against Leia Media Cloud' +
    ' API, you need to provide BACKEND_CLIENT_ID and BACKEND_CLIENT_SECRET ' +
    'env vars');
  process.exit(1);
}

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || '';
const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION
  || 'us-east-1';

if (!S3_BUCKET_NAME || !S3_BUCKET_REGION) {
  console.error('Error. In order to use Leia Media Cloud API, you need to' +
    ' provide S3_BUCKET_NAME and S3_BUCKET_REGION env ' +
    'vars');
  process.exit(1);
}

const MEDIA_CLOUD_REST_API_BASE_URL = 'https://api.leiapix.com';
const LEIA_LOGIN_OPENID_TOKEN_URL = 'https://auth.leialoft.com/auth/realms/leialoft/protocol/openid-connect/token';

const readImageUrlFromFile = () => {
  try {
    const content = fs.readFileSync(path.join('./src/data/', 'imageData.json'), 'utf8');
    const data = JSON.parse(content);
    return data.imageUrl || '';
  } catch (err) {
    console.warn('Error reading from imageData.json:', err);
    return '';
  }
};

const imageUrlFromFile = readImageUrlFromFile();
console.log(imageUrlFromFile);

const ORIGINAL_IMAGE_URL = imageUrlFromFile

const TWENTY_FOUR_HRS_IN_S = 24 * 60 * 60;
const THREE_MIN_IN_MS = 3 * 60 * 1000;

const S3_DISPARITY_MAP_PATH = 'public/leiapixcloud/disparity.jpg';
const S3_MP4_PATH = 'public/leiapixcloud/animation.mp4';

const awsClient = new S3Client({
  region: S3_BUCKET_REGION,
  credentials: defaultProvider(),
});

(async () => {
  try {
    console.log('Acquiring access token from LeiaLogin...');

    const tokenResponse = await axios.post(LEIA_LOGIN_OPENID_TOKEN_URL, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials',
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: THREE_MIN_IN_MS,
    });

    const accessToken = tokenResponse.data.access_token;

    console.log(`\nLeiaLogin AccessToken acquired: ${accessToken}`);

    let correlationId = uuidv4();

    const putDisparityCommand = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: S3_DISPARITY_MAP_PATH
    });
    const putDisparityPresignedUrl = await getSignedUrl(
      awsClient,
      putDisparityCommand,
      { expiresIn: TWENTY_FOUR_HRS_IN_S },
    );

    console.log(`\nGenerating Disparity: ${correlationId}...`);

  
    await axios.post(`${MEDIA_CLOUD_REST_API_BASE_URL}/api/v1/disparity`, {
      correlationId,
      inputImageUrl: ORIGINAL_IMAGE_URL,
      resultPresignedUrl: putDisparityPresignedUrl
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      timeout: THREE_MIN_IN_MS,
    });

    const getDisparityCommand = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: S3_DISPARITY_MAP_PATH
    });
    const getDisparityPresignedUrl = await getSignedUrl(
      awsClient,
      getDisparityCommand, { expiresIn: TWENTY_FOUR_HRS_IN_S },
    );

    console.log('\nDisparity has been uploaded to specified AWS S3 bucket.');

    correlationId = uuidv4();

    const putMP4Command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: S3_MP4_PATH
    });
    const putMP4PresignedUrl = await getSignedUrl(
      awsClient,
      putMP4Command,
      { expiresIn: TWENTY_FOUR_HRS_IN_S },
    );

    console.log(`\nGenerating mp4 animation: ${correlationId}...`);

    function writeUrlToFile(url: string) {
      const filePath = path.join(__dirname, '../src/data', 'mp4PresignedUrl.json');
      const data = {
          presignedUrl: url
      };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

    await axios.post(`${MEDIA_CLOUD_REST_API_BASE_URL}/api/v1/animation`, {
      correlationId,
      inputImageUrl: ORIGINAL_IMAGE_URL,
      inputDisparityUrl: getDisparityPresignedUrl,
      resultPresignedUrl: putMP4PresignedUrl,
      animationLength: 5
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      timeout: THREE_MIN_IN_MS,
    });

    const getMP4Command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: S3_MP4_PATH
    });
    const getMP4PresignedUrl = await getSignedUrl(
      awsClient,
      getMP4Command,
      { expiresIn: TWENTY_FOUR_HRS_IN_S }
    );

    writeUrlToFile(getMP4PresignedUrl);
      

    console.log('\nMP4 Animation has been uploaded to specified AWS S3 bucket.' +
      `To download, please use this GET URL:: ${getMP4PresignedUrl}`);

  } catch (e: any) {
    if (e.hasOwnProperty('message') || e.hasOwnProperty('response')) {
      console.error(`Error. Unhandled exception: ${JSON.stringify(e.message)}`);
      console.error(`Error body: ${JSON.stringify(e.response?.data)}`);
    } else {
      console.error(`Error. Unhandled exception: ${JSON.stringify(e)}`);
    }
  }
})();
