import img404 from '../img/404.png'
const ErrorPage = () => {
    return (
        <div className='error-page'>
            <img src={img404} alt={'404'}/>
            <h2>Jejda!</h2>
            <h3>Tato stránka neexistuje.</h3>
            <button>Vrať se domů!</button>
        </div>
    );
};

export default ErrorPage;