
import axios from "axios";
import { axiosWrapper } from "./axiosWrapper";

//List all the end points
export const getRecommendedMovies = () => axiosWrapper.get("/movies/recommended")
export const getAllMovies = () => axiosWrapper.get("/movies")
export const getMoviesById = (data) => axiosWrapper.get(`/movies/${data}`)
export const getShowsByMovieandLocation = (movieId, state, date) =>
    axiosWrapper.get("/shows", {
        params: {
            movieId,
            state,
            date
        }
    })

export const getShowById = (data) => axiosWrapper.get(`/shows/${data}`)

//Authentication
export const sendOTP = (data) => axiosWrapper.post('/auth/send-otp', data)
export const verifyOTP = (data) => axiosWrapper.post('/auth/verify-otp', data)
export const activate = ({ id, ...data }) => axiosWrapper.put(`/users/activate/${id}`, data)
export const logout = () => axiosWrapper.post("/auth/logout")
export const getUser = () => axiosWrapper.get('/users/me')

//interceptor
axiosWrapper.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._isRetry = true;

      try {
        await axiosWrapper.get("/auth/refresh-token");

        return axiosWrapper.request(originalRequest);
      } catch (err) {
        console.log("Error while refreshing the token", err);

        // 🔥 logout user
      
      }
    }

    return Promise.reject(error);
  }
);