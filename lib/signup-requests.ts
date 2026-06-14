import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export const SIGNUP_REQUESTS_COLLECTION = "signupRequests";

export type SignupRequestStatus = "pending" | "approved" | "rejected";

export type SignupRequest = {
  _id?: ObjectId;
  name: string;
  phone: string;
  city: string;
  email: string;
  status: SignupRequestStatus;
  createdAt: Date;
  reviewedAt?: Date;
};

export type SerializedSignupRequest = {
  _id: string;
  name: string;
  phone: string;
  city: string;
  email: string;
  status: SignupRequestStatus;
  createdAt: string;
  reviewedAt: string | null;
};

export function serializeSignupRequest(request: SignupRequest): SerializedSignupRequest {
  return {
    _id: request._id?.toString() ?? "",
    name: request.name,
    phone: request.phone,
    city: request.city,
    email: request.email,
    status: request.status,
    createdAt: request.createdAt.toISOString(),
    reviewedAt: request.reviewedAt ? request.reviewedAt.toISOString() : null,
  };
}

export async function createSignupRequest(data: {
  name: string;
  phone: string;
  city: string;
  email: string;
}): Promise<SignupRequest> {
  const db = await getDb();
  const request: SignupRequest = {
    name: data.name.trim(),
    phone: data.phone.trim(),
    city: data.city.trim(),
    email: data.email.toLowerCase().trim(),
    status: "pending",
    createdAt: new Date(),
  };
  const result = await db.collection<SignupRequest>(SIGNUP_REQUESTS_COLLECTION).insertOne(request);
  return { ...request, _id: result.insertedId };
}

export async function getSignupRequestById(id: string): Promise<SignupRequest | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  return db.collection<SignupRequest>(SIGNUP_REQUESTS_COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function getPendingSignupRequestByEmail(email: string): Promise<SignupRequest | null> {
  const db = await getDb();
  return db.collection<SignupRequest>(SIGNUP_REQUESTS_COLLECTION).findOne({
    email: email.toLowerCase().trim(),
    status: "pending",
  });
}

export async function listSignupRequests(): Promise<SignupRequest[]> {
  const db = await getDb();
  return db.collection<SignupRequest>(SIGNUP_REQUESTS_COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
}

export async function updateSignupRequestStatus(id: string, status: SignupRequestStatus): Promise<void> {
  const db = await getDb();
  await db
    .collection<SignupRequest>(SIGNUP_REQUESTS_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { status, reviewedAt: new Date() } });
}
