// 배경음
const audioBG = new Howl({
  src: ["../../../COMM/SOUND/GAME/BG_CALCKING.MP3"],
  volume: 0.8,
  autoplay: false,
  loop: true,
});
//버튼 클릭 음
const audioButton = new Audio("../../../COMM/SOUND/GAME/BUTTON.MP3");
//휙 소리
const audioWind = new Audio("../../../COMM/SOUND/GAME/WIND.MP3");
//정답 소리
const audioAnswer = new Audio("../../../COMM/SOUND/GAME/ANSWER.MP3");
//오답 소리
const audioWrong = new Audio("../../../COMM/SOUND/WRONG.MP3");
//완료
const audioComplete = new Audio("../../../COMM/SOUND/GAME/COMPLETE.MP3");

$(".pearl-guide").on("click", () => {
  $(".pearl-guide").css("display", "none");
});
$(".pearl-guide").on("mouseup", () => {
  $(".pearl-guide").css("display", "none");
});
$(".pearl-guide").on("touchend", () => {
  $(".pearl-guide").css("display", "none");
});

// 계산왕 resource
let calcKingData = [
  {
    id: 1,
    epilogue: "물음표에 들어갈 숫자를 입력해봐!",
    exam: [{ img: "", txt: "", val: "2" }],
    view: [
      { img: "", txt: "1만큼 더 작은 수", val: "0" },
      { img: "", txt: "2만큼 더 큰 수", val: "1" },
    ],
  },
  {
    id: 2,
    epilogue: "물음표에 들어갈 숫자를 입력해봐!",
    exam: [{ img: "", txt: "", val: "550" }],
    view: [{ img: "", txt: "500+50=?", val: "" }],
  },
];

let totalPage = ""; // 총 페이지 수
let currentPage = 0; // 현재 페이지

//계산기 스크린에 뜨는 숫자(정답체크도 이걸로 함)
let calcSceenNum = "";

$(document).ready(function () {
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
    if (newVarExGame) {
      examData = gameData.game.data;
      calcKingData = examData.sort(() => Math.random() - 0.5);
      totalPage = gameData.game.data.length;
    }
  } catch (e) {
    examData = contentsData.data;
    calcKingData = examData.sort(() => Math.random() - 0.5);
    totalPage = contentsData.data.length;
  }

  try {
    $(".window-loading").remove();
  } catch (e) {}

  init();
});

// 게임시작
function gameStart() {
  audioBG.seek(0);
  audioBG.play();

  setTimeout(() => {
    $(".pearl-guide").css("display", "flex");
  }, [2000]);

  $(".page_num").css("display", "flex");
  GAME.soundPlay(audioButton);
  setTimeout(() => {
    GAME.soundPlay(audioWind);
  }, [400]);
  $(".calcking_bg").css("display", "none");
  $(".page__number").css("display", "flex");
  $(".calculator__wrapper").removeClass("calc__action");
  setTimeout(() => {
    $(".calculator__wrapper").css("display", "flex");
    $(".calculator__wrapper").addClass("calc__action");
  }, [1]);
  setTimeout(() => {
    $(".calculator__container").fadeIn(480);
    $(".calculator__container").css("display", "flex");
  }, [1000]);
  setTimeout(() => {
    $(".calc__title__wrapper").fadeIn(480);
  }, [1000]);
}
// back버튼 이벤트
function textDel() {
  GAME.soundPlay(audioButton);
  if (calcSceenNum.length > 0) {
    calcSceenNum = calcSceenNum.slice(0, -1);
    $(".calc-screen").html(calcSceenNum);
  }
}

// 키보드 클릭하는 함수
function onKeyboard(obj) {
  GAME.soundPlay(audioButton);
  //스크린에 숫자 입력
  if (calcSceenNum.length < 19) {
    calcSceenNum = `${calcSceenNum}${$(obj).val()}`;
    $(".calc-screen").html(calcSceenNum);
  }
}

//정답체크 버튼
function answerCheck() {
  if (calcSceenNum == calcKingData[currentPage].answer) {
    GAME.soundPlay(audioAnswer);
    currentPage++;
    answerCorrectly();
    pageCont();
    if (currentPage >= totalPage) {
      $(".keypad__top__box").attr("disabled", true);
      try {
        callFinish();
      } catch (e) {}
      audioBG.pause();
      setTimeout(() => {
        $("#complete_popup").fadeIn(300);
        GAME.soundPlay(audioComplete);
      }, [1000]);
    } else {
      answerCorrectly();
      pageCont();
    }
  } else {
    answerWrong();
  }
  $(".keypad__top__box").removeClass("card__checked");
  $(".keypad__top__box").attr("disabled", true);
  setTimeout(() => {
    $(".keypad__top__box").attr("disabled", false);
  }, [1200]);
}

// 정답 인터렉션
const answerCorrectly = () => {
  $(".overlay").css("display", "block");
  pageIndexRender();
  setTimeout(() => {
    $(".overlay").css("display", "none");
  }, 1000);
};

// 오답 인터렉션
const answerWrong = () => {
  calcSceenNum = "";
  $(".calc-screen").html("");
  $(".calculator__keypad__contents").addClass("calc__wrong");
  GAME.soundPlay(audioWrong);
  setTimeout(() => {
    $(".keypad__top__box").removeClass("wrongBg");
    $(".calculator__keypad__contents").removeClass("calc__action");
    $(".calculator__keypad__contents").removeClass("calc__wrong");
  }, 1000);
};

function init() {
  currentPage = 0;
  calcSceenNum = "";
  examRender();
  pageIndexRender();
}

function gameRetry() {
  if (contentsData.data) {
    examData = contentsData.data;
    calcKingData = examData.sort(() => Math.random() - 0.5);
    totalPage = contentsData.data.length;
  }
  init();
  audioBG.seek(0);
  audioBG.play();
  $("#complete_popup").fadeOut(300);
  $(".calc__title__wrapper").hide();
  $(".calculator__container").hide();
  $(".calculator__wrapper").removeClass("calc__action");
  setTimeout(() => {
    $(".calculator__wrapper").addClass("calc__action");
  }, [1]);
  setTimeout(() => {
    $(".calc__title__wrapper").fadeIn(480);
  }, [1000]);
  setTimeout(() => {
    $(".calculator__container").fadeIn(480);
    $(".calculator__container").css("display", "flex");
  }, [1000]);
}

// 발문 랜더링
function examRender() {
  if (totalPage >= currentPage + 1) {
    $(".calc__title__wrapper span").html(calcKingData[currentPage].epilogue);
    console.log("calcKingData.view:::::", calcKingData[currentPage].view);
    if (calcKingData[currentPage].view.img) {
      $(".calculator__container").html(`
        <img src=${calcKingData[currentPage].view.img} alt="">
      `);
    } else {
      $(".calculator__container").html(`${calcKingData[currentPage].view.txt}`);
    }
  }
}
// 페이지 인덱스 랜더링
function pageIndexRender() {
  if (totalPage >= currentPage + 1) {
    setTimeout(() => {
      $(".page_num").html(`
      <span id="pageCnt">${currentPage + 1}</span>
      <span>/</span>
      <span id="pageCntAll">${totalPage}</span>
    `);
    }, [1000]);
  }
}

// 다음 페이지 이동
function pageCont() {
  setTimeout(() => {
    calcSceenNum = "";
    $(".calc-screen").html(calcSceenNum);
    $(".calculator__container").fadeOut(480);
  }, [1000]);
  setTimeout(() => {
    examRender();
    $(".calculator__container").fadeIn(480);
    $(".calculator__container").css("display", "flex");
  }, [1600]);
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
