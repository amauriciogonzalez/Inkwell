import React from "react"
import { useNavigate } from "react-router-dom"

function EntryCreationPage(props)
{
    const navigate = useNavigate()

    function handleClick(isGuided)
    {
        props.newEntry(isGuided)
        navigate('feeling-rating')
    }

    /* The entry creation page is the home page. From two buttons, we can either declare that
       we would want a guided entry or a freeform entry. Either way, the buttons direct the user
       to the feeling rating page on-click. */

    return (
        <div>
        <h1 className='createJournalEntryTitle'>Create a new journal entry here!</h1>
            <h2>Confirm entry type below.</h2>
            <div className='entryTypeButtonsContainer'>
                <h4 className='entryTypeButtons' onClick={() => handleClick(true)}>Guided Entry</h4>
                <h4 className='entryTypeButtons' onClick={() => handleClick(false)}>Freeform Entry</h4>
            </div>
        </div>
    )
}


export default EntryCreationPage;