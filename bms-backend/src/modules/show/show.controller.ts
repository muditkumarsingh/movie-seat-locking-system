
import { NextFunction, Request, Response } from 'express'
import * as ShowServices from './show.service'

export const createShow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const show = await ShowServices.createShow(req.body);
        res.status(201).json(show)
    } catch (err) {
        next(err)
    }
}

export const getShowByMovieDateLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { movieId, state, date } = req.query;
        const shows = await ShowServices.getShowByMovieDateLocation(
            movieId as string,
            date as string,
            state as string
        )
        res.status(200).json(shows)
    } catch (err) {
        next(err)
    }
}

export const getShowById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const show = await ShowServices.getShowById(req.params.id);
        res.status(201).json(show)
    } catch (err) {
        next(err)
    }
}

export const updateSeatStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {  row, seatNumber, status } = req.query
        const updatedShow = await ShowServices.updateSeatStatus(
            req.params.showId as string,
            row as string,
            Number(seatNumber),
            status as "AVAILABLE" | "BOOKED" | "BLOCKED"
        )

        res.status(201).json(updatedShow)
    }catch(err){
        next(err)
    }
}