import React, { useEffect, useRef, useState } from 'react';
import styles from './ChatContent.module.scss';
import { Button, Input } from 'reactstrap';
import { chatPrompt } from '@baseline/client-api/chat';
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
    setMessages([
      ...messages,
      {
        sender: 'User',
        text: prompt,
      },
      {
        sender: 'AI',
        text: 'Loading...',
      },
    ]);
    setPrompt('');
    const response = await chatPrompt(getRequestHandler(), { text: prompt });
    setMessages([
      ...messages,
      {
        sender: 'User',
        text: prompt,
      },
      {
        sender: 'AI',
        text: response.output.message.content[0].text,
      },
    ]);

    console.log(JSON.stringify(response.output.message.content[0].text));
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
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.text}
                </Markdown>
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
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void handleSubmit();
            }
          }}
        />
        <Button
          color="primary"
          onClick={() => {
            void handleSubmit();
          }}
        >
          &nbsp;&gt;&nbsp;
        </Button>
      </div>
    </div>
  );
};

export default ChatContent;
