import React from 'react'

function EmotionButton(props)
{
    const styleEmotionButton = {
        color: props.isSelected ? 'white' : props.entry.feelingThemeColor,
        border: '2px solid ' + props.entry.feelingThemeColor,
        backgroundColor: props.isSelected ? props.entry.feelingThemeColor : 'transparent',
        cursor: props.isEditable ? 'pointer' : "default",
    }

    /* This button displays a sub-emotion for a broad emotion (Ex. Confident in Open). When clicked,
       the button is filled and the sub-emotion is saved into the entry's property data */

    return (
        <span
            className="emotionButton"
            style={styleEmotionButton}
            onClick={props.isEditable ? props.handleAddEmotion : null}
        >
            {props.subEmotion}
        </span>
    )
}

export default EmotionButton;