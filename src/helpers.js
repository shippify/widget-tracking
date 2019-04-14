import $ from 'jquery';

export function openChatWindow(deliveryObj, isMonitor){
    let clientUser = {
      name: decodeURI(deliveryObj.recipient.name) + "-" + deliveryObj.deliveryId,
      email: deliveryObj.recipient.email,
      type:"client",
      deliveryId: deliveryObj.deliveryId
     }
    if(deliveryObj.recipient.chatId){
        clientUser.monkeyId=deliveryObj.recipient.chatId
    }
    if($("#my-chat").is(":visible")){
      closeChat()
      return
    }else{
      $("#my-chat").show()
    }
    if($("#my-chat").children().length)
    {
      return;
    }
    activeChat(clientUser, deliveryObj, new Date(), isMonitor);
  }

  export function closeChat(){
    $("#my-chat").hide()
  }

  export function activeChat(clientUser, deliveryObj, chatOpenTime, isMonitor){
    
    const courierName=decodeURI(deliveryObj.shipper.name !== "null" ? deliveryObj.shipper.name:"default_shipper_name_label");
    const courierUserToChat = {
      monkeyId:deliveryObj.shipper.chatId,
      name:courierName,
      courierId: deliveryObj.shipper.id
    }
    window.initChat(clientUser,courierUserToChat, (error, res)=>{
      console.log("Chat started ", error)
      setTimeout(() => {cleanChatEvents({chatOpenTime, isMonitor})},3000)
    });
  }

  export function cleanChatEvents(data){
      const {chatOpenTime, isMonitor} = data; 
    if($(".mky-conversation-selected-header").length===0){
      // assure that the conversation exists
      // can stay in a loop
      const secondsLoading=( (new Date().getTime()) - chatOpenTime.getTime() ) /1000
      if(secondsLoading>300){
        return
      }
      setTimeout(() => {cleanChatEvents(data)},500)
      return
    }
    $(".mky-conversation-selected-header").append(
      "<img src=\"https://cdn.shippify.co/dash/import/img/import-close.svg\" style=\"padding-right: 24px; cursor:pointer\"/>"
    );
    $(".mky-signature").remove()
    $(".mky-conversation-selected-header").click(function(e) {
           e.stopPropagation();
           closeChat()
    });
    if(isMonitor){
      $("#mky-chat-input").hide()
    }
  }
  export function loadSourceChat() {
      const source = document.getElementById('clientChat')
      if (!source) {
          const script = document.createElement('script')
          script.src = 'https://cdn.shippify.co/dash/src/chat/clientChat.1.1.js'
          script.id = 'clientChat'
          document.body.appendChild(script)
          script.onload = () => { console.log('load vaina');
          }
      }
      

  }