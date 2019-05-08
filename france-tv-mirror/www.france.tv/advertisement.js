import {html, css, LitElement} from 'https://unpkg.com/lit-element/lit-element.js?module';

const AD_URL = '../../build/media/ad.mp4';
const VIDEO_URL = '../../build/media/video.mp4';

const PLAYRATE = 5;

const wait = (ms) => new Promise(res => setTimeout(res, ms));

class Counter extends LitElement {
  duration = 0;
  interval = null;
  isAnimated = true;

  static properties = {
    duration: { type: Number },
  };

  constructor() {
    super();
    this.interval = setInterval(this.intervalHandler, 1000 / PLAYRATE);
  }

  intervalHandler = () => {
    if (this.duration <= 0) {
      this.terminate();
    } else {
      this.decrementCounter();
    }
    this.requestUpdate();
  };

  terminate = () => {
    clearInterval(this.interval);
    this.isAnimated = false;
    this.dispatchEvent(new CustomEvent('end', { bubbles: true, composed: true }));
  };

  decrementCounter = () => {
    --this.duration;
  };

  render() {
    const { duration, isAnimated } = this;

    return html`
      <style>
        p {
          color: ${duration <= 3 ? '#E91E63' : '#009688'};
          font-size: 20px;
          font-weight: bold;
        }
        .pulse {
          animation: pulse ${1000/PLAYRATE}ms infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(1.2);
          }
          50% {
            transform: scale(1);
          }
        }
      </style>
      <p class=${isAnimated ? 'pulse' : ''}>${duration}s</p>
    `;
  }
}

class Quiz extends LitElement {
  static HEIGHT = 200;
  static DURATION = 60000;

  QUIZ = {
    question: 'Quel est le prix de la prochaine Renault Zoé ?',
    reponses: {
      a: { label: '1 999 €', isValid: true },
      b: { label: '2 500 €' },
      c: { label: '3 000 €'},
      d: { label: '4 000 €' },
    },
  };
  selectedAnswer = null;
  state = 'default';

  static properties = {
    height: { type: Number },
  };

  get question() {
    return this.QUIZ.question;
  }

  get answers() {
    return this.QUIZ.reponses;
  }

  stopQuiz = () => {
    this.dispatchEvent(new CustomEvent('end'));
  };

  onSelectAnswer = (e) => {
    if (this.selectedAnswer) return;

    const answerID = e.target.id;
    const answer = this.answers[answerID];
    const isValid = answer.isValid || false;

    this.selectedAnswer = answerID;
    this.state = isValid ? 'suceed' : 'failed';
    this.QUIZ.question = (isValid
      ? `Bien joué la renault zoé est bien à "${answer.label}" 🎉`
      : `Et non la Renault zoé n\'est pas à "${answer.label}", regarde bien 😌`);

    this.requestUpdate();

    if (isValid) {
      setTimeout(() => this.dispatchEvent(new CustomEvent('end')), 5000);
    }
    this.dispatchEvent(new CustomEvent('answer', { detail: { isValid } }));
  };

  render() {
    const { hidden, state, selectedAnswer, height } = this;

    return html`
      <style>
        :host {
          height: ${height || Quiz.HEIGHT}px;
          width: 100%;
          position: absolute;
          bottom: 0;
          overflow: hidden;
          background: #ffffff;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
        }
        #counter {
          display: ${state === 'suceed' ? 'none' : 'block'};
          position: absolute;
          top: 5px;
          right: 25px;
        }
        #question {
          color: black;
          font-weight: ${state === 'default' ? 'bold' : 'normal'};
          font-family: Brown;
          font-size: ${state === 'default' ? 24 : 20}px;
          letter-spacing: 2px;
          line-height: ${state === 'default' ? 'default' : '30px'};
          padding: 0 ${state === 'suceed' ? 0 : 100}px;
          text-align: center;
        }
        #answers {
          display: flex;
          width: 100%;
          justify-content: space-around;
          margin-bottom: 20px;
        }
        .answer {
          height: 38px;
          border-radius: 10px;
          font-size: 13px;
          padding: 0 20px;
          color: white;
          min-width: 90px;
          border: none;
          background: #484848;
          font-family: Brown;
          cursor: pointer;
          transition: transform 175ms;
          box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.35);
        }
        .answer:hover {
          transform: scale(1.3);
          background: transparent;
          box-shadow: none;
          border: solid 1px #484848;
          color: #484848;
          font-weight: bold;
        }
        #answers.answered {
          display: none;
        }
        button:focus {
          outline: 0;
        }
      </style>

      <lit-counter duration=${Quiz.DURATION / 1000} id="counter" @end=${this.stopQuiz}></lit-counter>

      <h1 id="question">${this.question}</h1>

      <div id="answers" class=${state !== 'default' ? 'answered' : ''}>
        ${Object.keys(this.answers).map(answerID => html`
          <button class="answer ${selectedAnswer === answerID ? 'selected' : ''}" id=${answerID} @click=${this.onSelectAnswer}>
            ${this.answers[answerID].label}
          </button>
        `)}
      </div>
    `;
  }
}

class Advertisement extends LitElement {
  url = AD_URL;
  quizHeight = Quiz.HEIGHT;
  quizIsHidden = false;

  static get properties() {
    return {
      quizIsHidden: { type: Boolean },
      url: { type: String },
    }
  };

  setupPlayer = async (e) => {
    const player = e.target;
    player.controls = this.url === VIDEO_URL;
    player.muted = this.url === AD_URL;
    player.playbackRate = this.url === AD_URL ? PLAYRATE : 1;
    try {
      await player.play();
      player.muted = false;
    } catch {}
  };

  skipAd = () => {
    this.url = VIDEO_URL;
  };

  hideQuiz = () => {
    this.quizHeight = -10;
    if (this.url !== VIDEO_URL) {
      this.url = VIDEO_URL;
    }
    this.requestUpdate();
  };

  onQuizAnswer = (e) => {
    const {isValid} = e.detail;
    this.quizHeight = isValid ? 70 : 110;
    if (isValid) {
      this.skipAd();
    }
    this.requestUpdate();
  };

  render() {
    const { quizHeight, url } = this;

    return html`
      <style>
        :host {
          padding-bottom: ${quizHeight}px;
          transition: padding 500ms;
        }
        #player {
          width: 100%;
          z-index: 1;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
      </style>

      <video
        @canplay=${this.setupPlayer}
        id="player"
        src=${url}
        autoplay
        muted
        playsinline
        loop
      ></video>
      <lit-quiz height=${quizHeight} @answer=${this.onQuizAnswer} @end=${this.hideQuiz}></lit-quiz>
    `;
  }
}

// customElements.define('lit-quiz-button', QuizButton);
customElements.define('lit-counter', Counter);
customElements.define('lit-quiz', Quiz);
customElements.define('lit-ad', Advertisement);
