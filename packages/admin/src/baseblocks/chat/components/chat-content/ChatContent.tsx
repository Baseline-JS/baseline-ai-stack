import React, { useEffect, useRef, useState } from 'react';
import styles from './ChatContent.module.scss';
import { Input } from 'reactstrap';
import { chatPrompt, ChatPromptResponse } from '@baseline/client-api/chat';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface Message {
  sender: string;
  text: string;
}

const ChatContent = (): JSX.Element => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    if (prompt.length === 0) return;
    setMessages([
      ...messages,
      { sender: 'User', text: prompt },
      { sender: 'AI', text: 'Loading...' },
    ]);
    setPrompt('');
    let response: ChatPromptResponse;
    try {
      response = await chatPrompt(getRequestHandler(), { text: prompt });
    } catch (error) {
      console.error(error);
      let errorMessage = '**An error occurred. Please try again.**';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.response?.data?.error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        errorMessage = error.response.data.error as string;
        if (errorMessage === 'Failed to get response') {
          errorMessage = '**Something went wrong. Please try again.**';
        }
      }
      setMessages([
        ...messages,
        { sender: 'User', text: prompt },
        { sender: 'AI', text: errorMessage },
      ]);
      return;
    }
    const responseText = response.output.message.content[0].text;
    setMessages([
      ...messages,
      { sender: 'User', text: prompt },
      { sender: 'AI', text: responseText },
    ]);
  };

  const containerRef = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    containerRef.current.scrollTo({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className={styles.chat}>
      <div className={styles.conversation} ref={containerRef}>
        {messages.map((message) => (
          <div
            className={`${styles.message} ${
              message.sender === 'AI' ? styles.ai : ''
            }`}
            key={message.text}
          >
            <div className={styles.text}>
              {message.sender === 'AI' ? (
                message.text === 'Loading...' ? (
                  <div className={styles.loader}>
                    <div />
                    <div />
                    <div />
                  </div>
                ) : (
                  <Markdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      code(props) {
                        // eslint-disable-next-line react/prop-types, @typescript-eslint/no-unused-vars
                        const { children, className, node, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                          <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            // eslint-disable-next-line react/no-children-prop
                            children={String(children)}
                            language={match[1]}
                            style={dark}
                            ref={null}
                          />
                        ) : (
                          <code {...rest}>{children}</code>
                        );
                      },
                    }}
                  >
                    {message.text}
                  </Markdown>
                )
              ) : (
                message.text
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.input}>
        <Input
          type="text"
          label="prompt"
          value={prompt}
          placeholder="Type a message..."
          autoFocus
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void handleSubmit();
            }
          }}
        />
        <img
          src="/icons/bolt-circle.svg"
          alt="Send"
          onClick={() => {
            void handleSubmit();
          }}
        />
      </div>
    </div>
  );
};

export default ChatContent;
