import React from 'react'
import topBarSvg from '../../assets/images/topBarSvg.svg'

export default function Topbar({title}) {
    return (
            <section>
                <div className="top-bar">
                    <img src={topBarSvg} alt={topBarSvg.name} />
                    <div className="top-bar-heading">
                        <h2>{title}</h2>
                    </div>
                </div>
            </section>
    )
}