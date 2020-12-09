var firebaseConfig = {
    apiKey: "AIzaSyCxA_uyGazQQ2IPNfHRuuNW2z1sIsgy9yE",
    authDomain: "laravelfcm-2bfc2.firebaseapp.com",
    databaseURL: "https://laravelfcm-2bfc2.firebaseio.com",
    projectId: "laravelfcm-2bfc2",
    storageBucket: "laravelfcm-2bfc2.appspot.com",
    messagingSenderId: "97175421000",
    appId: "1:97175421000:web:30e8eca25e866fd352187d",
    measurementId: "G-0WEX4NQCB7"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

console.log("Firebase connected");

// get current username
var name = window.prompt("Enter your name");

// Getting all message and listeing real time chat

db.collection("chats").orderBy("date").onSnapshot(function(snapshot){

    snapshot.docChanges().forEach(function(change,ind){
        var data = change.doc.data();
        // if new message added
        if(change.type == "added"){

            if(data.senderName == name){ //Which message i sent 

                var html = `<li class="left clearfix">
                    <span class="chat-img pull-left">
                        <img src="http://placehold.it/50/55C1E7/fff&text=${data.senderName}" alt="User Avatar" class="img-circle" />
                    </span>
                    <div class="chat-body clearfix">
                        <div class="header">
                            <strong class="primary-font">${data.senderName}</strong> <small class="pull-right text-muted">
                                <span class="glyphicon glyphicon-time"></span>${data.date}</small>
                        </div>
                        <p id="${change.doc.id}-message">
                            ${data.message}
                        </p>
                        <span onclick="deleteMessage('${change.doc.id}')" class="glyphicon glyphicon-trash"></span> 
                    </div>
                </li>`;

                $('.chat').append(html);

            }else{

                var html = `<li class="right clearfix">
                    <span class="chat-img pull-right">
                        <img src="http://placehold.it/50/FA6F57/fff&text=${data.senderName}" alt="User Avatar" class="img-circle" />
                    </span>
                    <div class="chat-body clearfix">
                        <div class="header">
                            <small class=" text-muted">
                                <span class="glyphicon glyphicon-time"></span>${data.date}</small>
                            <strong class="pull-right primary-font">${data.senderName}</strong>
                        </div>
                        <p id="${change.doc.id}-message">
                            ${data.message}
                        </p>
                        <span onclick="deleteMessage('${change.doc.id}')" class="glyphicon glyphicon-trash"></span> 
                    </div>
                </li>`;

                $('.chat').append(html);

            }
            if(snapshot.docChanges().length - 1 == ind){ // we will scoll down on last message
                // auto scroll
                $(".panel-body").animate({ scrollTop: $('.panel-body').prop("scrollHeight")}, 1000);
            }
        }

        if(change.type == "modified"){

        }

        if(change.type == "removed"){

            $("#"+change.doc.id+"-message").html("this message has been deleted")

        }

    })  

})

function sendMessage(object){
    console.log(object)
    db.collection("chats").add(object).then(added => {
        console.log("message sent ",added)
    }).catch(err => {
        console.err("Error occured",err)
    })

}

function deleteMessage(doc_id){
    var flag = window.confirm("Are you sure to want delete ?")

    if(flag){

        db.collection("chats").doc(doc_id).delete();
        console.log("Deleted");

    }
}

// on click function
$('.send-button').click(function(){

    var message = $('#btn-input').val();

    if(message){
        // insert message 

        sendMessage({
            senderName : name,
            message : message,
            date : moment().format("YYYY-MM-DD HH:mm")
        })

        $('#btn-input').val("")
    }

})

// also we will send message when user enter key
$('#btn-input').keyup(function(event) {

    // get key code of enter
    if(event.keyCode == 13){ // enter
       var message = $('#btn-input').val();

        if(message){
            // insert message 

            sendMessage({
                senderName : name,
                message : message,
                date : moment().format("YYYY-MM-DD HH:mm")
            })

            $('#btn-input').val("")
        }
    }
    // console.log("Key pressed");
})

