import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onButtonSubmit}) =>{
	return(
		<div>
			<p className='f3'>
				{'This Brain will detect faces in pictures. Give it a try!'}
			</p>
			<div className='center'>
				<div className='center form pa4 br3 shadow-5'>
					<input className='f4 pa2 w-70 center ba b--white-90' type='tex'  onChange= {onInputChange} />
					<button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple ba b--white-90' onClick={onButtonSubmit}>Detect</button>
				</div>
			</div>
		</div>
	);
}
 
export default ImageLinkForm;