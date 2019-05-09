import {html, css, LitElement} from 'https://unpkg.com/lit-element/lit-element.js?module';

const AD_URL = '../../build/media/ad.mp4';
const VIDEO_URL = '../../build/media/video.mp4';

const PLAYRATE = 10;

const COLORS = {
  black: '#181D25',
  white: '#FFFFFF',
};

const STATE = {
  hiden: 'hiden',
  default: 'default',
  succeed: 'succeed',
  failed: 'failed',
  finished: 'finished',
};

const HEIGHT = {
  validQuiz: 70,
  invalidQuiz: 80,
  default: 200,
};

const wait = (ms) => new Promise(res => setTimeout(res, ms));

class Counter extends LitElement {
  duration = 0;
  interval = null;
  isAnimated = true;

  static properties = {
    duration: { type: Number },
    color: { type: String },
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
    const { duration, isAnimated, color } = this;

    return html`
      <style>
        p {
          color: ${color};
          font-size: 20px;
          font-weight: bold;
          display: ${duration > 0 ? 'block' : 'none'}
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
  static DURATION = 60000;

  quiz = null;
  selectedAnswer = null;
  height = HEIGHT.default;
  state = STATE.default;
  animation = STATE.default;

  constructor() {
    super();
    this.addEventListener('onad', this.onAd);
    this.addEventListener('onhide', this.onHide);
  }

  static properties = {
    height: { type: Number },
    duration: { type: Number },
  };

  get question() {
    return this.quiz.question;
  }

  get answers() {
    return this.quiz.reponses;
  }

  onHide = (e) => {
    const {height} = e.detail;
    this.state = STATE.hiden;
    this.height = height;
    this.requestUpdate();
  };

  onAd = (e) => {
    const {quiz} = e.detail;
    this.height = HEIGHT.default;
    this.animation = STATE.default;
    this.selectedAnswer = null;
    this.state = STATE.default;
    this.quiz = quiz;
    this.requestUpdate();
  };

  stopQuiz = () => {
    const event = new CustomEvent('end');
    this.dispatchEvent(event);
  };

  onSelectAnswer = async (e) => {
    if (this.selectedAnswer) {
      return;
    }

    const answerID = e.target.id;
    const answer = this.answers[answerID];
    const isValid = answer.isValid || false;

    this.selectedAnswer = answerID;
    this.state = isValid ? STATE.succeed : STATE.failed;
    this.quiz.question = (isValid
      ? this.quiz.success.replace('$data', answer.label)
      : this.quiz.fail.replace('$data', answer.label));

    this.requestUpdate();

    await wait(400);

    const event = new CustomEvent('answer', { detail: { isValid } });
    this.animation = STATE.finished;
    this.dispatchEvent(event);
    this.requestUpdate();
  };

  render() {
    const {state, animation, selectedAnswer, height, duration} = this;

    return html`
      <style>
        :host {
          width: 100%;
          position: absolute;
          bottom: 0;
          overflow: hidden;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          height: ${height}px;
          background: ${animation === STATE.finished ? COLORS.black : COLORS.white};
        }
        #counter {
          position: absolute;
          top: 5px;
          right: 25px;
          z-index: 2100;
          display: ${state === STATE.succeed ? 'none' : 'block'};
        }
        #question {
          color: black;
          font-family: Brown;
          letter-spacing: 2px;
          text-align: center;
          z-index: 2000;
          font-weight: ${state === STATE.default ? 'bold' : 'normal'};
          font-size: ${state === STATE.default ? 24 : 20}px;
          line-height: ${state === STATE.default ? 'default' : '30px'};
          padding: 0 ${state === STATE.succeed ? 0 : 100}px;
        }
        #question.answered {
          color: white;
        }
        #answers {
          display: flex;
          position: ${animation === STATE.finished ? 'absolute' : 'unset'};
          bottom: 0;
          width: 100%;
          justify-content: space-around;
          margin-bottom: 20px;
        }
        .answer::before {
          z-index: 100;
          position: absolute;
          content: "";
          width: 13px;
          height: 13px;
          left: -10px;
          background-color: transparent;
          border: solid 1px #181D25;
          border-radius: 30px;
          top: 50%;
          transform: translateY(-50%);
        }
        .answer {
          height: 38px;
          border-radius: 10px;
          font-size: 13px;
          padding: 0 20px;
          color: #181D25;
          min-width: 90px;
          border: none;
          font-family: Brown;
          position: relative;
          cursor: pointer;
          transition: transform 175ms;
        }
        .answer:hover {
          transform: scale(1.3);
          font-weight: bold;
        }
        .answer:hover::before {
          background-color: #181D25;
          border: none;
        }
        #answers.answered .selected {
          transform: scale(1.3);
          z-index: 1000;
        }
        #answers.answered .answer {
          cursor: default;
        }
        #answers.answered .selected::before {
          transform: scale(100);
          transition: transform .5s;
          background-color: #181D25;
          border: none;
        }
        button:focus {
          outline: 0;
        }
      </style>

      <lit-counter
        id="counter"
        color=${state === STATE.failed ? COLORS.white : COLORS.black}
        duration=${duration}
        @end=${this.stopQuiz}
      ></lit-counter>

      <h1 id="question" class=${state !== STATE.default ? 'answered' : ''}>${this.question}</h1>

      <div id="answers" class=${state !== STATE.default ? 'answered' : ''}>
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
  URLS = [
    {
      src: '../../build/media/video.mp4',
    },
    {
      src: '../../build/media/sponsor.mp4',
      sponsorised: true,
    },
    {
      time: 60,
      src: '../../build/media/ad-2.mp4',
      quiz: {
        question: 'Qui meurt à la fin ?',
        success: 'Bien joué c\'est bien "$data" qui meurt 🎉',
        fail: 'Et non ce n\'est pas "$data" qui meurt, regarde bien 😌',
        reponses: {
          a: { label: 'Iron man', isValid: true },
          b: { label: 'Thor' },
          c: { label: 'Hulk'},
          d: { label: 'mes couilles' },
        },
      },
    },
    {
      src: '../../build/media/sponsor.mp4',
      sponsorised: true,
    },
    {
      time: 60,
      src: '../../build/media/ad.mp4',
      quiz: {
        question: 'Quel est le prix de la prochaine Renault Zoé ?',
        success: 'Bien joué la renault zoé est bien à "$data" 🎉',
        fail: 'Et non la Renault zoé n\'est pas à "$data", regarde bien 😌',
        reponses: {
          a: { label: '1 999 €', isValid: true },
          b: { label: '2 500 €' },
          c: { label: '3 000 €'},
          d: { label: '4 000 €' },
        },
      },
    },
  ];

  hasAlreadyWatched = false;
  selectedUrl = null;
  url = AD_URL;
  quizHeight = 0;
  quizIsHidden = false;

  constructor() {
    super();
    window.onload = this.nextVideo;
  }

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

  nextVideo = (e) => {
    if (this.URLS.length === 0) return;

    this.selectedUrl = this.URLS.pop();
    if (e && this.selectedUrl.sponsorised) {
      this.selectedUrl = this.URLS.pop();
    }

    if (localStorage.getItem(this.selectedUrl.src)) {
      this.hasAlreadyWatched = true;
    } else {
      localStorage.setItem(this.selectedUrl.src, 'true');
      this.hasAlreadyWatched = false;
    }

    const quiz = this.shadowRoot.querySelector('lit-quiz');
    let event = null;

    if (this.selectedUrl.quiz) {
      this.quizHeight = HEIGHT.default;
      event = new CustomEvent('onad', { detail: {quiz: this.selectedUrl.quiz} });
    } else if (this.URLS.length === 0) {
      this.quizHeight = -10;
    }
    event && quiz.dispatchEvent(event);
    this.requestUpdate();
  };

  onQuizAnswer = (e) => {
    const {isValid} = e.detail;
    this.quizHeight = isValid ? HEIGHT.validQuiz : HEIGHT.invalidQuiz;
    if (isValid) {
      this.nextVideo();
    } else {
      this.requestUpdate();
    }
  };

  render() {
    const {quizHeight, selectedUrl, hasAlreadyWatched} = this;

    return html`
      <style>
        :host {
          padding-bottom: ${hasAlreadyWatched ? quizHeight : 0}px;
          transition: padding 100ms;
        }
        #player {
          width: 100%;
          z-index: 3000;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
        #quiz {
          display: ${hasAlreadyWatched ? 'relative' : 'none'};
        }
      </style>

      <video
        id="player"
        autoplay
        muted
        playsinline
        src=${selectedUrl ? selectedUrl.src : ''}
        @canplay=${this.setupPlayer}
        @ended=${this.nextVideo}
      ></video>
      <lit-quiz
        id="quiz"
        height=${quizHeight}
        duration=${selectedUrl ? selectedUrl.time : 0}
        @answer=${this.onQuizAnswer}
        @end=${this.hideQuiz}
      ></lit-quiz>
    `;
  }
}

// customElements.define('lit-quiz-button', QuizButton);
customElements.define('lit-counter', Counter);
customElements.define('lit-quiz', Quiz);
customElements.define('lit-ad', Advertisement);
