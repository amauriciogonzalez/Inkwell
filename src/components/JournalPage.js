import React from "react"
import infoData from '../infoData'
import EmotionButton from "./EmotionButton"
import * as indentation from 'indent-textarea';

function GuidedPage(props)
{

    /* This function takes the emotion data from infoData.js and creates emotionElements, an array of JSX elements.
       This is used to display all of the clickable emotion buttons to toggle and indicate what the user is experiencing. */
    function parseInfoData(isUsingPleasantEmotions, data)
    {

        let broadEmotionsList
        let emotionSentiment = ''

        if (isUsingPleasantEmotions)
        {
            broadEmotionsList = data.emotions.pleasantEmotions
            emotionSentiment = 'pleasantEmotions'
        }
        else
        {
            broadEmotionsList = data.emotions.unpleasantEmotions
            emotionSentiment = 'unpleasantEmotions'
        }

        /* Each element in emotion elements is a line for the display of pleasant or unpleasant emotions, showing the broad
           emotion and three respective buttons that show subemotions. Ex. Open: Confident Free Satisfied */
        const emotionElements = []
            
        /* We loop through all of the properties of the emotion sentiment from infoData.js, which are the broad emotions,
           to fill the emotionElements array. */
        for (let broadEmotion in broadEmotionsList)
        {
            /* emotionButtonElements holds the array of three buttons that are sub-emotions for the broad emotion. */
            let emotionButtonElements = []

            if (Object.prototype.hasOwnProperty.call(broadEmotionsList, broadEmotion))
            {
                /* For every sub-emotion listed under the broad emotion, we create a button for this sub-emotion. */
                for (let i = 0; i < broadEmotionsList[broadEmotion].length; i++)
                {
                    let subEmotion = broadEmotionsList[broadEmotion][i]
                    emotionButtonElements.push(<EmotionButton
                                                    entry={props.entry}
                                                    broadEmotion={broadEmotion}
                                                    subEmotion={subEmotion}
                                                    handleAddEmotion={() => props.handleAddEmotion(broadEmotion, subEmotion, isUsingPleasantEmotions)}
                                                    isSelected={props.entry.selectedEmotionData[emotionSentiment][broadEmotion][subEmotion]}
                                                    isEditable={true}
                                                />)
                }
            }

            emotionElements.push(<div className="emotions"><h4>{broadEmotion}:</h4>{emotionButtonElements}</div>)
        }

        return emotionElements
    }

    // From indent-textarea, these two lines allow listening for tab and shift+tab to indent and unindent respectively.
    React.useEffect(function() {
        const textarea = document.querySelectorAll('textarea');
        indentation.watch(textarea);
    }, [])

    const styleButton = {
        backgroundColor: props.entry.feelingThemeColor,
        color: "white",
        margin: '80px 0px'
    }


    /* This page, the journal page, is where the user inputs and fills out the rest of the information for the journal entry.
       The user is only able to access one text area below title input if the user desired a freeform entry. Otherwise, if
       the entry is guided, the user can click on emotions that they're experiencing, write an unhelpful thought, challenge
       this unhelpful thought, and/or write what they are grateful for. When submitted, the entry, tempEntry, is appended to
       the list of entries. */

    return(
        <div className="journalPage">
            {props.entry.isGuided &&
            (<><h1>What emotions are you experiencing?</h1>
            <div className="bothEmotionLists">
                <div className="emotionList">
                    <h2 className="emotionListTitle">Pleasant Emotions</h2>
                    {parseInfoData(true, infoData)}
                </div>
                <div className="emotionList">
                    <h2 className="emotionListTitle">Unpleasant Emotions</h2>
                    {parseInfoData(false, infoData)}
                </div>
            </div></>)}

            <div className='journalInputArea'>
                {props.entry.isGuided && <h1>Elaborate on what you are experiencing.</h1>}
                <input 
                    className="entryTitleFreeform"
                    style={{borderBottom: '10px solid ' + props.entry.feelingThemeColor, marginTop: props.entry.isGuided ? '0px' : '100px'}}
                    type='text'
                    placeholder='Title'
                    onChange={props.handleChange}
                    name='title'
                    value={props.entry.title}
                />
                <textarea
                    placeholder='Description'
                    onChange={props.handleChange}
                    name='elaboration'
                    value={props.entry.elaboration}
                    style={{border: '1px solid ' + props.entry.feelingThemeColor}}
                />
            </div>

            {props.entry.isGuided &&
            <>
            <div className='journalInputArea'>
                <h1>What unhelpful thought do you have?</h1>
                <textarea
                    placeholder='Unhelpful thought'
                    onChange={props.handleChange}
                    name='unhelpfulThought'
                    value={props.entry.unhelpfulThought}
                    style={{border: '1px solid ' + props.entry.feelingThemeColor}}
                />
            </div>

            <div className='journalInputArea'>
                <h1>How can you challenge this thought? What is another way of thinking about it?</h1>
                <textarea
                    placeholder='Alternative perspective'
                    onChange={props.handleChange}
                    name='anotherWayOfThinking'
                    value={props.entry.anotherWayOfThinking}
                    style={{border: '1px solid ' + props.entry.feelingThemeColor}}
                />
            </div>

            {props.entry.feelingRating >= 4 && <div className='journalInputArea'>
                <h1>What are you currently grateful for?</h1>
                <textarea
                    placeholder='Grateful thought'
                    onChange={props.handleChange}
                    name='gratefulThought'
                    value={props.entry.gratefulThought}
                    style={{border: '1px solid ' + props.entry.feelingThemeColor}}
                />
            </div>}
            </>}

            <button className='continue' style={styleButton} onClick={props.handleSubmit}>Finish Journal Entry</button>


        </div>
    )
}

export default GuidedPage;