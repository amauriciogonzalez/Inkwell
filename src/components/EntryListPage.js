import React from 'react'
import EntryCard from './EntryCard'

function EntryListPage(props)
{
    const cardEntries = props.entries.map(function(entry) {
        return <EntryCard entry={entry} displayEntry={() => props.handleDisplayEntry(entry.id)} dayName={props.findDayName(entry.date)}/>
    })

    /* The entry list page shows the list of all submitted entries displayed as a list of horizontal cards. If no entries were made, the
       user is notified that no previous entries are available and a new journal entry must be made. */

    return (
        <div>
            {props.entries.length !== 0 ? <>{cardEntries}</> : <div className='noPreviousEntries'><h1>No previous entries are available.</h1><h2>Create a new journal entry by clicking the quill icon above!</h2></div>}
        </div>
    )
}

export default EntryListPage;