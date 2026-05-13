import { config } from "../../config/config";
import { ITokenPayload } from "./auth.interface";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { RefreshTokenModel } from "./refresh.model";

//Generate access token and refresh token
export const generateToken = (payloaad: ITokenPayload): { accessToken: string, refreshToken: string } => {
    const accessToken = jwt.sign(payloaad, config.accessTokenSecret, { expiresIn: "10s" });
    const refreshToken = jwt.sign(payloaad, config.refreshTokenSecret, { expiresIn: "7d" })
    return { accessToken, refreshToken }
}

//store refresh token in database
export const storeRefreshToken = async (userId: string, refreshToken: string): Promise<void> => {
    try {
        await RefreshTokenModel.create({ userId, token: refreshToken })
    } catch (err) {
        throw err
    }
}

//verify access token
export const verifyAccessToken = (token: string): ITokenPayload | JwtPayload => {
    return jwt.verify(token, config.accessTokenSecret) as ITokenPayload | JwtPayload;
}

//verify refresh token
export const verifyRefreshToken = (token: string): ITokenPayload | JwtPayload => {
    return jwt.verify(token, config.refreshTokenSecret) as ITokenPayload | JwtPayload;
}

//db operation on refresh token
export const findRefreshToken = async (userId: string, token: string): Promise<{ userId: string, token: string } | null> => {
    return await RefreshTokenModel.findOne({ userId, token })
}

export const deleteRefreshToken = async (token: string): Promise<{ userId: string, token: string } | null> => {
    return await RefreshTokenModel.findOneAndDelete({ token })
}

export const updateRefreshToken = async (userId: string, newToken: string): Promise<void> => {
    try {
        await RefreshTokenModel.updateOne({ userId }, { token: newToken }, { upsert: true })
    } catch (err) {
        throw err
    }
}