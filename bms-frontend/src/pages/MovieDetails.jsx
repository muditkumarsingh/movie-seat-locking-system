import React from 'react'
import m4 from '../assets/m4.avif'
import TheaterTimings from '../components/movies/TheaterTimings';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getMoviesById } from '../apis';
import { useParams } from 'react-router-dom';



const MovieDetails = () => {

    const {id} = useParams()
    
    //api
    const {data:movie,isError}=useQuery({
        queryKey:["movie",id],
        queryFn:async()=>getMoviesById(id),
        placeholderData:keepPreviousData
    })



    return (
        <>
            <div>


                {/* MovieD.movie?etails Section */}
                <div className='relative text-white font-sans px-4 py-10 '
                    style={{
                        backgroundImage: `url(${movie?.data?.movie?.posterUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"
                    }}
                >
                    {/* OverLay for Darkness */}
                    <div className='absolute inset-0 bg-black opacity-70'></div>
                    {/* Actual content */}
                    <div className='relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 '>
                        {/* Poster */}
                        <div >
                            <img src={movie?.data?.movie?.posterUrl} alt={movie?.data?.movie?.title} className='rounded-xl w-52 shadow-cl' />
                        </div>
                        {/* Details */}
                        <div className='flex flex-col justify-start flex-1' >
                            <h1 className="text-4xl font-bold mb-4">{movie?.data?.movie?.title}</h1>

                            <div className='flex items-center gap-4 mb-3'>
                                <div className="bg-[#3a3a3a] px-4 py-2 rounded-md flex items-center gap-2 text-sm">
                                    <span className='text-pink-500 font-bold'>
                                        ★ {movie?.data?.movie?.rating}
                                    </span>
                                    <span className="text-gray-300">
                                        {movie?.data?.movie?.votes} Votes
                                    </span>
                                    <button className='cursor-pointer bg-[#3a3a3a] ml-6 px-4 py-2 rounded-md hover:bg-[#4a4a4a]'>
                                        Rate Now
                                    </button>
                                </div>

                            </div>

                            <div className="flex items-center gap-3 text-sm mb-4">
                                <span className="bg-[#3a3a3a] px-3 py-1 rounded">
                                    {movie?.data?.movie?.format.join(", ")}
                                </span>

                                <span className="bg-[#3a3a3a] px-3 py-1 rounded">
                                    {movie?.data?.movie?.languages.join(", ")}
                                </span>
                            </div>

                            <p className="text-sm text-gray-300 mb-4">
                                {movie?.data?.movie?.duration} • {movie?.data?.movie?.genre.join(", ")}{" "}
                                {movie?.data?.movie?.certification} •{" "}
                                {movie?.data?.movie?.releaseDate}
                            </p>

                            <div>
                                <h2 className="text-xl font-bold mb-2">About the movie?.data?.movie?</h2>
                                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                                    {movie?.data?.movie?.description}
                                </p>
                            </div>


                        </div>
                        <div className="absolute top-0 right-0 cursor-pointer">
                            <button
                                className="cursor-pointer bg-[#3a3a3a] px-4 py-2 rounded text-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77l-7.13-4.21c.05-.25.09-.51.09-.77s-.03-.52-.09-.77l7.1-4.18c.54.5 1.25.81 2.01.81 1.66 0 3-1.34 3-3S19.66 2 18 2s-3 1.34-3 3c0 .26.04.52.09.77l-7.1 4.18C7.46 9.45 6.75 9.14 6 9.14c-1.66 0-3 1.34-3 3s1.34 3 3 3c.75 0 1.46-.31 1.99-.81l7.13 4.21c-.05.23-.08.47-.08.71 0 1.61 1.31 2.92 2.92 2.92S21 20.86 21 19.25s-1.34-3.17-3-3.17z" />
                                </svg>
                                Share
                            </button>
                        </div>


                    </div>

                </div>

                <div className='relative z-10 max-w-7xl mx-auto'>

                <TheaterTimings movieId={id} />
                </div>
            </div>
        </>
    )
}

export default MovieDetails
