import React from 'react';
import { Button } from 'grommet';

function Girisekrani (props){
    return(
        <div>
        <h1>sevgilinle beraber müzik eşliğinde hayallar kurmak için Spotify oturumu aç</h1>
        <div> <Button label='Spotify giriş' onClick={props.onClick} /> </div>
        </div>
    );

};
export default Girisekrani
