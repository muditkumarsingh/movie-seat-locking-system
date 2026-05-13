import mongoose, { Schema } from "mongoose";
import { IRefreshTokenPayload } from "./auth.interface"


const refreshTokenSchema = new mongoose.Schema<IRefreshTokenPayload>({
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    //   createdAt: { type: Date, default: Date.now, expires: '7d' } // Token expires after 7 days //automatically created in mogoose
}, { timestamps: true });;

export const RefreshTokenModel = mongoose.model<IRefreshTokenPayload>("RefreshTokenModel", refreshTokenSchema)
