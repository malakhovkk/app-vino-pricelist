import { useState } from "react";
import { TextBox, Button } from "devextreme-react";
import { getChatGpt } from "../../restApi";
export default function ChatGpt() {
  const [input, setInput] = useState();
  const [text, setText] = useState();
  const send = async () => {
    setText(await getChatGpt(input));
  };
  return (
    <>
      <TextBox
        // inputAttr={fullNameLabel}
        showClearButton={true}
        placeholder="Введите запрос..."
        valueChangeEvent="keyup"
        onValueChanged={(e) => setInput(e.value)}
      />
      {/* <input
        type="text"
        name="chatGpt"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      /> */}
      <Button
        text="Submit"
        type="success"
        onClick={send}
        useSubmitBehavior={true}
      />
      <p>{text}</p>
    </>
  );
}
