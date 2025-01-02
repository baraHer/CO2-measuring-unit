import './OneFactTab.css'

const OneFactTab = ({title, text, image, description}) => {
    return (
        <div className='fact-tab-box'>
            <div>
                <h3>{title}</h3>
                <p>{text}</p>
            </div>
            <img className='img-fact-tab' src={image} alt={description}/>
        </div>
    );
};

export default OneFactTab;