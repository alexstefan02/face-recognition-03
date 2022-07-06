import React from 'react';


const Rank = ({name,entries}) =>{

	return(
		<div>
			<div className = 'white b f3'>
			{`${name}, you detected...`}
			</div>
			<div className = 'white b f1'>
			{`${entries} faces`}
			</div>
		</div>
		
		);

}



export default Rank;