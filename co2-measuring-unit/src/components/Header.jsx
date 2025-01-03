import './Header.css'

import { Link, useLocation } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";

const Header = () => {
    const currentLocation = useLocation()

    return (
        <div className='nav-links-box'>
            <Link to='/' className={currentLocation.pathname === '/' ? 'active-link' : ''}><IoHomeOutline/></Link>
            <Link to='/data' className={currentLocation.pathname === '/data' ? 'active-link' : ''}>Naměřená data</Link>
            <Link to='/predpoved' className={currentLocation.pathname === '/predpoved' ? 'active-link' : ''}>Předpověď</Link>
        </div>
    );
};

export default Header;