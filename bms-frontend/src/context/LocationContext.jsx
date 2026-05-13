import { createContext, useContext, useEffect, useState } from "react";

const LocationContext = createContext({
    location: null,
    loading: true,
    error: null
})

export const LocationProvide = ({ children }) => {

    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        //logic to fetch anf send location

        const fetchLocationData = async (latitude, longitude) => {
            try{
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`    
                )
                const data = await res.json();
                const userLocation = data?.address?.state
                setLocation(userLocation)
               
            }catch(err){
                setError("Failed to fetch location data")
            }finally{
                setLoading(false)
            }
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchLocationData(latitude, longitude)
            },
            () => {
                setError("Unable to retrive your location")
                setLoading(false)
            }
        )

    }, [])

    return (
        <LocationContext.Provider value={{ location, loading, error }}>
            {children}
        </LocationContext.Provider>
    )
}

export const useLocation = () => useContext(LocationContext);