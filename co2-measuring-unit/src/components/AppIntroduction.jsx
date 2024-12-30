import allFeatures from "../appIntroduction";

const AppIntroduction = () => {
    return (
        <div>
            <h2>Co Klimastanice umí?</h2>
            <div>
                {
                    allFeatures.map( (feature, index) => {
                        const {title, text, image, description} = feature

                        return <div key={index}>
                            <h3>{title}</h3>
                            <p>{text}</p>
                            <img src={image} alt={description}/>
                        </div>
                    })
                }
            </div>
        </div>
    );
};

export default AppIntroduction;