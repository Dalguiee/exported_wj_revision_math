// 배경음
const audioBG = new Howl({
  src: ["../../../COMM/SOUND/GAME/BG_OXQUIZ.MP3"],
  volume: 0.8,
  autoplay: false,
  loop: true,
});
//버튼 클릭 음
const audioButton = new Audio("../../../COMM/SOUND/GAME/BUTTON.MP3");
//캐릭 걷는 사운드
const audioWalk = new Audio("../../../COMM/SOUND/GAME/WALK.MP3");
//정답 소리
const audioAnswer = new Audio("../../../COMM/SOUND/GAME/ANSWER.MP3");
//정답 틀림
const audioAnswerWro = new Audio("../../../COMM/SOUND/GAME/ANSWERWRO.MP3");
//완료
const audioComplete = new Audio("../../../COMM/SOUND/GAME/COMPLETE.MP3");

const IMGROOT = "../../../COMM/IMG/OXQUIZ";

// 퀴즈 resource
const oxQuizData = [
  {
    id: 1,
    epilogue: "5는 8보다 큽니다.",
    exam: [{ txt: "15 + 12를 더하면 20이 맞을까?" }],
    view: [
      { img: "", txt: "O" },
      { img: "", txt: "X" },
    ],
    answer: ["O"],
  },
];
const startBtn = document.querySelector(".oxquiz__start__btn");
const introImg = document.querySelector(".oxquiz__intro__desc");
const quizBox = document.querySelector(".oxquiz__quiz__wrap");
const quizCardO = document.querySelector(".oxquiz__card__left");
const quizCardX = document.querySelector(".oxquiz__card__right");
const overlay = document.querySelector(".overlay");
const wrong = document.querySelector(".wrong");
// const nextBtn = document.querySelector("#container .nextBtn");
const character = document.querySelector(".oxquiz__character__wrap");
const characterHandLeft = document.querySelector(".character__hand__left");
const characterHandRight = document.querySelector(".character__hand__right");
const characterBody = document.querySelector(".character__body");
const clearPopup = document.querySelector(".popup__wrap");
const quizTitEl = document.querySelector(".oxquiz__quiz__title");
const pageNumber = document.querySelector(".oxquiz__page__number .action");

let currentPage = 1; // 현재 페이지

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
$(document).ready(() => {
  console.log("OX 퀴즈 GAME");
  GAME.dataLoad(oxQuizData);
  init();

  try {
    if (pageId === "readyGame") {
      $(".play_view").css("display", "none");
      $(".popup__overlay > span").css("display", "none");
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
});

/**
 * event
 */
// 다음페이지 이동 버튼
// nextBtn.addEventListener("click", function () {
//   GAME.soundPlay(audioButton);
//   pageCont();
// });

// 게임시작버튼 클릭 시 인트로 화면 가림
startBtn.addEventListener("click", function () {
  GAME.soundPlay(audioButton);
  gameStart();
});

/**
 * function
 */
// 초기화
function init() {
  if (GAME.examData[currentPage - 1].epilogue) {
    quizTitEl.textContent = GAME.examData[currentPage - 1].epilogue;
  } else {
    quizTitEl.textContent = GAME.examData[currentPage - 1].exam[0].txt;
  }
  uiResing();

  if (GAME.examData[currentPage - 1].view[0].img) {
    console.log(GAME.examData[currentPage - 1].view[0].img);
    $(".oxquiz__card__left").html(`
    <div class="img">
      <img src="${IMGROOT}/${
      GAME.examData[currentPage - 1].view[0].img
    }" alt="${GAME.examData[currentPage - 1].view[0].txt}"/>
    </div>
    `);
  } else {
    $(".oxquiz__card__left").html(GAME.examData[currentPage - 1].view[0].txt);
  }

  if (GAME.examData[currentPage - 1].view[1].img) {
    console.log(GAME.examData[currentPage - 1].view[1].img);
    $(".oxquiz__card__right").html(`
    <div class="img">
      <img src="${IMGROOT}/${
      GAME.examData[currentPage - 1].view[1].img
    }" alt="${GAME.examData[currentPage - 1].view[1].txt}"/>
    </div>
    `);
  } else {
    $(".oxquiz__card__right").html(`<span class="${GAME.examData[currentPage - 1].fSize ? "fSize" : ""}">${GAME.examData[currentPage - 1].view[1].txt}</span>`);
  }

  $("#pageCnt").html(currentPage);
  $("#pageCntAll").html(GAME.examData.length);
  // pageNumber.innerText = currentPage;
  $(".oxquiz__page__number .action").text(currentPage);
}

function uiResing() {
  let oxLeftLength = GAME.examData[currentPage - 1].view[0].txt.length;
  switch (String(oxLeftLength)) {
    case "1":
      $(".oxquiz__card__left").css("font-size", "160px");
      break;
    case "2":
      $(".oxquiz__card__left").css("font-size", "160px");
      break;
    case "3":
      $(".oxquiz__card__left").css("font-size", "160px");
      break;
    default:
      $(".oxquiz__card__left").css("font-size", "60px");
      break;
  }
  $(".oxquiz__card__left").css("color", "#42230D");
  if (GAME.examData[currentPage - 1].view[0].txt == "O") {
    $(".oxquiz__card__left").css("font-size", "360px");
    $(".oxquiz__card__left").css("color", "#1369ff");
  }

  let oxRightLength = GAME.examData[currentPage - 1].view[1].txt.length;
  switch (String(oxRightLength)) {
    case "1":
      $(".oxquiz__card__right").css("font-size", "160px");
      break;
    case "2":
      $(".oxquiz__card__right").css("font-size", "160px");
      break;
    case "3":
      $(".oxquiz__card__right").css("font-size", "160px");
      break;
    default:
      $(".oxquiz__card__right").css("font-size", "60px");
      break;
  }
  $(".oxquiz__card__right").css("color", "#42230D");
  if (GAME.examData[currentPage - 1].view[1].txt == "X") {
    $(".oxquiz__card__right").css("font-size", "360px");
    $(".oxquiz__card__right").css("color", "#ff4646");
  }
}

function gameStart() {
  //가이드 뜸
  setTimeout(() => {
    if (guideState) {
      $(".pearl-guide").css("display", "flex");
      guideState = false;
    }
  }, [2000]);
  audioBG.seek(0);
  audioBG.play();
  $(".page_num").css("display", "flex");
  introImg.style.display = "none";
  $(".oxquiz__start__btn").css("display", "none");
  // 게임시작 이후 1초 뒤 문제푸는 컨텐츠 보여줌
  setTimeout(() => {
    // 악어 양팔 흔드는 애니메이션 클래스
    characterHandLeft.classList.add("left__hand__active");
    characterHandRight.classList.add("right__hand__active");
    // 문제푸는 컨텐츠 보이게 함.
    quizBox.style.display = "flex";
    // 문제 발문영역 페이드인 클래스 추가
    quizTitEl.classList.add("card__loding");
    // 다음버튼 block처리.
    // nextBtn.style.display = "block";
  }, 1000);

  setTimeout(() => {
    $(".coon").animate({
      left: "1240px",
    });
  }, 200);
  setTimeout(() => {
    $(".left-pos").animate({
      left: "300px",
    });
  }, 200);
  GAME.soundPlay(audioWalk);
  character.classList.add("character__action");
}

// 게임 재시작
function gameRetry() {
  currentPage = 1;
  GAME.dataLoad(oxQuizData);
  // 악어 양팔 흔드는 애니메이션 클래스
  characterHandLeft.classList.remove("left__hand__active");
  characterHandRight.classList.remove("right__hand__active");
  // 문제푸는 컨텐츠 보이게 함.
  quizBox.style.display = "none";
  // 문제 발문영역 페이드인 클래스 추가
  quizTitEl.classList.remove("card__loding");
  character.classList.remove("character__action");
  clearPopup.style.display = "none";
  aniAni();
  init();
  setTimeout(() => {
    gameStart();
  }, 500);
}

// animation 초기화
function aniAni() {
  $("div[name=answer]").removeClass("card__checked");
  $(".character__body").removeClass("wrongImg");
  overlay.style.display = "none";
  wrong.style.display = "none";
  characterHandLeft.style.display = "block";
  characterHandRight.style.display = "block";
}

// 다음 페이지 이동
function pageCont() {
  if (currentPage < GAME.examData.length) {
    currentPage++;
    $("#pageCnt").html(currentPage);
    init();
  } else {
    try {
      callFinish();
    } catch (e) {}
    audioBG.pause();
    clearPopup.style.display = "block";
    GAME.soundPlay(audioComplete);
  }
}

// 정답 체크하는 함수
function answerCheck(target) {
  console.log();
  GAME.soundPlay(audioButton);
  aniAni();
  let answerBool = false;
  if (
    (target.innerText || $(target).children().children()[0].alt) ==
    GAME.examData[currentPage - 1].answer[0]
  ) {
    answerBool = true;
  }
  if (answerBool) {
    GAME.soundPlay(audioAnswer);
    correctAction(target);
  } else {
    wrongAction();
  }
}

// 정답이 맞을 경우
function correctAction(target) {
  target.classList.add("card__checked");
  overlay.style.display = "block";
  setTimeout(() => {
    aniAni();
    pageCont();
  }, 1000);
}

// 정답이 틀릴 경우
function wrongAction() {
  wrong.style.display = "block";
  characterBody.classList.add("wrongImg");
  // characterHandLeft.style.display = "none";
  // characterHandRight.style.display = "none";
  GAME.soundPlay(audioAnswerWro);
  setTimeout(() => {
    aniAni();
  }, 1000);
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
