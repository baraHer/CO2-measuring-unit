import {Link} from "react-router-dom";

import { IoHomeOutline } from "react-icons/io5";

const Header = () => {
    return (
        <div className='header'>
            <Link to='/'><IoHomeOutline /></Link>
            <Link to='/data'>Naměřená data</Link>
            <Link to='/predpoved'>Předpověď</Link>
        </div>
    );
};

export default Header;