import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CERT_URL
};

// Initialize app only if it hasn't been initialized already
const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(serviceAccount as any),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  : getApps()[0];

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export const adminMessaging = getMessaging(app);

// Utility functions for common operations
export const verifyIdToken = async (idToken: string) => {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw new Error('Invalid token');
  }
};

export const sendNotificationToUser = async (userToken: string, title: string, body: string, data?: Record<string, string>) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token: userToken,
    };

    const response = await adminMessaging.send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const sendNotificationToTopic = async (topic: string, title: string, body: string, data?: Record<string, string>) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      topic,
    };

    const response = await adminMessaging.send(message);
    console.log('Successfully sent message to topic:', response);
    return response;
  } catch (error) {
    console.error('Error sending message to topic:', error);
    throw error;
  }
};

export const createCustomToken = async (uid: string, additionalClaims?: Record<string, any>) => {
  try {
    const customToken = await adminAuth.createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('Error creating custom token:', error);
    throw error;
  }
};

export const setUserClaims = async (uid: string, customClaims: Record<string, any>) => {
  try {
    await adminAuth.setCustomUserClaims(uid, customClaims);
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw error;
  }
};
