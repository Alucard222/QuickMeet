//get the username
var user = getParameterByName("username")

//create array to store the events, days is a [][] array
var btimeStart = []
var btimeEnd = []
var bdayStart = []
var bdayEnd = []

//Http 'get' method, store the data in 4 array, and draw box of calendar owner
get_Data("/QuickMeet/default/api/"+"0/"+ user, function(data){
    var jsonData = JSON.parse(data);
    for (var i = 0; i < jsonData.length; i++) {
        btimeStart.push(jsonData[i].startTime)
        btimeEnd.push(jsonData[i].endTime)
        bdayStart.push(jsonData[i].days[0])
        bdayEnd.push(jsonData[i].days[jsonData[i].days.length -1])
    }
    drawBox(btimeStart, btimeEnd, bdayStart, bdayEnd);
} )

//generate the First name of Member which is calendar owner
$('#list').html('<li>' + user + '</li>');

//store all the user in this array
var groupMember = []
var interval = '0'

var colors = ["rgba(0,114,229,0.5)","rgba(0,255,0,0.5)",
              "rgba(255,255,0,0.5)","rgba(255,0,255,0.5)","rgba(255,102,0,0.5)",
              "rgba(34,128,128,0.5)","rgba(102,0,20,0.5)"];
var colorsBoolean = [false, false, false, false, false, false, false];
var colorUser = ["test","test","test","test","test","test","test"];





//the function to add member to group calendar
function add() {
         
          var newUser = $('#member').val();
          console.log('new user is ', newUser);
          if($.inArray(newUser, groupMember) !== -1){
              alert("the user  " + newUser + "  is already in the group!");
              return
          }
            //groupMember.push(newUser);
            
//get the newUser's data, and store the data in temporary
            
                $.get("/QuickMeet/default/api/0/"+ newUser +".json"+ "?timeInterval=" +interval, function(realData) {
                var newTimeStart = []
                var newTimeEnd = []
                var newdayStart = []
                var newdayEnd = []
                for (var i = 0; i < realData.length; i++) {
                    newTimeStart.push(realData[i].startTime)
                    newTimeEnd.push(realData[i].endTime)
                    newdayStart.push(realData[i].days[0])
                    newdayEnd.push(realData[i].days[realData[i].days.length -1])
                }
                groupMember.push(newUser);

            for(var i = 0; i<colorsBoolean.length; i++){
              if(colorsBoolean[i]==false){
                colorUser[i] = "\"" + newUser + "\"";
                drawBox(newTimeStart, newTimeEnd, newdayStart, newdayEnd, colorUser[i]);
                colorsBoolean[i]=true;
                console.log("Color: " + colorUser[i]);
                break;
              }
            }
            if(groupMember.length > colorsBoolean.length){
                drawBox(newTimeStart, newTimeEnd, newdayStart, newdayEnd, null);
            }

            

            var str = $('#list').html();
            $('#list').html(str + '<li>' + newUser + "<button type='button'      onClick='deleteMember(this)'>delete</button>" + '</li>');
              })
            
           
      }


//set time intervel
function setTime() {
          emptyTable();
          reloadTable()
          interval = $('#interval').val();
          if($('#interval').val() == ''){
              interval = "0"
           }
            var memberString = ""
            for(var i = 0; i < groupMember.length; i++){
                memberString = memberString + "/" + groupMember[i];
            }
//get the newUser's data, and store the data in temporary
          $.get("/QuickMeet/default/api/1/"+ user + "/" + memberString +".json" + "?timeInterval=" + interval, function(realData) {
            var newTimeStart = []
            var newTimeEnd = []
            var newdayStart = []
            var newdayEnd = []
            for (var i = 0; i < realData.length; i++) {
                newTimeStart.push(realData[i].startTime)
                newTimeEnd.push(realData[i].endTime)
                newdayStart.push(realData[i].days[0])
                newdayEnd.push(realData[i].days[realData[i].days.length -1])
            }
            ctx.clearRect(0,0,c.width,c.height);
            drawGrid();
            drawBox(newTimeStart, newTimeEnd, newdayStart, newdayEnd, "group");
              
            for(var i = 0; i < newTimeStart.length - 1; i++){
                var str = $('#result').html();
                if(newdayStart[i] == newdayStart[i+1]){
                    str = str + "<tr>" + "<td>" + dayMap(newdayStart[i]) + "</td>" + "<td>" + parseInt(newTimeEnd[i]/100) + ":" + changeTwoDecimal_f(newTimeEnd[i]%100) + "</td>" + "<td>" + parseInt(newTimeStart[i+1]/100) + ":" + changeTwoDecimal_f(newTimeStart[i+1]%100) + "</td>"  + "</tr>";
                }
                $('#result').html(str);
            }

          })
      }


//after delete a member, refresh all the page then reload the data
function refresh(){
        
        //drawBox(btimeStart, btimeEnd, bdayStart, bdayEnd);
        ctx.clearRect(0,0,c.width,c.height);
        emptyTable();
        drawGrid();
        drawBox(btimeStart, btimeEnd, bdayStart, bdayEnd, null);
    
        $('li').empty();
        $('#list').html('<li>' + user + '</li>');
        for(var i = 0; i < groupMember.length; i++){
          $.get("/QuickMeet/default/api/0/"+ groupMember[i] +".json", function(realData) {
            var newTimeStart = []
            var newTimeEnd = []
            var newdayStart = []
            var newdayEnd = []
            for (var i = 0; i < realData.length; i++) {
                newTimeStart.push(realData[i].startTime)
                newTimeEnd.push(realData[i].endTime)
                newdayStart.push(realData[i].days[0])
                newdayEnd.push(realData[i].days[realData[i].days.length -1])
            }

            var temp = "\"" + realData[0].username+"\"";
            drawBox(newTimeStart, newTimeEnd, newdayStart, newdayEnd, temp);
          })
          var str = $('#list').html();
          $('#list').html(str + '<li>' + groupMember[i] + "<button type='button' onClick='deleteMember(this)'>delete</button>" + '</li>');
    }
}

function changeTwoDecimal_f(x) {
    if(x == '0'){
        return "00";
    }else{
    return x;
    }
}


//daymapping
function dayMap(x){
  switch(x){
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Error: Invalid Day";
  }
}

//empty table
function emptyTable(){
    $('#head').empty();
    $('#result').empty();
}
//reload table
function reloadTable(){
    $('#head').html("Possible Time")
    $('#result').html("<tr><th>Day</th><th>From</th><th>To</th></tr>");

}

//delete the group member
function deleteMember(ele){
    var clone = $(ele).parent().clone();
    clone.children().remove();
    var message = clone.text();
    for(i = 0; i<colorsBoolean.length; i++){
      var username = "\""+message+"\"";
      if(username==colorUser[i]){
        colorsBoolean[i] = false;
        colorUser[i] = "\"test\"";
      }
    }
    removeByValue(groupMember, message);
    console.log("Group member: " + message);

    refresh();
}

//function to remove certain value in array
function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}


//return the calendar owner's edit page
function returnEdit(){
        var user = getParameterByName("username")
        window.location.href = "/QuickMeet/default/index?"+"username="+user
}


//function the get the owner's name
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//http 'POST' method
function post_data(URL, tStart, tEnd, dStart, dEnd){
    var x = new XMLHttpRequest();
    x.open('POST', URL, false);
    x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    x.send("timeStart=" + tStart + "&timeEnd=" + tEnd + "&dayStart=" + dStart + "&dayEnd=" + dEnd);
    //alert(x.responseText);
}

//http 'GET' method
function get_Data(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
    //alert(xmlHttp.responseText)

}



function get_data(URL){
    console.log(URL);
    var x = new XMLHttpRequest();
    x.open( "GET", URL, false ); // false for synchronous request
    x.send( null );
    return x.response;
}
