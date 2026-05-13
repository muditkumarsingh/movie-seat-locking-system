import React from 'react'
import BannerSlider from '../components/shared/BannerSlider'
import Recommended from '../components/shared/Recommended'
import LiveEvents from '../components/shared/LiveEvents'

const Home = () => {
    return (
        <div>
            <BannerSlider/>
            <Recommended/>
            <LiveEvents/>
        </div>
    )
}

export default Home
