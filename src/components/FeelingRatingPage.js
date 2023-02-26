import React from 'react'
import { useNavigate } from 'react-router-dom'

function FeelingRatingPage(props)
{
    const navigate = useNavigate()

    function timeOfDay()
    {
        const time = new Date()
        let hours = time.getHours()
        if (hours < 12)
        {
            return "morning"
        }
        else if (hours < 18)
        {
            return "afternoon"
        }
        else
        {
            return "evening"
        }
    }

    function handleClick()
    {
        navigate('/journal')
    }

    /* The user is greeted, referencing the time of day. They also have a choice of five different feelings,
       rating from 1 (Terrible) to 5 (Terrific). Clicking one of these ratings generates a button to continue,
       which navigates the user to the journal page. */

    return (
        <div className='feelingRating'>
                <h2 className='feelingRatingTitle'>Good {timeOfDay()}! How are you?</h2>
                <div className='lineOfFaces'>
                    <img
                        src={require('../images/1.png')}
                        alt='1'
                        className='ratingFace'
                        onClick={() => props.ratingChange('1')}
                    />
                    <img
                        src={require('../images/2.png')}
                        alt='2'
                        className='ratingFace'
                        onClick={() => props.ratingChange('2')}
                    />
                    <img
                        src={require('../images/3.png')}
                        alt='3'
                        className='ratingFace'
                        onClick={() => props.ratingChange('3')}
                    />
                    <img
                        src={require('../images/4.png')}
                        alt='4'
                        className='ratingFace'
                        onClick={() => props.ratingChange('4')}
                    />
                    <img
                        src={require('../images/5.png')}
                        alt='5'
                        className='ratingFace'
                        onClick={() => props.ratingChange('5')}
                    />
                </div>
                <p style={props.styleThemeColor}>{props.entry.feelingName}</p>
                {props.entry.feelingRating && <button className='continue' style={props.styleButton} onClick={handleClick}>Continue</button>}
            </div>
    )
}

export default FeelingRatingPage;

