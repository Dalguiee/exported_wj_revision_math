//시작
const startAudioEx = new Audio("../../../COMM/SOUND/START.MP3");
//페이지 넘기기
const changpageAudioEx = new Audio("../../../COMM/SOUND/CHANGEPAGE3.MP3");
//오답
const worngAudioEx = new Audio("../../../COMM/SOUND/WRONG.MP3");
//버튼 클릭
const btnClickAudioEx = new Audio("../../../COMM/SOUND/CLICK2.mp3");
//DND, 선긋기
const effectAudioEx = new Audio("../../../COMM/SOUND/EFFECT2.mp3");

// 맞춘 정답 카운트 (힌트없이 맞춘문제)
let correctCount = 0;
//키패드 활성화
let keypadIndex = "";

const pageId = "test";

//개념 게임 여부
const newVarExGame = true;

//마지막으로 누른 키패드 (힌트 여러 개 일 경우 사용)
let lastKeyPad = "";

//키패드 입력칸
let keyPadInput = "";

//영상 시청 여부
let watchVideo = false;

// setTimeout(() => {
//   gamePageLoad();
// }, [200]);

//페이지 set
const stepSet = () => {
  // 이전, 다음버튼 히든-----
  $(`.btn-prev`).css("display", "block");
  $(`.btn-next`).css("display", "block");
  if (disStep === 1) {
    $(`.btn-prev`).css("display", "none");
  }
  if (disStep === 5) {
    $(`.btn-next`).css("display", "none");
  }

  //이전, 다음버튼 disabled------
  if (disStep > completeStep) {
    $(`.btn-next`).attr("disabled", true);
  } else {
    $(`.btn-next`).attr("disabled", false);
  }

  //다음 버튼 깜빡임 제거
  $(".main_prev-next .btn-next").removeClass("blinking");
  //리액션 캐릭터 제거
  $(".reaction").removeClass("active");

  keypadIndex = "";
  lastKeyPad = "";

  $(".key-pad").css("display", "none");
  //힌트 제거
  $(".hint").css("display", "none");
  $(".quiz").removeClass("key-hint");

  //step 활성화
  $(".step").css("display", "none");
  $(".step")
    .eq(disStep - 1)
    .css("display", "block");

  //헤더 진행도 셋팅
  setHeaderStep();
  //헤더 타이틀 셋팅
  headerSet();
};

//해더 사운드 버튼 재생
const titleSound = () => {
  btnClickAudioEx.play();
  audioPlayExam(audio, [`${pageData[disStep - 1].sound}`]);
};

// 도큐먼트 로드 시 적용
window.addEventListener("load", function () {
  // 힌트 텍스트 미리 로드
  $(".hintBox_text-box").html("힌트");
  //시작버튼 클릭
  $(".startBtn").on("click", () => {
    startAudioEx.play();
    $("#contents-wrap").css("display", "none");

    // 확인문제 재시작 시 examScore 삭제 (0426)
    RemoveLocalStorage("examScore");

    pageAction();
  });
  render();
  dregFnEx();
  dropppFnEx();
});

//이전 버튼
$(".btn-prev").click(() => {
  if (!keypadIndex) {
    changpageAudioEx.play();
    disStep -= 1;
    audio.pause();
    pageAction();
  }
});

//다음 버튼
$(".btn-next").click(() => {
  if (!keypadIndex) {
    changpageAudioEx.play();
    disStep += 1;
    audio.pause();
    pageAction();
  }
});

//헤더 타이틀
const headerSet = () => {
  $(".header_title h3").html(pageData[disStep - 1].title);
};

//헤더 스텝 진행도
const setHeaderStep = () => {
  $(".step-list_item").removeClass("active");
  $(".step-list_item")
    .eq(disStep - 1)
    .addClass("active");
};

//정답 맞춘 경우
const correctly = () => {
  //정답입력 초기화
  answerInput = [];
  // 틀린 횟수 초기화
  wrongCheck = 0;
  // 맞춘갯수 증가
  completeStep += 1;
  $(".btn-next").attr("disabled", false);
  $(".btn-next").addClass("blinking");
  $(".step-list_item")
    .eq(disStep - 1)
    .addClass("clear");
  $(".key-pad").css("display", "none");
  keypadIndex = "";
  $(".key-pad-on").removeClass("active");
};

//오답 + 1,  나레이션, 메시지 출력
const showHint = (text, sound) => {
  wrongCheck += 1;
  worngAudioEx.play();
  if (text && sound) {
    audioPlayExam(audio, [sound], () => {
      $(".hintBox-warp").removeClass("show");
      $(".hintBox").removeClass("slideUp");
      $(".hintBox").addClass("slideDown");
      // $(".hint").css("display", "none");
      // $(".quiz").removeClass("key-hint");
    });
    $(".hintBox-warp").addClass("show");
    $(".hintBox_text-box").html(`${text}`);
    $(".hintBox").removeClass("slideDown");
    $(".hintBox").addClass("slideUp");
  }
  $(".step-list_item")
    .eq(disStep - 1)
    .addClass("wrong");
};

//나레이션, 메시지 출력 (키패드)
const showHintKeypad = (text, sound) => {
  wrongCheck += 1;
  if (text && sound) {
    audioPlayExam(audio, [sound], () => {
      $(".hintBox-warp").removeClass("show");
      $(".hintBox").removeClass("slideUp");
      $(".hintBox").addClass("slideDown");
    });
    $(".hintBox-warp").addClass("show");
    $(".hintBox_text-box").html(`${text}`);
    $(".hintBox").removeClass("slideDown");
    $(".hintBox").addClass("slideUp");
  }
};

//정답체크
const answerCheckEx = (index) => {
  if (answerInput.toString() == answerArr[index - 1].answer.toString()) {
    correctActionEx();
  } else {
    if (!wrongCheck) {
      hintAction();
    } else {
      wrongActionEx();
    }
  }
};

//키패드 정답체크
const keyPadCheck = (keyPadOn) => {
  let keyPadIndexMatch =
    answerInput[keypadIndex - 1] ==
    answerArr[disStep - 1].answer[keypadIndex - 1];

  console.log("입력된 정답 : ", answerInput.toString());
  console.log("정답 : ", answerArr[disStep - 1].answer.toString());

  if (keyPadIndexMatch) {
    $(`.step${disStep} .quiz`)
      .eq(keypadIndex - 1)
      .attr("disabled", true);
    $(`.step${disStep} .quiz`).removeClass("active");
    if (answerInput.toString() == answerArr[disStep - 1].answer.toString()) {
      answerCheckEx(disStep);
    } else {
      audioPlayExam(audio, ["../../../COMM/SOUND/CORRECT.MP3"]);
      $(`.step${disStep} .quiz`)
        .eq(keypadIndex - 1)
        .removeClass("key-pad-on");
      //힌트 여러개 일 경우==============================
      lastKeyPad = "";
      //==================================================
      keypadIndex = "";
      $(".key-pad").css("display", "none");
      //다른 키패드 활성화 버튼 클릭 시
      if (keyPadOn) {
        $(keyPadOn).addClass("active");
        keypadIndex = $(keyPadOn).data("val");
        $(".key-pad").css("display", "flex");
        keyPadInput = $(`.key-pad-on.active`)
          .text()
          .replace(/[^0-9]/g, "");
      }
    }
  } else {
    keypadIndex = "";
    $(".key-pad").css("display", "none");
    $(".key-pad-on.active").html("?");
    $(".key-pad-on").removeClass("active");

    $(".step-list_item")
      .eq(disStep - 1)
      .addClass("wrong");
    $("#wrap").append(`<div class="transparent-wall"></div>`);
    audioPlayExam(audio, ["../../../COMM/SOUND/WRONG.MP3"], () => {
      $(".transparent-wall").remove();
      if (!wrongCheck) {
        hintAction("keypad");
      } else {
        wrongActionEx();
      }
    });
  }
};

//드래그 앤 드롭 정답체크
const dndCheck = (answer, index) => {
  answerInput[index] = answer;
  if (answer == answerArr[disStep - 1].answer[index]) {
    if (answerInput.toString() == answerArr[disStep - 1].answer.toString()) {
      answerCheckEx(disStep);
    }
    audioPlayExam(audio, ["../../../COMM/SOUND/CORRECT.MP3"]);
  }
  console.log("입력된 정답 : ", answerInput);
  console.log(" 정답 : ", answerArr[disStep - 1].answer);
};

//드래그앤드롭 종료
// const dndEnd = () => {
//   $.each($(`.step${disStep} .quiz`), function (index, item) {
//     if (!(answerArr[disStep - 1].answer.indexOf($(item).data("val")) < 0)) {
//       $(item).remove();
//     }
//   });
//   $(`.step${disStep} .quiz`).addClass("pointerNone");
//   $(`.step${disStep} .epilogue.droppable`).css("border-color", "#6744f3");
// };

//정답 이벤트
const correctEvent = () => {
  audioPlayExam(audio, ["../../../COMM/SOUND/CORRECT.MP3"]);
  $(".reaction").addClass("active");
  if (wrongCheck === 0) {
    correctCount += 1;
    $(".step-list_item")
      .eq(disStep - 1)
      .addClass("correct");
  }
  correctly();
};

//키패트 켜기
$(".key-pad-on").click(function () {
  btnClickAudioEx.play();
  //키패드 켜지지 않은 경우
  if (!keypadIndex) {
    $(this).addClass("active");
    keypadIndex = $(this).data("val");
    $(".key-pad").css("display", "flex");
    keyPadInput = $(`.key-pad-on.active`)
      .text()
      .replace(/[^0-9]/g, "");
    //키패드 켜진 경우
  } else {
    console.log("keypadIndex : ", keypadIndex);
    console.log($(this).data("val"));
    if (keypadIndex != $(this).data("val")) {
      keyPadCheck(this);
    }
  }
});
//키패드 숫자 버튼
$(".key-pad_btn").click(function () {
  btnClickAudioEx.play();
  if ($(`.key-pad-on.active`).data("max") == 1) {
    keyPadInput = $(this).text();
    $(`.key-pad-on.active`).html(keyPadInput);
    answerInput[keypadIndex - 1] = keyPadInput;
  } else {
    if (
      $(`.key-pad-on.active`).data("max") >
      $(`.key-pad-on.active`)
        .text()
        .replace(/[^0-9]/g, "").length
    ) {
      keyPadInput = keyPadInput + $(this).text();
      $(`.key-pad-on.active`).html(keyPadInput);
      answerInput[keypadIndex - 1] = keyPadInput;
    }
  }
});
//키패드 뒤로가기 버튼
$(".key-pad_btn-back").click(function () {
  btnClickAudioEx.play();
  keyPadInput = keyPadInput.slice(0, -1);
  $(`.key-pad-on.active`).html(keyPadInput);
  answerInput[keypadIndex - 1] = keyPadInput;
  if (keyPadInput.length === 0) {
    $(".key-pad-on.active").html("?");
  }
});

// 키패드 닫기 버튼 추가 (0605)
$(document).ready(function () {
  if ($('.key-pad').length > 0) {
    $('.key-pad').append('<button class="key-pad_btn-close"></button>');
  }

  $(document).on('click', '.key-pad_btn-close', function (e) {
    e.stopPropagation();
    $('.key-pad-on').removeClass('active');
    $('.key-pad').css('display', 'none').css('bottom', '').css('right', '');
    keypadIndex = "";
  });
});

//페이지 전환 시 액션
function pageAction() {
  console.log("disStep ::: ", disStep);
  //setTimeout 초기화
  const TimeoutId = setTimeout(() => console.log("timeout clear"), 1);
  for (let i = 0; i < TimeoutId; i++) {
    clearTimeout(i);
  }

  stepSet();
  switch (disStep) {
    case 1:
      step1.start();
      break;
    case 2:
      step2.start();
      break;
    case 3:
      step3.start();
      break;
    case 4:
      step4.start();
      break;
    case 5:
      step5.start();
      break;
  }
}
//정답 시 액션
const correctActionEx = () => {
  correctEvent();
  switch (disStep) {
    case 1:
      step1.complete();
      break;
    case 2:
      step2.complete();
      break;
    case 3:
      step3.complete();
      break;
    case 4:
      step4.complete();
      break;
    case 5:
      step5.complete();
      break;
  }
};
// 힌트 시 액션
const hintAction = (type) => {
  switch (disStep) {
    case 1:
      step1.hint();
      if (type === "keypad") {
        showHintKeypad(answerArr[0].hint, answerArr[0].sound);
      } else {
        showHint(answerArr[0].hint, answerArr[0].sound);
      }
      break;
    case 2:
      step2.hint();
      if (type === "keypad") {
        showHintKeypad(answerArr[1].hint, answerArr[1].sound);
      } else {
        showHint(answerArr[1].hint, answerArr[1].sound);
      }
      break;
    case 3:
      step3.hint();
      if (type === "keypad") {
        showHintKeypad(answerArr[2].hint, answerArr[2].sound);
      } else {
        showHint(answerArr[2].hint, answerArr[2].sound);
      }
      break;
    case 4:
      step4.hint();
      if (type === "keypad") {
        showHintKeypad(answerArr[3].hint, answerArr[3].sound);
      } else {
        showHint(answerArr[3].hint, answerArr[3].sound);
      }
      break;
    case 5:
      step5.hint();
      if (type === "keypad") {
        showHintKeypad(answerArr[4].hint, answerArr[4].sound);
      } else {
        showHint(answerArr[4].hint, answerArr[4].sound);
      }
      break;
  }
};
// 오답 시 액션 (힌트 1 소진)
const wrongActionEx = () => {
  correctly();
  switch (disStep) {
    case 1:
      step1.wrong();
      step1.complete();
      break;
    case 2:
      step2.wrong();
      step2.complete();
      break;
    case 3:
      step3.wrong();
      step3.complete();
      break;
    case 4:
      step4.wrong();
      step4.complete();
      break;
    case 5:
      step5.wrong();
      step5.complete();
      break;
  }
};

// 드래그 할 경우 함수
const dregFnEx = () => {
  $(".draggable")
    .draggable()
    .on("draggable:start", function (droppp, drag) {
      btnClickAudioEx.play();

      $(".draggable").removeClass("dragging");
      $(this).addClass("dragging");
      $(".draggable:not(.dragging)").css("pointer-events", "").css("transform", "");
    })
    .on("draggable:stop", function (droppp, drag) {
      $(this).removeClass("dragging");
    });
};

//드롭 할 경우 함수
const dropppFnEx = () => {
  $(".droppable")
    .droppable()
    .on("droppable:over", function (droppp, drag) {
      if (!$(droppp.currentTarget).hasClass("hover")) {
        $(droppp.currentTarget).addClass("hover");
      }
    })
    .on("droppable:out", function (droppp, drag) {
      $(droppp.currentTarget).removeClass("hover");
    })
    .on("droppable:drop", function (droppp, drag) {
      $(droppp.currentTarget).removeClass("hover");
      let dragAnswer = drag.item[0].dataset.val;
      let answer = droppp.currentTarget.dataset.val;
      let index = droppp.currentTarget.dataset.index;
      if (answer === dragAnswer) {
        $(droppp.currentTarget).find(".placeholder").css("display", "none");
        $(droppp.currentTarget).addClass("pointerNone");
        drag.item.addClass("pointerNone");
        setTimeout(() => {
          dndCheck(answer, index - 1);
        }, [1]);
      } else {
        answerCheckEx(disStep);
        return false;
      }
    });
};

// 오디오 자동재생
function audioPlayExam(audioObj, audioLs, callback) {
  audioObj.pause();
  audioObj.onended = "";
  audioObj.src = "";
  audioObj.src = audioLs[0];

  audioObj.play();
  let nextAudioIndex = 1;
  audioObj.onended = function () {
    if (nextAudioIndex < audioLs.length) {
      audioObj.src = audioLs[nextAudioIndex];
      audioObj.play();
    }
    nextAudioIndex++;
    if (callback) {
      callback(nextAudioIndex);
    }
  };
}

const keyPadEvent = (index) => {
  $(".key-pad_btn-check").click(function () {
    btnClickAudioEx.play();
    if (disStep === index) {
      keyPadCheck();
    }
  });
  //키패드 활성화 버튼 제외 배경 클릭시 채점
  $("#contents-main").click(function (e) {
    if (keypadIndex && disStep === index) {
      if (
        !$(e.target).hasClass("key-pad-on") &&
        !$(e.target).hasClass("active")
      ) {
        keyPadCheck();
      }
    }
  });
};

//==============앱 통신==============

/**
 * 테스트 결과
 * 정답률 - 80% 이상 : 실력쑥쑥 / 80% 이하 : 개념 더하기 랜딩
 */
function getTestResult() {
  console.log("getTestResult");
  const nextStepBtn = document.querySelector(".next-step");

  console.log(correctCount);
  let isGameState = correctCount >= 4;

  let str = isGameState ? "game" : "video";

  if (deviceConfirm() === "mo") {
    // 확인문제 점수 로컬 저장 (0426)
    SetLocalStorage("examScore", correctCount);

    window.javascript_object.putStudyVdo("1", str, "0");
  }

  nextStepBtn.addEventListener("click", function () {
    nextStepBtn.style.display = "none";
    audio.pause();
    btnClickAudioEx.play();
    // contentsData = data[str];

    firstContents = str;
    console.log(firstContents);
    if (isGameState) {
      //게임 실행
      gamePageLoad();
    } else {
      //비디오 실행
      videoPageLoad();
    }
  });
}

// 다음 스텝 버튼 생성
function createNextStep() {
  console.log("dd");
  const nextStepBtn = document.createElement("button");
  nextStepBtn.classList.add("next-step");
  nextStepBtn.innerHTML = `
      <img src="../../../COMM/IMG/NEXT_STEP.PNG" alt="다음버튼" />
  `;
  $("#wrap").append(nextStepBtn);
  getTestResult();
}

class DotEx {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Line Class
class LineEx {
  constructor() {
    this.point = new DotEx(null, null);
    this.pointLine = new DotEx(null, null);
    this.pointEnd = new DotEx(null, null);
    this.isDown = false;
    this.color = "#FF64DC";
  }

  // default 색상
  prevDrawingColor() {
    this.color = "#FF64DC";
  }
  // 그릴때 색상
  DrawingColor() {
    this.color = "#FF64DC";
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
    ctx.arc(this.point.x, this.point.y, radius, 0, Math.PI * 0, true);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
  // 라인 그리기
  drawLine(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.point.x, this.point.y);
    ctx.lineTo(this.pointLine.x, this.pointLine.y);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.closePath();
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
    this.point = new DotEx(null, null);
    this.pointLine = new DotEx(null, null);
    this.pointEnd = new DotEx(null, null);
    this.isDown = false;
  }
}

// Canvas Class
class CanvasEx {
  constructor(canvasObj) {
    this.canvas = canvasObj ? canvasObj : $("#canvas")[0];
    this.ctx = this.canvas.getContext("2d");
    this.rect = this.canvas.getBoundingClientRect();
    this.questionDot = null;
    this.questionDots = null;
    this.answerDot = null;
    this.answerDots = null;
    this.moving = false;
    this.pos = {};
    this.lines = [];
    this.line = null;
    this.touchCount = 0;

    this.init();
    this.resize();
    this.searchDots();

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
  init() {
    const dpr = window.devicePixelRatio;
    this.canvas.width = this.rect.width * dpr;
    this.canvas.height = this.rect.height * dpr;
  }
  // clear
  clear() {
    this.questionDot = null;
    this.answerDot = null;
    this.pos = {};
    this.lines = [];
    this.line = null;
  }
  // resize
  resize() {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }
  // ani
  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.lines.forEach((line) => {
      line.draw(this.ctx);
    });
  }
  // dot 찾기
  searchDots() {
    this.questionDots = $(".start_dot[locked=false]");
    this.answerDots = $(".end_dot[locked=false]");
  }
  // touchDown
  onDown(e) {
    this.touchCount++;
    console.log("canvas onDown start : ", this.touchCount);

    e = e.changedTouches ? e.changedTouches[0] : e;

    if (this.line != null) {
      this.line.onClear(this.ctx, this.stageWidth, this.stageHeight);
    }

    if (this.touchCount == 1) {
      this.rect = this.canvas.getBoundingClientRect();
      let clientX = e.clientX - this.rect.left;
      let clientY = e.clientY - this.rect.top;
      this.pos = { x: clientX, y: clientY };
      let questionDot = this.dotBoundaryCheck("question");
      if (questionDot) {
        audioPlayExam(audio, ["../../../COMM/SOUND/EFFECT2.MP3"]);
        const newLine = new LineEx();
        this.lines.push(newLine);
        this.line = newLine;
        this.questionDot = questionDot;
        let questionDotRect = this.questionDot.getBoundingClientRect();
        let questionDotX = questionDotRect.x - this.rect.left + questionDotRect.width / 2;
        let questionDotY = questionDotRect.y - this.rect.top + questionDotRect.height / 2;
        this.line.onDown(questionDotX, questionDotY);
      } else {
        this.questionDot = null;
      }
    }

    console.log("canvas onDown end");
  }
  // touchMove
  onMove(e) {
    console.log("canvas onMove start");

    if (this.touchCount == 1 && this.line != null) {
      if (this.questionDot) {
        e = e.changedTouches ? e.changedTouches[0] : e;
        let clientX = e.clientX - this.rect.left;
        let clientY = e.clientY - this.rect.top;
        this.pos = { x: clientX, y: clientY };
        this.line.onMove(this.pos.x, this.pos.y);
      }
    }

    console.log("canvas onMove end");
  }
  // touchUp
  onUp(e) {
    console.log("canvas onUp start");

    if (!this.questionDot) {
      this.touchCount--;
      console.log("canvas onUp end : ", this.touchCount);
      return;
    }

    if (this.touchCount == 1 && this.line != null) {
      e = e.changedTouches ? e.changedTouches[0] : e;
      let clientX = e.clientX - this.rect.left;
      let clientY = e.clientY - this.rect.top;
      this.pos = { x: clientX, y: clientY };
      let answerDot = this.dotBoundaryCheck("answer");
      this.answerDot = answerDot;
      let answerCheck = this.answerCorrectCheck();
      if (!answerDot) {
        this.line.onClear(this.ctx, this.stageWidth, this.stageHeight);
        this.line = null;
        this.touchCount = 0;
        
        return;
      }
      if (!answerCheck) {
        this.line.onClear(this.ctx, this.stageWidth, this.stageHeight);
        this.line = null;
        this.touchCount = 0;

        //오답 일 경우=========================
        if (!wrongCheck) {
          hintAction();
          $(".step-list_item")
            .eq(disStep - 1)
            .addClass("wrong");
        } else {
          dotToDotCount = 0;
          $(`.step${disStep} .canvas`).css("display", "none");
          $(`.step${disStep} .clear-img`).css("display", "block");
          audioPlayExam(audio, ["../../../COMM/SOUND/WRONG.MP3"]);
          correctly();
        }
        //=====================================
        return;
      } else {
        //정답 일 경우=========================
        dotToDotCount += 1;
        audioPlayExam(audio, ["../../../COMM/SOUND/CORRECT.MP3"]);
        if (dotToDotCount >= dotToDotLength) {
          dotToDotCount = 0;
          $(`.step${disStep} .canvas`).css("display", "none");
          $(`.step${disStep} .clear-img`).css("display", "block");
          correctEvent();
        }
        //=====================================
      }

      let answerDotRect = this.answerDot.getBoundingClientRect();
      let answerDotX = answerDotRect.x + answerDotRect.width / 2;
      let answerDotY = answerDotRect.y + answerDotRect.height / 2;
      this.line.onMove(answerDotX, answerDotY);
      this.line.prevDrawingColor();
      this.line.onUp(answerDotX, answerDotY);
      this.onConnect();
    }

    this.line = null;
    this.touchCount--;
    console.log("canvas onUp end : ", this.touchCount);
  }
  // 점과 점의 line 연결
  onConnect() {
    $(this.questionDot).attr("locked", "true");
    $(this.answerDot).attr("locked", "true");
    this.questionDot = null;
    this.answerDot = null;
    this.searchDots();
  }
  // ============정답 체크============
  answerCorrectCheck() {
    let startDot = $(this.questionDot).data("start");
    let endDot = $(this.answerDot).data("end");

    if (startDot === endDot) {
      return true;
    } else {
      return false;
    }
  }
  // 점의 영역을 클릭했는지 체크
  dotBoundaryCheck(type) {
    if (!this.questionDots) {
      return;
    }
    let res = false;
    const dotRadius = 80;
    let searchDots = null;
    if (type === "question") {
      searchDots = this.questionDots;
    } else {
      searchDots = this.answerDots;
    }

    searchDots.each((idx, qsDot) => {
      const qsDotRect = qsDot.getBoundingClientRect();
      const qsDotCenterX = qsDotRect.x + qsDotRect.width / 2;
      const qsDotCenterY = qsDotRect.y + qsDotRect.height / 2;
      const isWithinX = this.isWithinRange(this.pos.x, qsDotCenterX, dotRadius);
      const isWithinY = this.isWithinRange(this.pos.y, qsDotCenterY, dotRadius);
      if (isWithinX && isWithinY) {
        res = qsDot;
      }
    });
    return res;
  }
  // 영역안에 있는지 확인 true, false
  isWithinRange(coord, center, radius) {
    return coord >= center - radius && coord <= center + radius;
  }
}

// ctx.moveTo(32, 400);
// ctx.lineTo(50, 400);
// ctx.lineWidth = 10;
// ctx.strokeStyle = "#FF2D79";
// ctx.stroke();

// ctx.moveTo(32, 670);
// ctx.lineTo(50, 670);
// ctx.lineWidth = 10;
// ctx.strokeStyle = "#FF2D79";
// ctx.stroke();
