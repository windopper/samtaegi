import './Menu.css'

export default function Menu() {

    const touchStart = () => {
        console.log('touch')
    }

    return (
        <div className='container-menu'>
            <i className="fa fa-search" id='search-icon' onMouseEnter={touchStart}></i>
        </div>
    )
}