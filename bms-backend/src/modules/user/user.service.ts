import { IUser } from "./user.interface";
import { UserModel } from "./user.model";


//create user
export const createUser = async (email: IUser): Promise<IUser> => {
    console.log(email)
    const newUser = new UserModel({email,name:email});
    return await newUser.save();
}

//GEt all users
export const getAllUsers = async (): Promise<IUser[]> => {
    return await UserModel.find()
}

//Get user by id
export const getUserById = async (id: string): Promise<IUser | null> => {
    return await UserModel.findById(id);
}

//Get user by email
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
    return await UserModel.findOne({email});
}


//activate user 
export const activateUser = async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true });
    if(!updatedUser){
        throw new Error("User not found");
    }
    return updatedUser;
}