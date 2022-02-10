import React, { useState } from "react";
import styled from "styled-components";
import { Panel, Fieldset, Divider } from "react95";

import Network from "../../containers/Network";
import ContractAddress from "../../containers/ContractAddress";
import Input from "../common/Input";

const containerWidth = 475;
const Container = styled(Fieldset)`
  display: flex;
  width: ${containerWidth}px;
  min-width: ${containerWidth}px;
  display: flex;
  flex-direction: column;
`;

const AddressPanel = styled(Panel)`
  padding: 0.1rem 0.25rem;
  width: 100%;
  font-size: 14px;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  line-height: 20px;
  // margin-top: 1rem;
`;

const AddressInfo = () => {
  const [inputText, setInputText] = useState("");
  const { network } = Network.useContainer();
  const {
    addressFromArtifact,
    setCustomAddress,
    address,
  } = ContractAddress.useContainer();
  return (
    <Container label="Информация об адресе">
      <div>Custom:</div>
      <Input
        placeholder="Вставьте развернутый контракт сюда...."
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
          setCustomAddress(e.target.value);
        }}
      />

      <div>
        <div style={{ marginTop: `1rem` }}>
          From artifact @ network {network?.name}{" "}
          {network && `(${network?.chainId})`}:
        </div>
        <AddressPanel variant="well">
          {addressFromArtifact || "В артефакте адрес не найден"}
        </AddressPanel>
        <Divider style={{ marginTop: `1rem` }} />
        <div style={{ marginTop: `1rem` }}>
          <strong>Selected contract address:</strong>
        </div>
        <AddressPanel variant="well">
          {address || "Недействительный адрес, вызов функции завершится ошибкой"}
        </AddressPanel>
      </div>
    </Container>
  );
};

export default AddressInfo;
