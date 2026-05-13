import crypto from 'crypto'
import { config } from '../../config/config';
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen';


// generate otp
export const generateOTP = () => {
    const opt = crypto.randomInt(1000, 9999);
    return opt;
}

//hash otp
export const hashOTP = (data: string) => {
    if (!config.hashingSecret) {
        throw new Error("Hashing secret is not defined")
    }
    return crypto.createHmac('sha256', config.hashingSecret).update(data).digest('hex')
}

//verify otp
export const verifyOTP = (hashedOTP: string, data: string) => {
    const newHashedOTP = hashOTP(data)

    console.log("otp is verified")
    return newHashedOTP === hashedOTP
}

//send opt to user via email
const _config = {
    service: "gmail" as string,
    auth: {
        user: config.emailUsername,
        pass: config.emailPassword
    }
}

const tranporter = nodemailer.createTransport(_config);

const mailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "bookMyScreen",
        link: "https://amritraj.vercel.app",
        logo: "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751475322/zu4fnmh2j1jzbtey77ah.png",
    }
})

export const sendOTPToEmail = async (email: string, otp: number) => {
    const emailTemp: any = {
        body: {
            name: '', // dynamic name
            intro: "Welcome to bookMyScreen! We're very excited to have you on board.",
            action: {
                instructions: "To verify your account, please use the following OTP:",
                button: {
                    color: "#323232",
                    text: otp, 
                    link: "#"
                }
            },
            outro:
                "This OTP will expire in 2 minutes for security reasons. If you did not request this, please ignore this email."
        }
    };

    const mail = mailGenerator.generate(emailTemp)

    let message = {
        from:config.emailUsername,
        to :email,
        subject:"Your OTP for bookMyScreen",
        html:mail
    }

    const info = await tranporter.sendMail(message);
    return info.messageId;
}