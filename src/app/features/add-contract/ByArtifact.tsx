import React, { useState } from "react";
import styled from "styled-components";
import { Button, TabBody as rTabBody, TextField, Fieldset } from "react95";
import validateRawArtifact from "../../../common/validateRawArtifact";
import Contracts from "../../containers/Contracts";

const TabBody = styled(rTabBody)`
  width: 100%;
  height: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ByAbi = ({ closeModal }) => {
  const { addByArtifact } = Contracts.useContainer();
  const [rawArtifact, setRawArtifact] = useState("");
  const [name, setName] = useState("");
  const isArtifactValid = validateRawArtifact(rawArtifact);

  const handleTextAreaChange = (e) => {
    const rawArtifact = e.target.value;
    setRawArtifact(e.target.value);
    if (validateRawArtifact(rawArtifact)) {
      setName(JSON.parse(rawArtifact).contractName);
    }
  };

  const addContract = () => {
    addByArtifact(JSON.parse(rawArtifact), name);
    closeModal();
  };
  return (
    <>
      <TabBody>
        <p>
          Dapp development tools like Buidler and Truffle produce JSON artifacts
          as a result of compiling Ethereum smart contracts.
        </p>
        <br />
        <TextField
          placeholder="Вставить JSON Артефакт"
          onChange={handleTextAreaChange}
          multiline
          style={{ height: `240px`, fontFamily: "monospace" }}
        />
        <br />
        <Fieldset label="Имя (Необходимо):">
          <p>
           Это может быть что угодно, и вы можете изменить его позже.  Мы выведем это из вашего артефакта JSON, но вы можете изменить его.
          </p>
          <br />
          <TextField
            placeholder="Мое приложение"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Fieldset>
        <ButtonContainer>
          <Button
            fullWidth
            size="lg"
            style={{ marginTop: "1rem" }}
            onClick={closeModal}
          >
            Close
          </Button>
          <Button
            fullWidth
            size="lg"
            style={{ marginTop: "1rem" }}
            onClick={addContract}
            disabled={!isArtifactValid || name.trim() === ""}
          >
            Add Contract by Artifact
          </Button>
        </ButtonContainer>
      </TabBody>
    </>
  );
};
export default ByAbi;
