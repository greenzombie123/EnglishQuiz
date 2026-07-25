import { css } from "lit";
export const slideStyle = css `
  :host{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;
export const introSlideStyle = css `

          .intro {
            flex: 3;
            display: flex;
            flex-direction: column;
            font-size: 1.7rem;

            .targetWord {
              display: flex;
              flex-direction: column;
              font-size: 6vw;
              justify-content: end;
            }

            .definition {
              font-size: 4vw;
            }

            div {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          .buttons {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 50px;

            button {
              font-size: 1.4rem;
              padding: 6px;
            }
          }
`;
export const questionSlideStyle = css `
          .question {
            flex: 3;
            display: flex;
            flex-direction: column;
            font-size: 5vw;
            justify-content: center;
            align-items: center;
          }

          .buttons {
            flex: 1;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            align-items: center;
            gap: 50px;
            padding: 10px;

            button {
              font-size: 1.4rem;
              padding: 6px 10px;
            }
          }
        

        @media screen and (max-width:550px) {
            .buttons {
              gap: 20px;
            }

            .buttons button {
              font-size: 0.9rem;
            }
        }
`;
//# sourceMappingURL=styles.js.map