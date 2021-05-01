import React from 'react';
import {Card , CardContent , Typography} from '@material-ui/core';
import "./InfoBox.css"

function InfoBox({title,active,isRed, cases, total, ...props}) {
    return (
        <Card onClick={props.onClick}  className={`infoBox ${active && "infoBox--selected"} ${
            isRed && "infoBox--red"}`}>
            <CardContent>
                <Typography className='infoBox__title' color='textSecondary'>
                    {title}
                </Typography>

                <h2
          className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`} >{cases}</h2>

                <Typography className='infobox__total' color='textSecondary'>
                <h6>TOTAL</h6> {total}  
                    </Typography> 
            </CardContent>
        </Card>
    )
}

export default InfoBox
