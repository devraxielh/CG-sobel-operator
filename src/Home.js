import React from 'react';
import data from './jsons/home.json';
const Home = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row">
            <div className="md:w-1/2 flex justify-center items-center">
                <img
                    src={data.imageSrc}
                    alt={data.imageAlt}
                    className="rounded-lg shadow-lg"
                />
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0 md:pl-6">
                <h2 className="text-xl font-bold mb-4">{data.title}</h2>
                {data.description.map((paragraph, index) => (
                    <p key={index} className={`mt-4 ${index === 0 ? 'mt-0' : ''}`}> {paragraph}</p>
                ))}
            </div>
        </div>
    );
};
export default Home;