import React from 'react'
import BannerSlider from '../components/shared/BannerSlider'
import MovieFilter from '../components/movies/MovieFilter'
import MovieList from '../components/movies/MovieList'
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAllMovies } from '../apis'
import { isRouteErrorResponse } from 'react-router-dom'

const Movies = () => {

    const { data: allMovies, isError } = useQuery({
        queryKey: ["allMovies"],
        queryFn: async () => {
            return await getAllMovies();
        },
        placeholderData: keepPreviousData,
        select:(res)=>res.data.movies
    })

    // console.log(allMovies)

    if (isError) {
        toast.error("Something went wrong")
    }

    return (
        <div>
            <BannerSlider />
            <div className="flex flex-col md:flex-row bg-[#f5f5f5] min-h-screen md:px-[100px] pb-10 pt-8">
                <MovieFilter />
                <MovieList allMovies={allMovies} />
            </div>
        </div>
    )
}

export default Movies
