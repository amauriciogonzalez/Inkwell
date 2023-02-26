import React from 'react'
import { nanoid } from 'nanoid'
import {Routes, Route, useNavigate} from 'react-router-dom'
import infoData from './infoData'
import Navbar from './components/Navbar'
import EntryCreationPage from './components/EntryCreationPage'
import FeelingRatingPage from './components/FeelingRatingPage'
import JournalPage from './components/JournalPage'
import EntryListPage from './components/EntryListPage'
import EntryDisplayPage from './components/EntryDisplayPage'


function App()
{
    const navigate = useNavigate()

    const [entries, setEntries] = React.useState(function() {
        let returnedEntries = JSON.parse(localStorage.getItem('entries'))
        if (returnedEntries === null)
        {
            return []
        }
        else
        {
            /* For some reason, when retrieving the entries from local storage, the date objects in entry data get converted to 
               strings. So, we undo that operation. */
            for (let i = 0; i < returnedEntries.length; i++)
            {
                returnedEntries[i] = {
                    ...returnedEntries[i],
                    date: new Date(String(returnedEntries[i].date)),
                    lastEditedDate: !returnedEntries[i].lastEditedDate ? null : new Date(String(returnedEntries[i].lastEditedDate))
                }
            }
            
            return returnedEntries
        }
    })
    const [tempEntry, setTempEntry] = React.useState(function() {
        let returnedTempEntry = JSON.parse(localStorage.getItem('tempEntry'))
        if (returnedTempEntry === null)
        {
            return generateNewEntry()
        }
        else
        {
            returnedTempEntry = {
                ...returnedTempEntry,
                date: !returnedTempEntry.date ? null : new Date(String(returnedTempEntry.date)),
                lastEditedDate: !returnedTempEntry.lastEditedDate ? null: new Date(String(returnedTempEntry.lastEditedDate))
            }

            return returnedTempEntry
        }
    })

    React.useEffect(function() {
        localStorage.setItem('entries', JSON.stringify(entries))
    }, [entries])
    React.useEffect(function() {
        localStorage.setItem('tempEntry', JSON.stringify(tempEntry))
    }, [tempEntry])

    /* This function takes all the infoData emotions, copies them onto selectedEmotions (which gets returned),
       and initializes all the sub-emotions to false, which would be switched to true when their respective
       EmotionButton is toggled.  */
    function startSelectedEmotionData()
    {
        let selectedEmotions = {
            'pleasantEmotions': {},
            'unpleasantEmotions': {}
        }

        function initializeSelectedEmotionData(emotionSentiment)
        {
            for (let broadEmotion in infoData.emotions[emotionSentiment])
            {
                let broadEmotionObject = {}

                if (Object.prototype.hasOwnProperty.call(infoData.emotions[emotionSentiment], broadEmotion))
                {
                    for (let i = 0; i < infoData.emotions[emotionSentiment][broadEmotion].length; i++)
                    {
                        let subEmotion = infoData.emotions[emotionSentiment][broadEmotion][i]
                        broadEmotionObject[subEmotion] = false                  
                    }
                }

                selectedEmotions[emotionSentiment][broadEmotion] = broadEmotionObject
            }
        }

        initializeSelectedEmotionData('pleasantEmotions')
        initializeSelectedEmotionData('unpleasantEmotions')

        return selectedEmotions
    }

    function generateNewEntry(isGuided=null)
    {
        let newEntry = {
            id: nanoid(), // A tiny, secure, URL-friendly, unique string ID generator for JavaScript.
            isGuided: isGuided,
            feelingRating: "",
            feelingName: "",
            feelingThemeColor: "",
            emotions: {
                'pleasantEmotions': {},
                'unpleasantEmotions': {}
            },
            selectedEmotionData: startSelectedEmotionData(),
            title: "",
            elaboration: "",
    
            /* Below is for analyzing thoughts. Okay and below. */
            // What unhelpful thought do you have?
            unhelpfulThought: "",

            // Does your thought contain any distortions?
            // How can you challenge your thought?
            // What is another way of thinking about this?
            anotherWayOfThinking: "",
    
            /* Below is for practicing gratitude. Good and above. */
            // What are you grateful for?
            gratefulThought: "",

            date: null,
            lastEditedDate: null
        }

        return newEntry
    }

    /* Whenever the feelingRating changes in the entry, we change the feelingName and color. */
    React.useEffect(function() {
        let feelingName = ""
        let feelingThemeColor = ""
        

        if (tempEntry.feelingRating === '1')
        {
            feelingName = 'Terrible'  
            feelingThemeColor = "#8a9991" 
        }
        else if (tempEntry.feelingRating === '2')
        {
            feelingName = "Bad"
            feelingThemeColor = "#007500"
        }
        else if (tempEntry.feelingRating === '3')
        {
            feelingName = "Okay"
            feelingThemeColor = "#00a4d7"
        }
        else if (tempEntry.feelingRating === '4')
        {
            feelingName = "Good"
            feelingThemeColor = "#9400fd"
        }
        else if (tempEntry.feelingRating === '5')
        {
            feelingName = "Terrific"
            feelingThemeColor = "#eb4e00"
        }

        setTempEntry(function(tempEntry) {
            return {
                ...tempEntry,
                feelingName: feelingName,
                feelingThemeColor: feelingThemeColor
            }
        })
    }, [tempEntry.feelingRating])

    const styleThemeColor = {
        color: tempEntry.feelingThemeColor
    }

    const styleButton = {
        backgroundColor: tempEntry.feelingThemeColor,
        color: "white"
    }

    /* This function sets the tempEntry state as a new generated entry with information
       already initialized indicating whether or not the entry is guided. */
    function newEntry(isGuided)
    {
        setTempEntry(generateNewEntry(isGuided))
    }

    function ratingChange(rating)
    {
        setTempEntry(function(tempEntry) {
            return ({
                ...tempEntry,
                feelingRating: String(rating)
            })
        })
    }

    // A function to update the state on every keystroke within a journal entry.
    function handleChange(event)
    {
        setTempEntry(function(tempEntry) {
            const {name, value} = event.target

            return ({
                ...tempEntry,
                [name]: value
            })
        })
    }

    /* This function is evoked when submitting an entry in the journal page. */
    function handleSubmit()
    {
        let indexOfEdit = entries.map(entry => entry.id).indexOf(tempEntry.id)

        /* If the current entry is an entry in the list of entries... That is, if 
           we are editing an established entry... */
        if (indexOfEdit !== -1)
        {
            // ... then update the entry and set the last edit date.
            setEntries(function(entries) {
                let updatedEntries = [...entries]
                updatedEntries[indexOfEdit] = { ...tempEntry, lastEditedDate: new Date()}
                return updatedEntries
            })
        }
        else
        {
            // ... Otherwise, append the entry to the list of entries and set the date.
            setEntries(function(entries) {
                return [{ ...tempEntry, date: new Date()}, ...entries]
            })
        }

        setTempEntry(generateNewEntry())
        navigate('/entries')
    }

    /* This function saves a sub-emotion when clicked in a journal entry's edit. */
    function handleAddEmotion(broadEmotion, subEmotion, isUsingPleasantEmotions)
    {
        setTempEntry(function(tempEntry) {
            let newTempEntry = {
                ...tempEntry
            }

            let emotionSentiment = ''

            if (isUsingPleasantEmotions)
            {
                emotionSentiment = 'pleasantEmotions'
            }
            else
            {
                emotionSentiment = 'unpleasantEmotions'
            }

            // If the subemotion is already selected...
            if (tempEntry.selectedEmotionData[emotionSentiment][broadEmotion][subEmotion])
            {
                // ... remove it from the list of emotions in the entry...
                newTempEntry.emotions[emotionSentiment][broadEmotion] = newTempEntry.emotions[emotionSentiment][broadEmotion].filter(function(emotion){
                    return emotion !== subEmotion
                })

                // and delete the empty list of sub-emotions if the broad emotion list is empty
                if (newTempEntry.emotions[emotionSentiment][broadEmotion].length === 0)
                {
                    delete newTempEntry.emotions[emotionSentiment][broadEmotion]
                }
                
            }
            else // If the sub-emotion is not selected...
            {
                // ... if a list of sub-emotions under the broad emotions exists, push the sub-emotion onto the array.
                if (newTempEntry.emotions[emotionSentiment][broadEmotion])
                {
                    newTempEntry.emotions[emotionSentiment][broadEmotion].push(subEmotion)
                }
                // Otherwise, start the array via [subEmotion].
                else
                {
                    newTempEntry.emotions[emotionSentiment][broadEmotion] = [subEmotion]
                }
            }

            // Now set the sub-emotion to be recognized as selected.
            newTempEntry.selectedEmotionData[emotionSentiment][broadEmotion][subEmotion] = !tempEntry.selectedEmotionData[emotionSentiment][broadEmotion][subEmotion]

            return newTempEntry
        })
    }

    /* When an EntryCard is clicked, its corresponding entry id is passed
       to retrieve entry information to set it as tempEntry. The user is then
       navigated to the entry display page in order to display tempEntry's contents. */
    function handleDisplayEntry(id)
    {
        let clickedEntry =  entries.find(entry => {
            return entry.id === id
        }) || entries[0]

        setTempEntry(clickedEntry)

        navigate('/entry-display')
    }

    // This function accepts a Date object and returns the day name.
    function findDayName(date)
    {
        let day = date.getDay()

        if (day === 0)
        {
            day = 'Sunday'
        }
        else if (day === 1)
        {
            day = 'Monday'
        }
        else if (day === 2)
        {
            day = 'Tuesday'
        }
        else if (day === 3)
        {
            day = 'Wednesday'
        }
        else if (day === 4)
        {
            day = 'Thursday'
        }
        else if (day === 5)
        {
            day = 'Friday'
        }
        else
        {
            day = 'Saturday'
        }

        return day
    }

    // This function deletes the entry with the passed id from entries.
    function handleDelete(id)
    {
        if (window.confirm('Are you sure you wish to delete this entry?'))
        {
            navigate('/entries')

            setEntries(function(entries) {
                let updatedEntries = entries.filter(function(entry) {
                    return entry.id !== id
                })

                return updatedEntries
            })
        }
    }

    
    // Use for debugging.
    console.log('tempEntry = ')
    console.log(tempEntry)
    console.log('entries = ')
    console.log(entries)
    

    return (
        <div className="app">
            <Navbar />
            <Routes>
                <Route path='/' element={<EntryCreationPage newEntry={newEntry} />} />
                <Route path='/feeling-rating' element={<FeelingRatingPage
                                                            entry={tempEntry}
                                                            ratingChange={ratingChange}
                                                            styleThemeColor={styleThemeColor}
                                                            styleButton={styleButton}                        
                                                      />}
                />
                <Route path='/journal' element={<JournalPage
                                                     entry={tempEntry}
                                                     handleChange={handleChange}
                                                     handleAddEmotion={handleAddEmotion}
                                                     handleSubmit={handleSubmit}                                            
                                                />}
                />
                <Route path='/entries' element={<EntryListPage
                                                     entries={entries}
                                                     handleDisplayEntry={handleDisplayEntry}
                                                     findDayName={findDayName}
                                                />}
                 />
                <Route path='/entry-display' element={<EntryDisplayPage
                                                            entry={tempEntry}
                                                            findDayName={findDayName}
                                                            handleDelete={handleDelete}
                                                     />}
                />
            </Routes>
        </div>
    );
}


export default App;
