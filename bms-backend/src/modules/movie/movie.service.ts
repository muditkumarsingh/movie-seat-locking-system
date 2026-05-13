import { IMovie } from "./movie.interface";
import { MovieModel } from "./movie.model";


//create movie
export const createMovie = async (movie: IMovie) => {
    return await MovieModel.create(movie);
}

//get all move
export const getAllMovies = async () => {
    return await MovieModel.find().sort({ releaseDate: -1 })
}

export const getMovieById = async (id: string) => {
    return await MovieModel.findById(id)
}

export const getTopMoviesByVotes = async (limit: number) => {
    return await MovieModel.find().sort({ votes: -1 }).limit(limit)
}