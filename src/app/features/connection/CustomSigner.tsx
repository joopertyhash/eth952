import React, { useState } from "react";
import { Select, Fieldset, Button, TextField } from "react95";
import Input from "../common/Input";
import Signers from "../../containers/Signers";

const CustomSigner = () => {
  const [text, setText] = useState("");
  const { attemptSetCustomSigner } = Signers.useContainer();

  return (
   <Fieldset label="Пользовательская подписывающая сторона (необязательно)" style={{ marginBottom: "12px" }}>
      <p>Привыатный ключ / Мнемоника:</p>
      <Input
        style={{ fontSize: `12px` }}
        value={text}
        placeholder="turkey snow danger yearly kale..."
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        fullWidth
        style={{ marginTop: "12px" }}
        onClick={() => {
          attemptSetCustomSigner(text);
        }}
        disabled={text === ""}
      >
        СОЕДИНЕНИЕ
      </Button>
    </Fieldset>
  );
};

export default CustomSigner;
