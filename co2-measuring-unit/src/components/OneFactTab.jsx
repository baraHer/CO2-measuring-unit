const OneFactTab = ({title, text, image, description}) => {
    return (
        <div>
            <h3>{title}</h3>
            <p>{text}</p>
            <img src={image} alt={description}/>
        </div>
    );
};

export default OneFactTab;