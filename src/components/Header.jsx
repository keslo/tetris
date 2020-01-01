import React from 'react'

function Header({ score, start, btnText, ...props }) {
	return <div className="header">
			<span>Score: { score }</span>
			<button onClick={ start }>{ btnText }</button>
		</div>
}

export default Header;