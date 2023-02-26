import React from 'react'
import EmotionButton from './EmotionButton'
import { useNavigate } from 'react-router-dom'

function EntryDisplayPage(props)
{
    const navigate = useNavigate()

    /* This function accesses the entry's emotion data to display the selected emotions as uneditable buttons, very similar to
       how infoData was parsed in the journal page. */ 
    function displayEmotionData(isUsingPleasantEmotions)
    {
        let broadEmotionsList = {}
        let emotionSentiment = ''

        if (isUsingPleasantEmotions)
        {
            broadEmotionsList = props.entry.emotions.pleasantEmotions
            emotionSentiment = 'pleasantEmotions'
        }
        else
        {
            broadEmotionsList = props.entry.emotions.unpleasantEmotions
            emotionSentiment = 'unpleasantEmotions'
        }

        const emotionElements = []
            
        for (let broadEmotion in broadEmotionsList)
        {
            let emotionButtonElements = []

            if (Object.prototype.hasOwnProperty.call(broadEmotionsList, broadEmotion))
            {
                for (let i = 0; i < broadEmotionsList[broadEmotion].length; i++)
                {
                    let subEmotion = broadEmotionsList[broadEmotion][i]
                    emotionButtonElements.push(<EmotionButton
                                                    entry={props.entry}
                                                    broadEmotion={broadEmotion}
                                                    subEmotion={subEmotion}
                                                    isSelected={props.entry.selectedEmotionData[emotionSentiment][broadEmotion][subEmotion]}
                                                    isEditable={false}
                                                />)
                }
            }

            emotionElements.push(<div className="emotions"><h4>{broadEmotion}:</h4>{emotionButtonElements}</div>)
        }

        return emotionElements
    }

    /* This function displays the date data as a string, depending on the argument passed, which should
       either be 'date' or 'lastEditedDate' to match the entry's properties.  */
    function displayDate(typeOfDate)
    {
        return (
        String(props.findDayName(props.entry[typeOfDate])) + ' | ' +
        (props.entry[typeOfDate].getHours() % 12 === 0 ? '12' : String(props.entry[typeOfDate].getHours() % 12)) +  ':' +
        (props.entry[typeOfDate].getMinutes() < 10 ? '0' + String(props.entry[typeOfDate].getMinutes()) : String(props.entry[typeOfDate].getMinutes())) + " " +
        (props.entry[typeOfDate].getHours() < 12 ? 'AM' : 'PM') + ' | ' +
        String(props.entry[typeOfDate].getMonth() + 1) + '/' + String(props.entry[typeOfDate].getDate()) + '/' + String(props.entry[typeOfDate].getFullYear() % 100))
    }

    /* This function accesses the entry's emotion data and returns emotion information as a string for the downloadable text file. */
    function listOutEmotionsTextFile(emotionSentiment)
    {
        let emotionsListText = ""

        let broadEmotionsList = props.entry.emotions[emotionSentiment]

        for (let broadEmotion in broadEmotionsList)
        {
            emotionsListText += broadEmotion + ": "

            if (Object.prototype.hasOwnProperty.call(broadEmotionsList, broadEmotion))
            {
                for (let i = 0; i < broadEmotionsList[broadEmotion].length; i++)
                {
                    let subEmotion = broadEmotionsList[broadEmotion][i]

                    i === broadEmotionsList[broadEmotion].length - 1 ? emotionsListText += subEmotion : emotionsListText += subEmotion + ", "
                }
            }

            emotionsListText += "\n"
        }

        return emotionsListText
    }

    /* This function generates the shown content in a text file for when the user decides to click the download button. */
    function textFileContent()
    {
        let textFileContent = '(' + props.entry.feelingName + ' ' + props.entry.feelingRating + '/5)\t\t' + displayDate('date')
        textFileContent += "\n\n"
        textFileContent += props.entry.title 
        textFileContent += "\n" + props.entry.title.split('').map(letter => "-" ).join('') + "\n\n"
        textFileContent += props.entry.elaboration
        textFileContent += "\n\n\n\n"
        if ((Object.keys(props.entry.emotions.pleasantEmotions).length !== 0 || Object.keys(props.entry.emotions.unpleasantEmotions).length !== 0))
        {
            textFileContent += "Emotions"
            textFileContent += "\n"
            if (Object.keys(props.entry.emotions.pleasantEmotions).length !== 0)
            {
                textFileContent += "\n"
                textFileContent += "Positive Emotions"
                textFileContent += "\n"
                textFileContent += listOutEmotionsTextFile('pleasantEmotions')
            }
            if (Object.keys(props.entry.emotions.unpleasantEmotions).length !== 0)
            {
                textFileContent += "\n"
                textFileContent += "Negative Emotions"
                textFileContent += "\n"
                textFileContent += listOutEmotionsTextFile('unpleasantEmotions')
            }
            
            textFileContent += "\n\n\n\n"
        }
        if (props.entry.unhelpfulThought)
        {
            textFileContent += 'Unhelpful Thought'
            textFileContent += "\n\n"
            textFileContent += props.entry.unhelpfulThought
            textFileContent += "\n\n\n\n"
        }
        if (props.entry.anotherWayOfThinking)
        {
            textFileContent += 'Challenge / Alternative Thought'
            textFileContent += "\n\n"
            textFileContent += props.entry.anotherWayOfThinking
            textFileContent += "\n\n\n\n"
        }
        if (props.entry.gratefulThought)
        {
            textFileContent += 'Gratitude'
            textFileContent += "\n\n"
            textFileContent += props.entry.gratefulThought
            textFileContent += "\n\n\n\n"
        }

        return textFileContent
    }

    /* This function has the user download a text file titled with the date and the entry title.
       The contents of the file are generated from textFileContent(). */
    const downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([textFileContent()], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        const fileName = String(props.entry.date.getMonth() + 1) + '-' + String(props.entry.date.getDate()) + '-' + String(props.entry.date.getFullYear() % 100) + ' ' + props.entry.title
        element.download = fileName + ".txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    /* This page, the entry display page, displays the tempEntry, or rather an entry that was clicked in the entry list page.
       The page cleanly displays the contents of the entry.
       Three buttons are present at the bottom of the page, which respectively have the following functionality.
            * Edit the entry
            * Download a text file that displays the entry's content similar to the current page
            * Delete the displayed entry
     */

    return (
        <div className='entryDisplayPage'>
            <div className='entryDisplayTopLine'>
                <img src={require('../images/' + props.entry.feelingRating + '.png')} alt='img' className='entryDisplayImg' />
                <div>
                    <p>{displayDate('date')}</p>
                    {props.entry.lastEditedDate && <p>Last Edited: {displayDate('lastEditedDate')}</p>}
                </div>
            </div>
            
            <div className='entryDisplayTitleAndElaboration'>
                <h1 style={{borderBottom: '2px solid ' + props.entry.feelingThemeColor}}>{props.entry.title}</h1>
                <div className='entryDisplayParagraph'>{props.entry.elaboration}</div>
            </div>

            {(Object.keys(props.entry.emotions.pleasantEmotions).length !== 0 || Object.keys(props.entry.emotions.unpleasantEmotions).length !== 0) && <>
            <h1 style={{color: props.entry.feelingThemeColor, marginBottom: '10px'}}>Emotions</h1>
            <div className="bothEmotionLists">
                {Object.keys(props.entry.emotions.pleasantEmotions).length !== 0 && <>
                <div className="emotionList">
                    <h2 className="emotionListTitle">Positive Emotions</h2>
                    {displayEmotionData(true)}
                </div>
                </>}
                {Object.keys(props.entry.emotions.unpleasantEmotions).length !== 0 && <>
                <div className="emotionList">
                    <h2 className="emotionListTitle">Negative Emotions</h2>
                    {displayEmotionData(false)}
                </div>
                </>}
            </div>
            </>}

            {props.entry.unhelpfulThought && <>
            <div>
                <h1 style={{color: props.entry.feelingThemeColor}}>Unhelpful Thought</h1>
                <div className='entryDisplayParagraph'>{props.entry.unhelpfulThought}</div>
            </div>
            </>}

            {props.entry.anotherWayOfThinking && <>
            <div>
                <h1 style={{color: props.entry.feelingThemeColor}}>Challenge / Alternative Thought</h1>
                <div className='entryDisplayParagraph'>{props.entry.anotherWayOfThinking}</div>
            </div>
            </>}

            {props.entry.gratefulThought && <>
            <div>
                <h1 style={{color: props.entry.feelingThemeColor}}>Gratitude</h1>
                <div className='entryDisplayParagraph'>{props.entry.gratefulThought}</div>
            </div>
            </>}

            <div className='displayButtons'>
                <span className='displayButton' onClick={() => navigate('/feeling-rating')}style={{backgroundColor: props.entry.feelingThemeColor}}>Edit</span>
                <span className='displayButton' onClick={downloadTxtFile} style={{backgroundColor: '#223358'}}>Download</span>
                <span className='displayButton' onClick={() => props.handleDelete(props.entry.id)} style={{backgroundColor: 'red'}}>Delete</span>
            </div>
        </div>
    )
}

export default EntryDisplayPage;