// 배경음
const audioBG = new Howl({
  src: ["../../../COMM/SOUND/GAME/BG_DOTTODOT.MP3"],
  volume: 0.5,
  autoplay: false,
  loop: true,
});
//버튼 클릭 음
const audioButton = new Audio("../../../COMM/SOUND/GAME/BUTTON.MP3");
//정답 소리
const audioAnswer = new Audio("../../../COMM/SOUND/GAME/ANSWER.MP3");
//정답 틀림
const audioAnswerWro = new Audio("../../../COMM/SOUND/GAME/ANSWERWRO.MP3");
//라인 소리
let dotAudioLine = new Audio("../../../COMM/SOUND/GAME/LINE.MP3");
//완료
const audioComplete = new Audio("../../../COMM/SOUND/GAME/COMPLETE.MP3");

const IMGROOT = "../../../COMM/IMG/DOTTODOT";



const jsonData = [
  {
    epilogue: "알맞은 것끼리 이어 보세요.",
    exam: [
      { img: `${IMGROOT}/QUESTION1.PNG`, txt: `첫째`, val: "1" },
      { img: `${IMGROOT}/QUESTION3.PNG`, txt: `다섯째`, val: "5" },
      { img: `${IMGROOT}/QUESTION2.PNG`, txt: `아홉째`, val: "9" },
    ],
    view: [
      { img: "", txt: "1", val: "1" },
      { img: "", txt: "9", val: "9" },
      { img: "", txt: "5", val: "5" },
    ],
  },
];

let mainCanvas = null; // main canvas Class
let ani = null; // ani Class
let questionDots = []; // question dots (top dots)
let answerDots = []; // answer dots (bottom dots)
let questionNum = 1; // 문항 숫자

let guideState = true; //가이드 실행 여부

$(".pearl-guide").on("click", () => {
  $(".pearl-guide").css("display", "none");
});
$(".pearl-guide").on("mouseup", () => {
  $(".pearl-guide").css("display", "none");
});
$(".pearl-guide").on("touchend", () => {
  $(".pearl-guide").css("display", "none");
});

// window.addEventListener("load", function () {
$(document).ready(function () {
  console.log("Line-connecting GAME");
  try {
    if (pageId === "readyGame") {
      $(".play_view").css("display", "none");
      $(".buttonArea > p").css("display", "none");
    }
  } catch (e) {}

  try {
    if (firstContents === "game") {
      $(".play_view").css("display", "flex");
    } else {
      $(".play_view").css("display", "none");
    }
  } catch (e) {}

  //확인문제 영상 시청 시 버튼 뜨지 않기
  try {
    if (watchVideo) {
      $(".play_view").css("display", "none");
    } else {
      $(".play_view").css("display", "flex");
    }
  } catch (e) {}

  try {
    $(".window-loading").remove();
  } catch (e) {}

  GAME.dataLoad(jsonData);
  dataSettings();
});

// 로딩시점 해결
// window.onload = function() {
//   mainCanvas = new Canvas();
//   ani = new Ani();
// };

// 데이터 셋팅
function dataSettings() {
  function questionPanelWrap(data) {
    let panel = `
    <div class="card">
      <div class="front">
        ${
          data.img
            ? `<div name="questionBG" class="bg" style="background: url(${data.img});" value="${data.val}"></div>`
            : `<div name="questionBG" class="bg" value="${data.val}">${data.txt}</div>`
        }
        <button name="question" class="dot" locked="false" value="${
          data.val
        }"></button>
      </div>
      <div class="back"></div>
    </div>`;
    return panel;
  }

  function answerPanelWrap(data) {
    console.log(data);
    let panel = `
    <div class="card">
      <div class="front">
        <button name="answer" class="dot" locked="false" value="${
          data.val
        }"></button>
        ${
          data.img
            ? `<div name="answerBG" class="bg" style="background: url(${data.img}); background-color: white;" value="${data.val}"></div>`
            : `<div name="answerBG" class="bg" value="${data.val}">${data.txt}</div>`
        }
        
      </div>
      <div class="back"></div>
    </div>`;
    return panel;
  }

  $.each(GAME.examData[questionNum - 1].exam, (idx, data) => {
    if (data.img) {
      $(".content-top").append(questionPanelWrap(data));
    } else {
      $(".content-top").append(questionPanelWrap(data));
    }
  });

  $.each(GAME.examData[questionNum - 1].view, (idx, data) => {
    $(".content-bottom").append(answerPanelWrap(data));
  });

  $(".title p").html(GAME.examData[questionNum - 1].epilogue);
  $("#pageCnt").html(questionNum);
  $("#pageCntAll").html(GAME.examData.length);
}

function txtResing() {
  const uiSet = (data) => {
    switch (String(data.innerText.length)) {
      case "1":
        $(data).css("font-size", "60px");
        break;
      case "2":
        $(data).css("font-size", "60px");
        break;
      case "3":
        $(data).css("font-size", "60px");
        break;
      default:
        $(data).css("font-size", "60px");
        break;
    }
  };

  let questionBG = $("div[name=questionBG]");
  $.each(questionBG, (idx, data) => {
    uiSet(data);
  });

  let answerBG = $("div[name=answerBG]");
  $.each(answerBG, (idx, data) => {
    uiSet(data);
  });
}

/**
 * 데이터 서치
 */
function searchDots() {
  questionDots = $(".dot[name=question][locked=false]");
  answerDots = $(".dot[name=answer][locked=false]");
}

function bgStart() {
  console.log("bgStart !!!!");
  audioBG.seek(0);
  audioBG.play();
}

// 캔버스 셋팅
function canvasInit() {
  console.log("로딩완료 후 ani, canvas 생성자함수 지정");
  mainCanvas = new Canvas();
  ani = new Ani();
  searchDots();
  txtResing();
}

/**
 * 게임시작
 */
function gameStart() {
  
  //가이드 뜸
  setTimeout(() => {
    if (guideState && $(".content-top .card").length === 3) {
      $(".pearl-guide").css("display", "flex");
      guideState = false;
    }
  }, [200]);
  $(".page_num").css("display", "flex");
  setTimeout(() => {
    new Audio("../../../COMM/SOUND/GAME/WIND.MP3").play();
    setTimeout(() => {
      new Audio("../../../COMM/SOUND/GAME/WIND.MP3").play();
      setTimeout(() => {
        new Audio("../../../COMM/SOUND/GAME/WIND.MP3").play();
      }, [200]);
    }, [200]);
  }, [1000]);
  GAME.soundPlay(audioButton);
  $("#introStartBG").fadeOut(500, "linear");
  setTimeout(() => {
    $(".canvasWrap").fadeIn(700);
    setTimeout(() => {
      ani.gameStart();
    }, 300);
  }, 300);
}

// 게임 재시작
function gameRetry() {
  questionDots = []; // question dots (top dots)
  answerDots = []; // answer dots (bottom dots)
  questionNum = 1; // 문항 숫자
  $("#complete_popup").css("display", "none");
  GAME.dataLoad(jsonData);
  ani.gameNext();
}

/**
 * 게임종료
 */
function gameEnd() {
  try {
    callFinish();
  } catch (e) {}
  audioBG.pause();
  setTimeout(() => {
    $("#complete_popup").css("display", "flex");
    GAME.soundPlay(audioComplete);
  }, 800);
}

// 다음게임
function gameNext() {
  if (questionNum != GAME.examData.length) {
    questionNum++;
    setTimeout(() => {
      ani.gameNext();
    }, 300);
  } else {
    gameEnd();
  }
}

// Ani Class
class Ani {
  constructor() {
    let answerBG = $(`.bg[name="answerBG"]`);
    $.each(answerBG, (idx, item) => {
      item.addEventListener(
        "animationstart",
        function (e) {
          let idx = item.getAttribute('value');

          ani.questionBG_Active(mainCanvas.questionDot.value);
          // $(item).attr("style", "background-color: #FFC0D7");
          $(item).attr("style", "background-image: url(" + GAME.examData[questionNum - 1].view[idx-1].img + "); background-color: #FFC0D7;");
        },
        false
      );
      item.addEventListener(
        "animationend",
        function (e) {
          let idx = item.getAttribute('value');

          ani.questionBG_disActive(mainCanvas.questionDot.value);
          // $(item).attr("style", "background-color: white");
          $(item).attr("style", "background-image: url(" + GAME.examData[questionNum - 1].view[idx-1].img + "); background-color: white;");
          $(item).removeClass("shaking");
        },
        false
      );
    });
  }
  // 게임시작시 animation
  gameStart() {
    $(".butterfly1moving1").addClass("mover");
    $(".butterfly1moving2").addClass("mover");
    $(".butterfly1moving3").addClass("mover");
    $(".butterfly1").addClass("wing");
    $(".butterfly2").addClass("wing");
    $(".butterfly3").addClass("wing");
    let cards = $(".card");
    let isStop = false;
    let count = 0;

    let interval = setInterval(function () {
      if (!isStop && cards.length !== count) {
        cards[count].setAttribute("style", "transform:rotateY(180deg)");
        count++;
      } else {
        $("#canvas").css("display", "flex");
        clearInterval(interval);
      }
    }, 200);
  }

  // 다음 게임 animation
  gameNext() {
    let cards = $(".card");
    let isStop = false;
    let count = 0;
    setTimeout(() => {
      mainCanvas.clear();
    }, 200);
    let interval = setInterval(function () {
      if (!isStop && cards.length !== count) {
        cards[count].setAttribute("style", "transform:rotateY(0deg)");
        count++;
      } else {
        $("#canvas").css("display", "flex");
        $(".card").remove();
        dataSettings();
        txtResing();
        searchDots();
        ani = new Ani();
        gameStart();
        clearInterval(interval);
      }
    }, 200);
  }

  // questionBG box shadow 스타일 변경
  questionBG_Active(value) {
    $(`.bg[name="questionBG"][value=${value}]`).addClass("active");
    $(`.bg[name="questionBG"][value=${value}]`).next().addClass("active");
  }
  // questionBG box shadow 스타일 변경 취소
  questionBG_disActive(value) {
    $(`.bg[name="questionBG"][value=${value}]`).removeClass("active");
    $(`.bg[name="questionBG"][value=${value}]`).next().removeClass("active");
  }
  // answerBG 흔들기
  answerBG_Active(value) {
    $(`.bg[name="answerBG"][value=${value}]`).addClass("shaking");
  }
}

// Dot Class
class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
// Line Class
class Line {
  constructor() {
    this.point = new Dot(null, null);
    this.pointLine = new Dot(null, null);
    this.pointEnd = new Dot(null, null);
    this.isDown = false;
    this.color = "#FF2D79";
  }

  // default 색상
  prevDrawingColor() {
    this.color = "#2F1381";
  }
  // 그릴때 색상
  DrawingColor() {
    this.color = "#FF2D79";
  }
  // 그림 그리기
  draw(ctx) {
    this.drawDot(ctx, this.point, 17, this.color);
    this.drawLine(ctx);
    this.drawDot(
      ctx,
      this.pointEnd,
      15,
      this.isDown ? "transparent" : this.color
    );
  }
  // 점그리기
  drawDot(ctx, dot, radius, color) {
    if (dot.x == null || dot.y == null) return;
    ctx.beginPath();
    let zoom = $("#wrap").css("zoom");
    // ctx.arc(this.point.x, this.point.y, radius, 0, Math.PI * 2, true);
    ctx.arc(this.point.x, this.point.y, radius, 0, Math.PI * 0, true);
    ctx.fill();
    ctx.closePath();
  }
  // 라인 그리기
  drawLine(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.point.x, this.point.y);
    ctx.lineTo(this.pointLine.x, this.pointLine.y);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 6;
    ctx.stroke();
    // fill 사용되지 않았으므로 closepath 불필요
    // ctx.closePath();
  }
  // touchDown
  onDown(x, y) {
    this.point.x = x;
    this.point.y = y;
    this.pointLine.x = x;
    this.pointLine.y = y;
    this.isDown = true;
  }
  // touchMove
  onMove(x, y) {
    if (this.isDown && this.point.x) {
      this.pointLine.x = x;
      this.pointLine.y = y;
    }
  }
  // touchUp
  onUp(x, y) {
    this.pointEnd.x = x;
    this.pointEnd.y = y;

    this.isDown = false;
  }
  // line clear
  onClear() {
    this.point = new Dot(null, null);
    this.pointLine = new Dot(null, null);
    this.pointEnd = new Dot(null, null);
    this.isDown = false;
  }
}
// Canvas Class
function Canvas () {
    this.canvas = $("#canvas")[0];
    this.ctx = this.canvas.getContext("2d");
    this.rect = this.canvas.getBoundingClientRect();
    this.questionDot = null;
    this.answerDot = null;
    this.moving = false;
    this.pos = {};
    this.lines = [];
    this.line = null;
    this.touchCount = 0;

    this.init();
    this.resize();

    window.addEventListener("resize", this.resize.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));
    this.canvas.addEventListener("mousedown", this.onDown.bind(this));
    this.canvas.addEventListener("touchstart", this.onDown.bind(this));
    this.canvas.addEventListener("mouseup", this.onUp.bind(this));
    this.canvas.addEventListener("touchend", this.onUp.bind(this));
    this.canvas.addEventListener("mousemove", this.onMove.bind(this));
    this.canvas.addEventListener("touchmove", this.onMove.bind(this));
}
  // init
  Canvas.prototype.init = function() {
    const dpr = window.devicePixelRatio;
    this.canvas.width = this.rect.width * dpr;
    this.canvas.height = this.rect.height * dpr;
  }
  // clear
  Canvas.prototype.clear = function() {
    this.questionDot = null;
    this.answerDot = null;
    this.pos = {};
    this.lines = [];
    this.line = null;
  }
  // resize
  Canvas.prototype.resize = function() {
    // this.canvas.width = document.body.clientWidth;
    // this.canvas.height = document.body.clientHeight;
    // this.stageWidth = document.body.clientWidth;
    // this.stageHeight = document.body.clientHeight;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.stageWidth = window.innerWidth;
    this.stageHeight = window.innerHeight;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }
  // ani
  Canvas.prototype.animate = function() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.lines.forEach((line) => {
      line.draw(this.ctx);
    });
  }
  // touchDown
  Canvas.prototype.onDown = function(e) {
    this.touchCount++;
    console.log('canvas onDown start : ', this.touchCount);
    e = e.changedTouches ? e.changedTouches[0] : e;

    if(this.line != null){
      this.line.onClear(this.ctx, this.stageWidth, this.stageHeight);
      $('.card .bg.active').removeClass('active');
      $('.card .dot.active').removeClass('active');
    }

    if(this.touchCount == 1){
      let zoom = $("#wrap").css("zoom");
      this.rect = this.canvas.getBoundingClientRect();
      let clientX = e.clientX - this.rect.left;
      let clientY = e.clientY - this.rect.top;
      this.pos = { x: clientX, y: clientY };
      let questionDot = this.dotBoundaryCheck("question");
      if (questionDot) {
        GAME.soundPlay(dotAudioLine);
        ani.questionBG_Active(questionDot.value);
        const newLine = new Line();
        this.lines.push(newLine);
        this.line = newLine;
        this.questionDot = questionDot;
        let questionDotRect = this.questionDot.getBoundingClientRect();
        let questionDotX = (questionDotRect.x + questionDotRect.width / 2) * zoom;
        let questionDotY =
          (questionDotRect.y + questionDotRect.height / 2) * zoom;
        this.line.onDown(questionDotX, questionDotY);
      } else {
        this.questionDot = null;
      }
    }   

    console.log('canvas onDown end');
  }
  // touchMove
  Canvas.prototype.onMove = function(e) {
    console.log('canvas onMove start');

    if(this.touchCount == 1 && this.line != null){
      if (this.questionDot) {
        e = e.changedTouches ? e.changedTouches[0] : e;
        let zoom = $("#wrap").css("zoom");
        let clientX = e.clientX - this.rect.left;
        let clientY = e.clientY - this.rect.top;
        this.pos = { x: clientX, y: clientY };
        this.line.onMove(this.pos.x, this.pos.y);
      }
    }
  
    console.log('canvas onMove end');
  }
  // touchUp
  Canvas.prototype.onUp = function(e) {
    console.log('canvas onUp start');

    if (!this.questionDot){    
      this.touchCount--;
      console.log('canvas onUp end : ', this.touchCount);
      return;
    }

    if(this.touchCount == 1 && this.line != null){
      e = e.changedTouches ? e.changedTouches[0] : e;
      let zoom = $("#wrap").css("zoom");
      if (zoom === undefined) zoom = 1;
      let clientX = e.clientX - this.rect.left;
      let clientY = e.clientY - this.rect.top;
      this.pos = { x: clientX, y: clientY };
      let answerDot = this.dotBoundaryCheck("answer");
      this.answerDot = answerDot;
      let answerCheck = this.answerCorrectCheck();
      if (!answerDot) {
        this.touchCount--;
        this.line.onClear(this.ctx, this.stageWidth, this.stageHeight);
        ani.questionBG_disActive(this.questionDot.value);
        return;
      }
      if (!answerCheck) {
        this.touchCount--;
        this.line.onClear(this.ctx, this.stageWidth, this.stageHeight);
        return;
      }
      let answerDotRect = this.answerDot.getBoundingClientRect();
      let answerDotX = (answerDotRect.x + answerDotRect.width / 2) * zoom;
      let answerDotY = (answerDotRect.y + answerDotRect.height / 2) * zoom;
      this.line.onMove(answerDotX, answerDotY);
      this.line.prevDrawingColor();
      this.line.onUp(answerDotX, answerDotY);
      this.onConnect();
    }
    this.line = null;
    
    this.touchCount--;
    console.log('canvas onUp end : ', this.touchCount);
  }
  // 점과 점의 line 연결
  Canvas.prototype.onConnect = function() {
    $(this.questionDot).attr("locked", "true");
    $(this.answerDot).attr("locked", "true");
    ani.questionBG_disActive(this.questionDot.value);
    this.questionDot = null;
    this.answerDot = null;
    searchDots();
    if (questionDots.length == 0) {
      gameNext();
    }
  }
  // 정답 체크
  Canvas.prototype.answerCorrectCheck = function() {
    if (this.questionDot.value === this.answerDot.value) {
      GAME.soundPlay(audioAnswer);
      $(".correctView").css("display", "flex");
      setTimeout(() => {
        $(".correctView").css("display", "none");
      }, 800);
      return true;
    } else {
      if ($(this.answerDot).attr("locked")) {
        GAME.soundPlay(audioAnswerWro);
      }
      ani.answerBG_Active(this.answerDot.value);
      return false;
    }
  }
  // 점의 영역을 클릭했는지 체크
  Canvas.prototype.dotBoundaryCheck = function(type) {
    if (!questionDots) {
      return;
    }
    let res = false;
    const dotRadius = 80;
    let searchDots = null;
    if (type === "question") {
      searchDots = questionDots;
    } else {
      searchDots = answerDots;
    }
    searchDots.each((idx, qsDot) => {
      const qsDotRect = qsDot.getBoundingClientRect();
      let zoom = $("#wrap").css("zoom");
      // zoom 이 들어갔을 경우 zoom 이 된 좌표위치로 재계산,
      const qsDotCenterX = (qsDotRect.x + qsDotRect.width / 2) * zoom;
      const qsDotCenterY = (qsDotRect.y + qsDotRect.height / 2) * zoom;
      // 실질적으로 좌표안에 있는지 감지하는 코드는 아래함수 x y 좌표로 확인가능
      const isWithinX = this.isWithinRange(this.pos.x, qsDotCenterX, dotRadius);
      const isWithinY = this.isWithinRange(this.pos.y, qsDotCenterY, dotRadius);
      if (isWithinX && isWithinY) {
        res = qsDot;
      }
    });
    return res;
  }
  // 영역안에 있는지 확인 true, false
  Canvas.prototype.isWithinRange = function(coord, center, radius) {
    return coord >= center - radius && coord <= center + radius;
  }


//비디오로 이동
function videoPlayer() {
  try {
    if (newVarExGame) {
      videoPageLoad();
    }
  } catch (e) {
    layout.video();
  }
}



// 임시로 zoom을 1로 고정합니다.
// const zoomFix = setInterval(() => {
//   $("#wrap").css("zoom", 1);
// }, 300);