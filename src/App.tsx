import { useEffect, useState } from 'react'
import './App.css'
import CardGuesser, { type CardPoolFilter } from './components/CardGuesser';

export interface CardData {
  name: string,
  oracle_id: string,
  types: Array<string>,
  rarity: string,
  released_at: number,
  cmc: number,
  color_identity: Array<string>,
  set: string,
  set_name: string,
  image: string,
  standad: boolean,
  pioneer: boolean,
  modern: boolean,
  legacy: boolean,
  edhrec_rank: number
}

function App() {
  const [cardData, setCardData] = useState<Array<CardData>>([]);
  const [cardFilter, setCardFilter] = useState<CardPoolFilter | undefined>();

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
        })
        .catch(error => {
          console.error('Error fetching JSON:', error);
        });
  }, []);

  //since we arent using routes this is home 'navigation'
  const reset = () => {
    setCardFilter(undefined);
  }

  return (
        <div className='flex flex-col justify-start'>
          <p className='pb-10 text-7xl'>MTGDLY</p>
          {!cardFilter && 
            <div>
              <h3>Choose a cardpool</h3>
              <div className='flex'>
                  <button className='btn' onClick={_ => setCardFilter("none")}>All</button>
                  <button className='btn' onClick={_ => setCardFilter("standard")}>Standard</button>
                  <button className='btn' onClick={_ => setCardFilter("pioneer")}>Pioneer</button>
                  <button className='btn' onClick={_ => setCardFilter("modern")}>Modern</button>
                  <button className='btn' onClick={_ => setCardFilter("legacy")}>Legacy</button>
                  <button className='btn' onClick={_ => setCardFilter("edh")}>EDH 1k</button>
              </div>
            </div>
          }
          {cardFilter && <CardGuesser cardData={cardData} filter={cardFilter} home={reset}/>}
          {!cardData.length && <span className="loading loading-spinner loading-xl"></span>}
          <div className='p-10'>
            {!cardFilter && cardData.length > 0 && <p>{cardData.length} cards loaded.</p>}
          </div>
        </div>
  )
}

export default App
