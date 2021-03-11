import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import Parse from 'parse/react-native';

export const Chat = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let client = new Parse.LiveQueryClient({
      applicationId: 'bbu7p4atzxhrVg4o1l9ukhUthwY6QmgFm2Jc93Fu',
      serverURL: 'wss://' + 'reactnativechat.b4a.io',
      javascriptKey: 'xQpQqYUPuduHFf8epuk3EJAInrDaBYFrVI5a08dl',
    });
    client.open();

    let query = new Parse.Query('Messages');
    query.ascending('createdAt');
    query.limit(1);
    let subscription = client.subscribe(query);

    subscription.on('create', (messageParse) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, {
          _id: messageParse.id,
          text: messageParse.get('message'),
          createdAt: new Date(),
          user: {
            _id: '12345',
            name: 'Back4app',
            avatar: 'https://i.pravatar.cc/300',
          },
        }))
    })
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

    const Message = Parse.Object.extend("Message");
    const thisMessage = new Message();
    thisMessage.set("content", messages[0].text);
    thisMessage.save()
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
};
