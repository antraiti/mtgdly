import { useEffect, useState } from "react";
import { getColorForCompare } from "../util/helpers"
import Rand from 'rand-seed';

export type CardPoolFilter = "none" | "standard" | "pioneer" | "modern" | "legacy" | "edh";

export interface CardGuesserProps {
    cardData: Array<any>;
    filter: CardPoolFilter;
}

function CardGuesser(props: CardGuesserProps) {
  const [cardData, setCardData] = useState<Array<object>>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [cardGuesses, setCardGuesses] = useState<Array<any>>([]);
  const [randomCard, setRandomCard] = useState<any>();

  useEffect(() => {
    setSearchVal("");
    setCardGuesses([]);

    setCardData(props.cardData.filter((cd: any) => {
        if (props.filter == "none") return true;

        if (props.filter == "edh") return cd.edhrec_rank <= 1000 && cd.edhrec_rank > 0

        return cd[props.filter] === "True"
    }));
  }, [props.cardData, props.filter]);

  useEffect(() => {
    if (cardData.length === 0) return;

    const randMod = new Rand((new Date()).toDateString() + props.filter).next();
    const randCard = cardData[Math.floor(cardData.length * randMod)];
    console.log(randMod);
    console.dir(randCard);
    setRandomCard(randCard);
  }, [cardData])

  const SelectCard = (cardName: string) => {
    const card = cardData.find((c: any) => c.name === cardName);
    setCardGuesses(prev => [card, ...prev]);
    setSearchVal("");
  }

  return (
    <div>
        <div className="dropdown dropdown-start p-5">
            <input tabIndex={0} className='input w-xl' list="card-names" id="card-name-choice" name="card-name-choice" value={searchVal} onChange={e => setSearchVal(e.target.value)} autoComplete="off"/>
            <ul tabIndex={0} className='dropdown-content w-full z-10 menu bg-base-100 rounded-box flex-nowrap overflow-auto'>
            {cardData.filter((cd: any) => searchVal.length > 0 && cd.name.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0 && !cardGuesses.find(cg => cg.oracle_id === cd.oracle_id))
                .slice(0, 10)
                .map((cd: any) => <li key={cd.name}>
                        <a className='--color-primary-content' onClick={_ => SelectCard(cd.name)}>
                            <div className="flex align-middle">
                                <img className="h-32" src={cd.image}/>
                                <h3 className="text-amber-50 p-5 self-center">{cd.name}</h3>
                            </div>
                        </a>
                    </li>)}
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
    </div>
  )
}

export default CardGuesser