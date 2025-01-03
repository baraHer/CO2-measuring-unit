const ForecastDataBox = ({header, data, icon}) => {
    return (
        <div className={'forecast-data-box'}>
            <h4>{header}</h4>
            <p>{data}</p>
            <img src={icon} alt={header + ' ikonka'}/>
        </div>
    );
};

export default ForecastDataBox;