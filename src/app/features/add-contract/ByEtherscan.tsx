import React from "react";
import styled from "styled-components";
import {
  Button,
  TabBody as rTabBody,
} from "react95";

const TabBody = styled(rTabBody)`
  width: 100%;
  height: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ByEtherscan = ({ closeModal }) => {
  return (
    <>
      <TabBody>
        <div style={{ height: "452px" }}>
          <p>
            К сожалению, этот метод пока недоступен. Однако вы можете выполнить следующие шаги, чтобы получить любые общедоступные ABI из Etherscan:
          </p>
          <ol>
            <li>
              Отправляйтесь{" "}
              <a
                href="https://etherscan.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Etherscan
              </a>{" "}
              и найдите контракт который вас интересует.
            </li>
            <li>
             Убедитесь, что вы находитесь в представлении "Контракт" (например, вместо токена).
            </li>
            <li>
             Нажмите на вкладку "Контракт" в поле "Обзор контракта".
            </li>
            <li>Прокрутите вниз до раздела "Contract ABI" и скопируйте его.</li>
            <li>Вернитесь сюда, щелкните вкладку ABI и вставьте ее.</li>
          </ol>
        </div>
        <ButtonContainer>
          <Button
            fullWidth
            size="lg"
            style={{ marginTop: "1rem" }}
            onClick={closeModal}
          >
            Close
          </Button>
        </ButtonContainer>
      </TabBody>
    </>
  );
};
export default ByEtherscan;
