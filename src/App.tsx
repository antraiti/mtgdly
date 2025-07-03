import { useEffect, useState } from 'react'
import './App.css'

// TODO: add in formats
// TODO: add placeholder for colorless
// TODO: up down indicators

const getColorForCompare = (goal: any, item: any) => {
  if (!Array.isArray(item)) {
    return item == goal ? 'bg-green-800' : 'bg-red-800'
  }

  let matches = 0;

  goal.forEach((i: any) => {
    if (item.indexOf(i) >= 0) {
      matches += 1;
    }
  })

  if (matches === 0) return 'bg-red-800';
  if (matches === goal.length) {
    if (goal.length === item.length) return 'bg-green-800'
  }
  return 'bg-yellow-500'
}

function App() {
  const [cardData, setCardData] = useState<Array<object>>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [cardGuesses, setCardGuesses] = useState<Array<any>>([]);
  const [randomCard, setRandomCard] = useState<any>();

  useEffect(() => {
      fetch('card_data/converted-cards.json')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setCardData(data);
          const randomIndex = Math.floor(Math.random() * data.length);
          setRandomCard(data[randomIndex]);
          console.dir(data[randomIndex]);
        })
        .catch(error => {
          console.error('Error fetching JSON:', error);
        });
  }, []);

  const SelectCard = (cardName: string) => {
    const card = cardData.find((c: any) => c.name === cardName);
    setCardGuesses(prev => [card, ...prev]);
    setSearchVal("");
  }

  return (
        <div className='flex flex-col justify-start'>
          <h1 className='p-10'>MTGDLY</h1>
            <div className="dropdown dropdown-start p-5">
              <input tabIndex={0} className='input w-xl' list="card-names" id="card-name-choice" name="card-name-choice" value={searchVal} onChange={e => setSearchVal(e.target.value)}/>
              <ul tabIndex={0} className='dropdown-content w-full z-10 menu bg-base-100 rounded-box flex-nowrap overflow-auto'>
                {cardData.filter((cd: any) => searchVal.length > 0 && cd.name.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0 && !cardGuesses.find(cg => cg.oracle_id === cd.oracle_id))
                  .slice(0, 10)
                  .map((cd: any) => <li key={cd.name}><a className='--color-primary-content' onClick={_ => SelectCard(cd.name)}>{cd.name}</a></li>)}
              </ul>
            </div>
          
          {cardGuesses.length > 0 && <div>
            <table className="table">
              <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Rarity</th>
                      <th className='w-12'>Set</th>
                      <th>MV</th>
                      <th>Color Id</th>
                      <th>Types</th>
                      <th>Release Year</th>
                    </tr>
              </thead>
              <tbody>
              {cardGuesses.map((cg:any) => <tr key={cg.name}>
                  <td><img className='h-32' src={cg.image}/></td>
                  <td className={randomCard!.name == cg.name ? 'bg-green-800' : ''}>{cg.name}</td>
                  <td className={getColorForCompare(randomCard!.rarity, cg.rarity)}>{cg.rarity}</td>
                  <td className={getColorForCompare(randomCard!.set, cg.set )}>{cg.set}</td>
                  <td className={getColorForCompare(randomCard!.cmc, cg.cmc)}>{cg.cmc}</td>
                  <td className={getColorForCompare(randomCard!.color_identity, cg.color_identity)}>{cg.color_identity}</td>
                  <td className={getColorForCompare(randomCard!.types, cg.types)}>{cg.types.join(", ")}</td>
                  <td className={getColorForCompare(randomCard!.released_at, cg.released_at)}>{cg.released_at}</td>
                </tr>)}
              </tbody>
            </table>
          </div>}
          
          {!cardData.length && <span className="loading loading-spinner loading-xl"></span>}
          <div className='p-10'>
            {cardData.length > 0 && <p>{cardData.length} cards loaded.</p>}
          </div>
        </div>
  )
}

export default App
