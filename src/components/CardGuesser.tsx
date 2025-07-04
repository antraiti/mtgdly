import { useEffect, useState } from "react";
import { getColorForCompare, getEmojiFromColor, NumericCompareIndicator } from "../util/helpers"
import Rand from 'rand-seed';
import type { CardData } from "../App";

export type CardPoolFilter = "none" | "standard" | "pioneer" | "modern" | "legacy" | "edh";

export interface CardGuesserProps {
    cardData: Array<any>;
    filter: CardPoolFilter;
    home: Function;
}

function CardGuesser(props: CardGuesserProps) {
  const [cardData, setCardData] = useState<Array<CardData>>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [cardGuesses, setCardGuesses] = useState<Array<CardData>>([]);
  const [randomCard, setRandomCard] = useState<CardData>();
  const [completed, setCompleted] = useState<boolean>(false);
  const params = new URLSearchParams(window.location.search);
  const infinite = params.get("infinite")?.toLocaleLowerCase() === "true";

  const reset = () => {
    setSearchVal("");
    setCardGuesses([]);
  }

  useEffect(() => {
    reset();

    setCardData(props.cardData.filter((cd: any) => {
        if (props.filter == "none") return true;

        if (props.filter == "edh") return cd.edhrec_rank <= 1000 && cd.edhrec_rank > 0

        return cd[props.filter] === "True"
    }));
  }, [props.cardData, props.filter]);

  useEffect(() => {
    if (cardData.length === 0) return;
    const randMod = infinite ? new Rand().next() : new Rand((new Date()).toDateString() + props.filter).next();
    const randCard = cardData[Math.floor(cardData.length * randMod)];
    console.log(randMod);
    console.dir(randCard);
    setRandomCard(randCard);
  }, [cardData])

  const SelectCard = (cardName: string) => {
    if (!randomCard) {
        console.error(`Cannot select card when random card is not set.`);
        return;
    }

    const card = cardData.find((c: any) => c.name === cardName);

    if (!card) {
        console.error(`Couldnt find matching card for name: ${cardName}`)
        return;
    }

    setCardGuesses(prev => [card, ...prev]);
    setSearchVal("");

    if (card.oracle_id === randomCard.oracle_id) {
        setCompleted(true);
    }
  }

    function clipboardResults(): void {
        try {
            let resultText = `I guessed the card in ${cardGuesses.length + 1} guesses!\nformat: ${props.filter}`

            resultText += `\n✅🟩🟩🟩🟩🟩🟩`

            // This probaby could use a better setup
            cardGuesses.map((cd: CardData) => {
                resultText += "\n❌";
                resultText += getEmojiFromColor(getColorForCompare(randomCard!.rarity, cd.rarity));
                resultText += getEmojiFromColor(getColorForCompare(randomCard!.set, cd.set ));
                resultText += getEmojiFromColor(getColorForCompare(randomCard!.cmc, cd.cmc));
                resultText += getEmojiFromColor(getColorForCompare(randomCard!.color_identity, cd.color_identity));
                resultText += getEmojiFromColor(getColorForCompare(randomCard!.types, cd.types));
                resultText += getEmojiFromColor(getColorForCompare(randomCard!.released_at, cd.released_at));
            })

            resultText += `\nhttps://antraiti.github.io/mtgdly/`

            navigator.clipboard.writeText(resultText);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

  return (
    <div>
        <div className="dropdown dropdown-start p-5">
            {!completed && <input tabIndex={0} className='input w-xl' list="card-names" id="card-name-choice" name="card-name-choice" value={searchVal} onChange={e => setSearchVal(e.target.value)} autoComplete="off"/>}
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
        
        {completed && <div className="flex flex-col align-middle">
            <img className="w-72 object-scale-down self-center" src={randomCard?.image}/>
            <h2 className="p-2">{randomCard?.name}</h2>
            <h3 className="p-2">You guessed it in {cardGuesses.length + 1} guesses!</h3>
            <div className="flex p-5 self-center gap-5">
                <button className="btn p-5 w-24" onClick={_ => clipboardResults()}>Share</button>
                <button className="btn p-5 w-24" onClick={_ => props.home()}>Home</button>
            </div>
        </div>}
        
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
                <td className={getColorForCompare(randomCard!.cmc, cg.cmc)}>{cg.cmc + NumericCompareIndicator(randomCard!.cmc, cg.cmc)}</td>
                <td className={getColorForCompare(randomCard!.color_identity, cg.color_identity)}>{cg.color_identity}</td>
                <td className={getColorForCompare(randomCard!.types, cg.types)}>{cg.types.join(", ")}</td>
                <td className={getColorForCompare(randomCard!.released_at, cg.released_at)}>{cg.released_at + NumericCompareIndicator(randomCard!.released_at, cg.released_at)}</td>
            </tr>)}
            </tbody>
        </table>
        </div>}
    </div>
  )
}

export default CardGuesser