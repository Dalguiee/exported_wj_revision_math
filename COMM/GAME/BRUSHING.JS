// 배경음
const audioBG = new Howl({
  src: ["../../../COMM/SOUND/GAME/BG_BRUSHING.MP3"],
  volume: 0.8,
  autoplay: false,
  loop: true,
});
//버튼 클릭 음
const audioButton = new Audio("../../../COMM/SOUND/GAME/BUTTON.MP3");
//정답 소리
const audioAnswer = new Audio("../../../COMM/SOUND/GAME/ANSWER.MP3");
//정답 틀림
const audioAnswerWro = new Audio("../../../COMM/SOUND/GAME/ANSWERWRO.MP3");
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

//정답 입력칸 리스트
let answerInputList = [
  {
    id: 1,
    exam: [
      { img: "", txt: "", val: "8" },
      { img: "", txt: "+", val: "+" },
      { img: "", txt: "2", val: "2" },
      { img: "", txt: "=", val: "=" },
      { img: "", txt: "10", val: "10" },
      { img: "", txt: "4", val: "4" },
      { img: "", txt: "-", val: "-" },
      { img: "", txt: "", val: "3" },
      { img: "", txt: "=", val: "=" },
      { img: "", txt: "", val: "1" },
    ],
    view: [
      { img: "", txt: "8", val: "8" },
      { img: "", txt: "3", val: "3" },
      { img: "", txt: "1", val: "1" },
    ],
  },
];

let answerCount = 0; //정답 맞춘 수
let questionNum = 1; // 현재 문항 숫자

let guideState = true; //가이드 실행 여부

if (typeof jQuery === "undefined") {
  window.location.reload();
}

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
    $(".window-loading").remove();
  } catch (e) {}

  GAME.dataLoad(answerInputList);
  init();
  // -----게임 시작 버튼-----
  $(".game_intro_start").click(function () {
    GAME.soundPlay(audioButton);
    gameStart();
  });
  dregFn();
  dropppFn();
});

// 초기화
function init() {
  //정답 입력칸(이빨) 랜더링
  $(".answer-input-list").html("");
  $(GAME.examData[questionNum - 1].exam).each(function (index, item) {
    var $newDiv = $(
      `
      <div class="answer-input-list_item ${
        item.txt ? "" : "droppable"
      }"><p value=${item.val}>${item.txt !== "10" ? item.txt : ""}</p></div>
      `
    );
    $(".answer-input-list").append($newDiv);
  });
  //문항 랜더링
  $(".quiz-list").html("");
  // 초기 상태: fontSizeUp 클래스를 추가하지 않음
  var className = 'quiz-list_item draggable';

  // GAME.examData[questionNum - 1].view에 있는 모든 item을 검사
  var items = GAME.examData[questionNum - 1].view;
  for (var i = 0; i < items.length; i++) {
    var value = parseFloat(items[i].val);
    if (!isNaN(value) && value >= 100) {
      className += ' fontSizeDown';
      break;
    }
  }

  $(items).each(function (index, item) {
    var $newDiv = $(
      `
      <li class="${className}">${item.val}</li>
      `
    );
    $(".quiz-list").append($newDiv);

    $("#pageCnt").html(questionNum);
    $("#pageCntAll").html(GAME.examData.length);
  });
  $(".character").removeClass("motionStart");
  $(".quiz-list").removeClass("motionStart");
  $(".character_arm").removeClass("motionStart");
  $(".draggable").draggable();
  $(".droppable").droppable();
  answerCount = 0;
}

function bgStart() {
  audioBG.seek(0);
  audioBG.play();
}

// 게임 시작
function gameStart() {
  //가이드 뜸
  setTimeout(() => {
    if (guideState) {
      $(".pearl-guide").css("display", "flex");
      guideState = false;
    }
  }, [3400]);
  $(".page_num").css("display", "flex");
  $(".game_intro").fadeOut(480);
  // 인트로 페이드 아웃
  // 700ms 후 캐릭터 등장
  setTimeout(() => {
    $(".character").addClass("motionStart");
  }, [700]);
  // 1800ms 후 캐릭터 팔 드는 모션
  setTimeout(() => {
    $(".character_arm").addClass("motionStart");
  }, [1800]);
  // 2200ms 옆에서 문항 등장
  setTimeout(() => {
    $(".quiz-list").addClass("motionStart");
    $(".game_title_inner").html(GAME.examData[questionNum - 1].epilogue);
    $(".game_title").fadeIn(480);
  }, [2200]);
}

// 게임 재시작
function gameRetry() {
  bgStart();
  let gameData = GAME.dataLoad();
  if (gameData) GAME.examData = gameData;
  questionNum = 1;
  $("#complete_popup").fadeOut(300);
  $(".answer-input-list").fadeOut(1000, () => {
    $(".answer-input-list").css("display", "flex");
    init();
    gameStart();
    dregFn();
    dropppFn();
  });
  $(".character").fadeOut(1000, () => $(".character").css("display", "flex"));
  $(".game_title").fadeOut(480);
  setTimeout(() => {
    $(".game_title_inner").html(GAME.examData[questionNum - 1].epilogue);
    $(".game_title").fadeIn(480);
  }, [4500]);
}

// 다음 게임
function gameNext() {
  if (questionNum != GAME.examData.length) {
    questionNum++;
    $(".answer-input-list").fadeOut(1000, () => {
      $(".answer-input-list").css("display", "flex");
      init();
      gameStart();
      dregFn();
      dropppFn();
    });
    $(".character").fadeOut(1000, () => $(".character").css("display", "flex"));
    $(".game_title").fadeOut(480);
    setTimeout(() => {
      $(".game_title_inner").html(GAME.examData[questionNum - 1].epilogue);
      $(".game_title").fadeIn(480);
    }, [4500]);
  } else {
    gameEnd();
  }
}

// 게임 종료
function gameEnd() {
  try {
    callFinish();
  } catch (e) {}

  audioBG.pause();

  setTimeout(() => {
    $("#complete_popup").fadeIn(300);
    GAME.soundPlay(audioComplete);
  }, [300]);
}

// 드래그 할 경우 함수
const dregFn = () => {
  $(".draggable")
    .draggable()
    .on("draggable:start", function (droppp, drag) {
      GAME.soundPlay(audioButton);

      $(".draggable").removeClass("active dragging");

      drag.item.addClass("active");

      $(this).addClass("dragging");
      $(".draggable:not(.dragging)").css("pointer-events", "").css("transform", "");
    })
    .on("draggable:stop", function (droppp, drag) {
      drag.item.removeClass("active");
      
      $(this).removeClass("dragging");
    });
};

//드롭 할 경우 함수
const dropppFn = () => {
  $(".droppable")
    .droppable()
    .on("droppable:drop", function (droppp, drag) {
      let dropppText = droppp.currentTarget.childNodes[0].getAttribute("value");
      let dragText = drag.item[0].outerText;
      // 정답체크
      if (dropppText === dragText) {
        // 정답 맞춘 갯수 + 1
        answerCount = answerCount + 1;
        //정답 시 O 사인 딤드 페이드인/아
        // if (answerCount < 3) {
        GAME.soundPlay(audioAnswer);
        $(".osign").fadeIn(300);
        setTimeout(() => {
          $(".osign").fadeOut(300);
        }, [900]);
        // }
        //정답 아닐 경우 문항리스트에 다시 추가, 튕겨지는 애니
      } else {
        drag.item.addClass("off");
        GAME.soundPlay(audioAnswerWro);
        setTimeout(() => {
          drag.item.removeClass("off");
        }, [600]);
        return false;
      }
      // 드롭 후 고정
      drag.item.addClass("pointerNone");

      //정답 3개 맞췄을 경우
      if (answerCount >= GAME.examData[questionNum - 1].view.length) {
        setTimeout(() => {
          gameNext();
        }, [1200]);
      }
    });
};

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
