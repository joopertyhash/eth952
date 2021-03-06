import React from "react";
import styled from "styled-components";
import { Fieldset, Button } from "react95";
import OutputLogContainer from "../../containers/OutputLog";

const Container = styled(Fieldset)`
  display: flex;
  flex-grow: 1;
  position: relative;
  margin-left: 16px;
`;

const Content = styled.div`
  position: absolute;
  top: 16px;
  left: 12px;
  right: 16px;
  bottom: 12px;
  overflow: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column-reverse;

  font-family: monospace;
  font-size: 12px;
`;

const LogItem = styled.div`
  overflow-wrap: anywhere;
`;

const ClearButton = styled(Button)`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const OutputLog = () => {
  const { logItems, clear } = OutputLogContainer.useContainer();
  return (
    <Container label="Лог">
      <Content className="output-log">
        {logItems.map((logItem, i) => (
          <LogItem key={i} className="output-log-item">
            {logItem}
          </LogItem>
        ))}
      </Content>
      <ClearButton onClick={clear}>Очистить</ClearButton>
    </Container>
  );
};

export default OutputLog;
