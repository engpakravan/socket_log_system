moment.loadPersian({usePersianDigits: true})

var socket = io.connect('http://localhost:9092', {'forceNew': true});

var user = getUser() || generateUser();
var room = getRoom() || generateRoom()

function changeRoom(room = "84"){
  socket.emit('room' , room)
  let beforeRoom = JSON.parse(localStorage.getItem('room'))
  beforeRoom.roomName = room
  localStorage.setItem('room' , JSON.stringify(beforeRoom))
}

function getRoom(){
  const Room = localStorage.getItem('room')
  if(Room) return JSON.parse(Room)
  else false
}

function getUser(){
  const user = localStorage.getItem('user');
  if(user){
    return JSON.parse(user)
  }
  return false;
}

function generateUser(){
  var uid, uname;
  uid = generateRandom();
  uname = prompt('Please enter your name to enter to a room');
  if(uname==""){
    uname="Guest";
  }
  user= {'id': uid, 'name': uname};
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

function generateRoom(){
  let roomId = generateRandom()
  let roomName = prompt("Please Enter name Of Your Room")
  if(roomName == "") roomName="1"
  rooms = {roomId , roomName}
  localStorage.setItem('room' , JSON.stringify(rooms))
  changeRoom(JSON.parse(localStorage.getItem('room')).roomName)
  return rooms
}

function generateRandom(){
  return Math.floor(Math.random() * 1e11);
}

var messageCache;
socket.on('message', function(data){
  console.log("Message Arrived" , data)
  messageCache = data;
  render();
});

function render(){
  var data = messageCache;
  document.getElementById('messages').innerHTML = `
    <div class="row">
        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
            <div class="name"><span class="btn btn-danger">${data.result.senderId}</span> گفت: ${data.result.text}</div>
            <div class="time">${data.result.createdAtJalali}</div><br>
            <div class="alert alert-danger">${data.result.type}</div>
        </div>
     </div>
  `
}

function sendMessage(){
  var text = document.getElementById('message').value;
  const message = {
    message_id : generateRandom(),
    body : text ,
    conversation_id : room.roomName , 
    user_id : user.name,
    time : "18:29" , // This is Time Of Now 
    type : text == "file" ? ("file") : ("text") , // I Handle It From My Client Becuse I Not Have File Uploader
    created_at : Date.now(),
  }
  socket.emit('new_message', message);
  document.getElementById('message').value="";
  return false;
}

socket.on('textChanged' , textChanged => {
  console.log("TextChanged" , textChanged)
  document.getElementById('warning').innerText = textChanged
})