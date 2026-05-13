
import { NextFunction, Request, Response } from 'express';
import * as OtpService from './otp.service';
import * as UserService from '../user/user.service';
import * as TokenService from './token.service';
import createHttpError from 'http-errors';
import { isValidEmail } from '../../utils';
import { ITokenPayload } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body

        if (!email) {
            const err = createHttpError.BadRequest("Email is required");
            return next(err);
        }

        if (!isValidEmail(email)) {
            const err = createHttpError.BadRequest("Invalid email format");
            return next(err);
        }

        // 1.create OTP
        const otp = OtpService.generateOTP();

        //2. hash otp with email
        const ttl = 1000 * 60 * 20; //change to 2 min
        const expires = Date.now() + ttl;
        const data = `${email}.${otp}.${expires}`;
        const hashedOTP = OtpService.hashOTP(data);

        //3. send otp to users email
        try {
            await OtpService.sendOTPToEmail(email, otp)
        } catch (error) {
            const err = createHttpError.InternalServerError("Error sendin otp to email")
            return next(err)
        }

        //4. response to the client
        res.json({
            hash: `${hashedOTP}.${expires}`,
            email,
            msg: "OTP send successfully ✅"
        })

    } catch (err) {
        next(err)
    }
}

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, hash } = req.body;

    if (!email || !otp || !hash) {
        const err = createHttpError.BadRequest("All fields are required");
        return next(err);
    }

    console.log("otp is verified")

    //1.OTP VErifucation
    const [hashedOTP, expires] = hash.split(".")
    if (Date.now() > +expires) {
        const err = createHttpError.Gone("OTP Expired")
        return next(err)
    }

    const data = `${email}.${otp}.${expires}`;
    const isValid = OtpService.verifyOTP(hashedOTP, data)

    if (!isValid) {
        const err = createHttpError.Unauthorized("Invalid otp")
        return next(err);
    }

    //2. Find or create a  user
    let user;
    try {
        user = await UserService.getUserByEmail(email);
        if (!user) {
            user = await UserService.createUser(email)
        }
    } catch (err) {

        return next(err)
    }

    // 3. Generate jwt

    const { accessToken, refreshToken } = TokenService.generateToken(
        { _id: user._id, email: user.email }
    )

    // 4. stroe refrsh token in db
    await TokenService.storeRefreshToken(user._id as string, refreshToken)

    //5. sending token in cookies
    res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 , //i hrs
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    })
    res.cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1hrs
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    })

    res.json({
        auth: true,
        user
    })
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.cookies;

        //delete refresh token from db
        await TokenService.deleteRefreshToken(refreshToken);

        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')

        res.json({ msg: "Logged out successfully" }).status(200)
    } catch (err) {
        next(err)
    }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    // 1. get refresh token from cookies
    const { refreshToken: refreshTokenFromCookies } = req.cookies

    if (!refreshTokenFromCookies) {
        const err = createHttpError.Unauthorized("Refresh token not found, please login again");
        return next(err);
    }

    // 2. verify refresh token ;
    let decodedToken: ITokenPayload | JwtPayload | string;
    try {
        decodedToken = TokenService.verifyRefreshToken(refreshTokenFromCookies) as ITokenPayload
    } catch (error) {
        const err = createHttpError("Invalid refresh token , please login again")
        return next(err)
    }

    // 3. check if refresh token is in DB
    try {
        const token = await TokenService.findRefreshToken(decodedToken._id, refreshTokenFromCookies)
        if (!token) {
            const err = createHttpError.Unauthorized("Refresh token not found in database, please login again");
            return next(err)
        }
    } catch (err) {
        return next(err)
    }

    // 4. genereate new tokens to client in cookie
    const { accessToken, refreshToken } = TokenService.generateToken(
        { _id: decodedToken._id }
    )

    // 5. Update refresh token
    try {
        await TokenService.updateRefreshToken(decodedToken._id, refreshToken);
    } catch (err) {
        return next(err)
    }

    // 6. Send new token to client in cookie
    res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60,// 1 hour
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    })

    res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,// 1 month
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    })

    res.json({auth:true}).status(200 )
}