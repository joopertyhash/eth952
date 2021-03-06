import React from "react";
import styled from "styled-components";
import { Fieldset } from "react95";

const Container = styled(Fieldset)`
  width: 300px;
  min-width: 300px;
  flex-shrink: 0;
  margin-left: 16px;
  margin-top: 20px;
  position: relative;
`;

const Content = styled.div`
  position: absolute;
  top: 16px;
  left: 12px;
  right: 16px;
  bottom: 12px;
  overflow: auto;
  overflow-x: hidden;
`;

const DataItem = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 6px;
`;

const ParamItem = styled.code`
  font-family: monospace;
  margin-left: 12px;
  display: block;
`;

const FloatRight = styled.span`
  float: right;
`;

const Name = styled.span`
  max-width: 210px;
  overflow: hidden;
  text-overflow: ellipsis;
  float: right;
`;

const FunctionInfo = ({ fn }) => {
  if (!fn) {
    return (
      <Container label="Информация о функции">
        <div>Пожалуйста выберете функцию</div>
      </Container>
    );
  }
  return (
    <Container label="Информация о функции">
      <Content>
        <DataItem>
          <b>Имя:</b>{" "}
          <Name className="function-details-name" title={fn.name}>
            {fn.name}
          </Name>
        </DataItem>

        <DataItem>
          <b>Изменяемость состояния:</b>{" "}
          <FloatRight className="function-details-state-mutability">
            {fn?.stateMutability?.toString()}
          </FloatRight>
        </DataItem>
        
        {fn.inputs?.length > 0 && (
          <>
            <div>
              <b>Вводы:</b>
            </div>
            {fn.inputs.map((input, i) => (
              <ParamItem key={input.name}>
                [{i}]<i>{input.type}</i> {input.name}
              </ParamItem>
            ))}
          </>
        )}
      </Content>
    </Container>
  );
};

export default FunctionInfo;
