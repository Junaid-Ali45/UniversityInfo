import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countryName, setCountryName] = useState('Pakistan');
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://universities.hipolabs.com/search?country=${countryName}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleUniversityDetails = (university) => {
    setSelectedUniversity(selectedUniversity === university ? null : university);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div style={{marginLeft:"10px"}}>
      <form onSubmit={handleSearch}>
        <h3>Enter name of country: </h3>
        <input type='text' placeholder='Enter Country Name' value={countryName} onChange={(e) => setCountryName(e.target.value)} />
        <button type='submit'>Search</button>
      </form>
      {data && (
        <div>
          <h1>List of Universities:</h1>
          {data.map((university, index) => (
            <div key={index}>
              <strong onClick={() => toggleUniversityDetails(university)}>
                {selectedUniversity === university ? '-' : '+'} {university.name}
              </strong>
              {selectedUniversity === university && (
                <div>
                  <p>&nbsp;&nbsp;Country: {university.country}</p>
                  <p>&nbsp;&nbsp;State/Province: {university["state-province"]}</p>
                  <p>&nbsp;&nbsp;Country Code: {university.alpha_two_code}</p>
                  <p>&nbsp;&nbsp;Web Pages:</p>
                  <ul>
                    {university.web_pages.map((page, index) => (
                      <li key={index}><a href={page} target="_blank" rel="noopener noreferrer">&nbsp;&nbsp;{page}</a></li>
                    ))}
                  </ul>
                  <p>&nbsp;&nbsp;Domains:</p>
                  <ul>
                    {university.domains.map((domain, index) => (
                      <li key={index}><a href={`http://${domain}`} target="_blank" rel="noopener noreferrer">&nbsp;&nbsp;{domain}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
