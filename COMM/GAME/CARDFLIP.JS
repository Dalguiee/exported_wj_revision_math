// 배경음
const audioBG = new Howl({
  src: ["../../../COMM/SOUND/GAME/BG_CARDFLIP.MP3"],
  volume: 0.8,
  autoplay: false,
  loop: true,
});
//버튼 클릭 음
const audioButton = new Audio("../../../COMM/SOUND/GAME/BUTTON.MP3");
//휙 소리
const audioWind = new Audio("../../../COMM/SOUND/GAME/WIND.MP3");
//완료
const audioComplete = new Audio("../../../COMM/SOUND/GAME/COMPLETE.MP3");
//정답 소리
const audioAnswer = new Audio("../../../COMM/SOUND/GAME/ANSWER.MP3");
//정답 틀림
const audioAnswerWro = new Audio("../../../COMM/SOUND/GAME/ANSWERWRO.MP3");

// $(".pearl-guide").on("click", () => {
//   $(".pearl-guide").css("display", "none");
// });
// $(".pearl-guide").on("mouseup", () => {
//   $(".pearl-guide").css("display", "none");
// });
// $(".pearl-guide").on("touchend", () => {
//   $(".pearl-guide").css("display", "none");
// });

//카드 리스트
let cardData = [
  {
    id: 1,
    epilogue: "수가 같은 것끼리 그림을 맞춰봐요.",
    view: [
      { img: "../../../COMM/IMG/CARDFLIP/CARD1_2_1001.PNG", txt: "", val: "1" },
      { img: "../../../COMM/IMG/CARDFLIP/CARD1_2_1002.PNG", txt: "", val: "3" },
      { img: "../../../COMM/IMG/CARDFLIP/CARD1_2_1003.PNG", txt: "", val: "2" },
      { img: "../../../COMM/IMG/CARDFLIP/CARD1_2_1004.PNG", txt: "", val: "4" },
      { img: "../../../COMM/IMG/CARDFLIP/CARD1_2_1005.PNG", txt: "", val: "4" },
      { img: "../../../COMM/IMG/CARDFLIP/CARD1_2_1006.PNG", txt: "", val: "2" },
      { img: "../../../COMM/IMG/CARDFLIP/CARD1_2_1007.PNG", txt: "", val: "1" },
      { img: "../../../COMM/IMG/CARDFLIP/CARD1_2_1008.PNG", txt: "", val: "3" },
    ],
  },
];

//뒤집어진 카드 리스트
let flipData = [];
//카드 맞춘 갯수
let score = 0;
//최종 클리어 점수
let clearScore = 0;
// 문항 숫자
let questionNum = 1;
//가이드 실행 여부
let guideState = true;

$(document).ready(function () {
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

  GAME.dataLoad(cardData);
  uiSetting();
  //게임시작 버튼
  $(".game_intro_btn").click(function () {
    audioBG.play();
    GAME.soundPlay(audioButton);
    $(".page_num").css("display", "flex");
    gameStart();
    cardRender();
    cardLengthFn(GAME.examData[questionNum - 1].view.length);
  });

  //테스트용 버튼 추 후 삭제-----------------------------------------
  $(".testBtn1").click(function () {
    gameStart();
    cardRender(6);
    cardLengthFn(6);
  });
  $(".testBtn2").click(function () {
    gameStart();
    cardRender(8);
    cardLengthFn(8);
  });
  $(".testBtn3").click(function () {
    gameStart();
    cardRender(12);
    cardLengthFn(12);
  });
});

// 게임 재시작
function gameRetry() {
  flipData = [];
  score = 0;
  clearScore = 0;
  questionNum = 1;
  $("#complete_popup").css("display", "none");
  $(".card-list").html("");
  $(".game_title").fadeOut(300, () => {
    $(".game_title").removeClass("motionStart");
    audioBG.play();
  });

  GAME.dataLoad(cardData);
  uiSetting();
  gameStart();
  cardRender();
  cardLengthFn(GAME.examData[questionNum - 1].view.length);
}

// 다음 게임
function gameNext() {
  console.log("gameNext");
  if (
    questionNum == GAME.examData.length &&
    score == GAME.examData[questionNum - 1].view.length / 2
  ) {
    try {
      callFinish();
    } catch (e) {}
    setTimeout(() => {
      audioBG.seek(0);
      audioBG.pause();
      $(".end-popup").fadeIn(200);
      GAME.soundPlay(audioComplete);
    }, [1200]);
  } else {
    questionNum++;
    setTimeout(() => {
      $(".card-list").fadeOut(500, () => {
        $(".card-list").html("");
        $(".card-list").css("display", "flex");
        score = 0;
        uiSetting();
        gameStart();
        cardRender();
        cardLengthFn(GAME.examData[questionNum - 1].view.length);
      });
    }, 500);
  }
}

// ui 셋팅
function uiSetting() {
  $("#pageCnt").html(questionNum);
  $("#pageCntAll").html(GAME.examData.length);
  $(".game_title").html(GAME.examData[questionNum - 1].epilogue);
  try {
    if (pageId === "readyGame") {
      $(".play_view").css("display", "none");
      $(".buttonArea > p").css("display", "none");
    }
  } catch (e) {}
}

//정답 일 시 실행
const correctFn = () => {
  //오픈 된 카드 완료 처리
  $(".flip").addClass("clear");
  // O 말풍선 출력, 캐릭터 이미지 변경
  GAME.soundPlay(audioAnswer);
  setTimeout(() => {
    $(".character_o-sign").fadeIn(400);
    $(".character_basic").hide();
    $(".character_cor").show();
    setTimeout(() => {
      $(".character_o-sign").fadeOut(400);
      $(".character_basic").show();
      $(".character_cor").hide();
    }, [1600]);
  }, [400]);
  // 스코어 + 1
  score = score + 1;
  // 모든 카드 클리어 했을 시 결과 팝업
  console.log(score);
  console.log(clearScore);
  if (score >= clearScore) {
    gameNext();
  }
};

//정답이 아닐 시 실행
const wrongFn = () => {
  // X 말풍선 출력, 캐릭터 이미지 변경
  GAME.soundPlay(audioAnswerWro);
  setTimeout(() => {
    $(".character_x-sign").fadeIn(400);
    $(".character_basic").hide();
    $(".character_wro").show();
    setTimeout(() => {
      $(".character_x-sign").fadeOut(400);
      $(".character_basic").show();
      $(".character_wro").hide();
    }, [1600]);
  }, [400]);
};

//카드 앞면 클릭 하면 실행
const cardClick = (card) => {
  card.parent().addClass("flip");
  flipData.push(card.parent().parent().attr("data"));
  //뒤집어진 갯수 2개 이상일때 실행
  if ($(".flip").length >= 2) {
    $(".card_front").attr("disabled", true);
    // 정답일 경우
    if (flipData[0] === flipData[1]) {
      correctFn();
      // 정답이 아닐 경우
    } else {
      wrongFn();
    }
    //카드 초기화
    setTimeout(() => {
      $(".card_front").attr("disabled", false);
      $(".card").removeClass("flip");
      flipData = [];
    }, [1000]);
  }
};

//카드 랜더링
const cardRender = () => {
  setTimeout(() => {
    new Audio("../../../COMM/SOUND/GAME/WIND.MP3").play();
    setTimeout(() => {
      new Audio("../../../COMM/SOUND/GAME/WIND.MP3").play();
      setTimeout(() => {
        new Audio("../../../COMM/SOUND/GAME/WIND.MP3").play();
      }, [200]);
    }, [200]);
  }, [1000]);
  $.each(GAME.examData[questionNum - 1].view, (idx, card) => {
    $(".card-list").append(
      `<li class="card-item" data="${card.val}" style="animation-delay : ${
        idx / 10
      }s;">
        <div class="card">
          <button class="card_front"></button>
          <button class="card_back">
          ${
            card.img
              ? `<img src="${card.img}" alt="카드이미지" />`
              : `<div>${card.txt}</div>`
          }
            
          </button>
        </div>
      </li>`
    );
  });
  //카드 앞면 클릭
  $(".card_front").click(function () {
    GAME.soundPlay(audioWind);
    cardClick($(this));
  });
};

// 카드 데이터 수에 따른 UI, 지정
const cardLengthFn = (length = GAME.examData.length) => {
  if (length === 6) {
    $(".card-list").addClass("length6");
  } else if (length === 8) {
    $(".card-list").addClass("length8");
  } else if (length === 12) {
    $(".card-list").addClass("length12");
  } else {
    alert("카드 데이터 갯수가 맞지 않습니다.");
  }
  // 최종 클리어점수 지정
  clearScore = length / 2;
};

//게임 시작 버튼 누르면 실행
const gameStart = () => {
  // setTimeout(() => {
  //   if (guideState) {
  //     $(".pearl-guide").css("display", "flex");
  //     guideState = false;
  //   }
  // }, [2800]);

  $(".page_num").css("display", "flex");
  //인트로 페이드아웃
  $(".game_intro").fadeOut(200);
  //메인 타이틀 페이드인, 떨어지는모션
  setTimeout(() => {
    $(".game_title").fadeIn(800);
    $(".game_title").css("display", "flex");
    $(".game_title").addClass("motionStart");
  }, [500]);
  //카드 뒤집어지면서 랜더링 되는 모션
  setTimeout(() => {
    $(".card-item").addClass("motionStart");
  }, [1300]);
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
