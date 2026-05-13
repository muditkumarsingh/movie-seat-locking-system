import { createContext, useContext, useState } from "react";
import { useMutation } from '@tanstack/react-query'
import { activate, logout, sendOTP, verifyOTP } from "../apis";
import { toast } from 'react-hot-toast'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {


    const [step, setStep] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const [interval, setInterval] = useState(null);
    const [authData, setAuthData] = useState();
    const [auth, setAuth] = useState();

    //Mutations - this is for post request
    const sendOtpRequestMutation = useMutation({
        mutationFn: (email) => sendOTP({ email })
    })

    const verifyOtpRequestMutation = useMutation({
        mutationFn: (reqData) => verifyOTP(reqData)
    })

    const activateUserMutation = useMutation({
        mutationFn: (reqData) => activate(reqData)
    })

    const logoutMutation = useMutation({
        mutationFn: (reqData) => logout()
    })

    const toggleModal = () => {
        setShowModal(!showModal)
        if(step!==1){
            setStep(1);
        }
    }

    const sendOtpRequest = async ({ email, onNext }) => {
        sendOtpRequestMutation.mutate(email, {
            onSuccess: (res) => {
                console.log(res.data)
                setAuthData(res.data)
                toast.success("OTP send to your email")
                onNext()
            },
            onError: (err) => {
                console.log(err)
                toast.error(err?.response?.error?.message || "Failed to send OTP")
            }
        })
    }

    const verifyOtpRequest = async (otp, onNext) => {
        if (!authData) {
            toast.error("Session expired. Please request OTP again.");
            console.log("error in otp")
            return;
        }
        const { hash, email } = authData
        const reqData = { otp, hash, email }

        verifyOtpRequestMutation.mutate(reqData, {
            onSuccess: (res) => {
                setAuthData(null);
                setUser(res.data.user);
                console.log(res.data.user)
                setAuth(true);
                if (!res.data?.user?.activateUser) {
                    onNext();
                } else {
                    setStep(1);
                    toggleModal()
                }
            },
            onError: (err) => {
                console.log(err);
                toast.error(err?.response?.error?.message || "Some thing went wrong");
            }
        })
        console.log(user);
    }

    const activateUserRequest = async (data) => {
        const { name, phone } = data;
        const id = user?._id;
        const reqData = { id, name, phone };

        activateUserMutation.mutate(reqData, {
            onSuccess: (res) => {
                console.log(res);
                setUser(res.data);
                setStep(1)
                toggleModal();
            },
            onError: (err) => {
                console.log(err)
                toast.error(err?.response?.error?.message || "Something went wrong")
            }
        })
    }

    const logoutRequest = () => {
        logoutMutation.mutate(null, {
            onSuccess: (data) => {
                console.log(data);
                setAuth(false)
                setUser(null)
                window.location.href = "/"
            },
            onError: (error) => {
                console.log(error)
                toast.error(error?.response?.error?.message | "Something went wrong")
            }
        })
    }

    return (
        <AuthContext.Provider value={{ step, setStep, showModal, setShowModal, toggleModal, sendOtpRequest, authData, user,auth,setAuth,setUser, verifyOtpRequest, activateUserRequest, logoutRequest, otpLoader: sendOtpRequestMutation.isPending, verifyOtpLoader: verifyOtpRequestMutation.isPending, activateUserLoader: activateUserMutation.isPending  }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)