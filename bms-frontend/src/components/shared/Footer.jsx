import { FaFacebook, FaInstagram, FaLinkedin, FaPinterestP, FaTwitter, FaYoutube } from 'react-icons/fa'
import mainLogo from '../../assets/main-icon-white.png'


const Footer = () => {
    return (
        <footer className='bg-[#2b2b2b] text-gray-400 text-sm'>
            <div className="border-t border-gray-600 w-full" />
            <div className="flex flex-col items-center py-6">
                {/* logo */}
                <img src={mainLogo} alt="BookMyScreen" className='w-28 mb-4' />

                {/* Social Icons */}
                <div className="flex space-x-4 mb-4">
                    <FaFacebook className='w-8 h-8 p-2 rounded-full bg-gray-700 text-white' />
                    <FaTwitter className='w-8 h-8 p-2 rounded-full bg-gray-700 text-white' />
                    <FaInstagram className='w-8 h-8 p-2 rounded-full bg-gray-700 text-white' />
                    <FaYoutube className='w-8 h-8 p-2 rounded-full bg-gray-700 text-white' />
                    <FaPinterestP className='w-8 h-8 p-2 rounded-full bg-gray-700 text-white' />
                    <FaLinkedin className='w-8 h-8 p-2 rounded-full bg-gray-700 text-white' />
                </div>

                {/* copyright */}
                <p className='text-center text-xs px-4 max-w-4xl'>
                    Copyright 2025 © bookMyScreen Pvt Ltd. All Rights Reserved.
                    <br />
                </p>

                <small className='text-center'>
                    The content and images used on this site are copyright protected and
                    copyrights vests with the respective owners. The usage of the content
                    and images on this website is intended to promote the works and no
                    endorsement of the artist shall be implied.
                </small>

            </div>


        </footer>
    )
}

export default Footer
