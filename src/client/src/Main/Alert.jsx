import { useState } from 'react'
import './Alert.css'

export default function Alert() {

    const [alert, setAlert] = useState([])

    return (
        <div className='alert-container'>
            {alert}
        </div>
    )
}