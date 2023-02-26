import React from "react"

function EntryCard(props)
{

    /* The EntryCard is a component that represents essential, superficial information about an entry:
        * The feeling rating indicated via its corresponding image
        * The title
        * The type of entry (guided or freeform)
        * The date and time the entry was initially submitted
    */

    return (
        <div>
            {props.entry.feelingRating && (<div className="entryCard" onClick={props.displayEntry}>
                <img
                    src={require('../images/' + String(props.entry.feelingRating) + '.png')}
                    alt='feelingRatingImage'
                    className="entryCardImage"
                />
                <div className="entryCardTitleAndTypeContainer">
                    <p className='entryCardTitle' style={{color: props.entry.feelingThemeColor}}>{props.entry.title}</p>
                    <p className="entryCardType">{props.entry.isGuided ? 'Guided Journal Entry' : 'Freeform Journal Entry'}</p>
                </div>
                <div className="entryCardTimeContainer">
                    <p>{props.dayName}</p>
                    <p>{props.entry.date.getHours() % 12 === 0 ? '12' : props.entry.date.getHours() % 12}:{props.entry.date.getMinutes() < 10 ? '0' + String(props.entry.date.getMinutes()) : String(props.entry.date.getMinutes())} {props.entry.date.getHours() < 12 ? 'AM' : 'PM'}</p>
                    <p>{props.entry.date.getMonth() + 1}/{props.entry.date.getDate()}/{props.entry.date.getFullYear() % 100}</p>
                </div>
            </div>)}
        </div>
    )
}

export default EntryCard;