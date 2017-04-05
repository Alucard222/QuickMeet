//BoxGenerator.js
//draws a box given start and end times as well as the start and end days
//takes these times from the findLocation() function in coordinateTracker.js
//Isaac

function drawBox(tStart, tEnd, dStart, dEnd){

    for (a = 0; a<tStart.length; a++) {

        //calculate the change in y length, the difference in start and end time
        deltaY = tEnd[a]-tStart[a];
        //starting x coordinate is determined by the day first clicked on.
        X_coordinate = dStart[a]*tileWidth+tileWidth;
        //width is change in days times the width of the tile
        Width = ((dEnd[a]-dStart[a])*tileWidth)+tileWidth;

        //calculate Y coordinate dynamically
        if (tStart[a]%100 == 0){
            Y_coordinate = ((tStart[a]-700)/100*tileHeight); //selecting whole hours, no need to map pixels
        }else{
            yhours = tStart[a]-700; //offset canvas start point
            yhours = Math.floor(yhours/100); //integer division to grab number of hours 
            yhours = yhours*tileHeight;  //convert number of hours into number of tiles
            Y_coordinate = (tStart[a]%100)/60*tileHeight+yhours; //y coordinate is the fraction of the not whole tile plus any tiles before it
        }

        //calculate Length dynamically
        if((deltaY)%100 == 0){
            Length = deltaY/100*tileHeight;  //selecting whole hours, no need to map pixels
        }else{
            num_hours = Math.floor(deltaY/100); //integer division to grab number of hours
            num_hours = num_hours*tileHeight;   //calculate number of hours hilighted multipled by height of tile
            Length = (deltaY%100)/60*tileHeight+num_hours; //length is the fraction of the remainding tile + number of whole tiles selected
        }

        //console.log("Y_coodinate: " + Y_coordinate + " Length: " + Length);
        ctx.fillStyle = "rgba(128,0,0,0.5)";
        ctx.fillRect(X_coordinate, Y_coordinate, Width, Length);
    }
}
