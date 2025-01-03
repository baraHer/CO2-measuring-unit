import img404 from '../img/404.webp'

import { Link } from "react-router-dom"
const ErrorPage = () => {
    return (
        <div className='error-page'>
            <img src={img404} alt={'404'}/>
            <h2>Jejda!</h2>
            <h3>Tato stránka neexistuje.</h3>
            <Link to="/">
                <button>Vrať se domů!</button>
            </Link>
        </div>
    );
};

export default ErrorPage;