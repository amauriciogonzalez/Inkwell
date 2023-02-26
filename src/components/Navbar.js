import React from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar()
{
    const navigate = useNavigate()

    /* From the navbar we can navigate to the following: 
            * The entry creation page.
            * The previous entry list page.
    */

    return (
        <nav>
            <img src={require('../images/ink.png')} alt='ink' className='logo'/>
            <h3>Inkwell</h3>
            <img 
                src={require('../images/quill.png')}
                alt='quill'
                className='icon'
                onClick={() => navigate('/')}
            />
            <img 
                src={require('../images/journal.png')}
                alt='journal'
                className='icon'
                onClick={() => navigate('/entries')}
                
            />
        </nav>
    )
}

export default Navbar;