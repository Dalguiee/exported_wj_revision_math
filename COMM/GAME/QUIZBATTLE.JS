// 배경음
var audioBG = new Howl({
  src: ["../../../COMM/SOUND/GAME/BG_QUIZBATTLE.MP3"],
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
//정답 틀림
const audioAnswerWro = new Audio("../../../COMM/SOUND/GAME/ANSWERWRO.MP3");
//완료
const audioComplete = new Audio("../../../COMM/SOUND/GAME/COMPLETE.MP3");
//실패
const audioWrong = new Audio("../../../COMM/SOUND/GAME/WRONG.MP3");

//문제 데이터
let quizList = [
  {
    id: 1,
    epilogue: "15 + 12를 더하면 20이 맞을까?0",
    exam: [{ img: "../../../COMM/IMG/QUIZBATTLE/QUIZ1.PNG", txt: "", val: "" }],
    view: [
      { img: "", txt: "10000", val: "10000" },
      { img: "", txt: "20000", val: "20000" },
      { img: "", txt: "30000", val: "30000" },
    ],
    answer: ["10000"],
  },
  {
    id: 2,
    epilogue: "15 + 13를 더하면 20이 맞을까?1",
    exam: [{ img: "../../../COMM/IMG/QUIZBATTLE/QUIZ2.PNG", txt: "", val: "" }],
    view: [
      { img: "", txt: "10001", val: "10001" },
      { img: "", txt: "20001", val: "20001" },
      { img: "", txt: "30001", val: "30001" },
    ],
    answer: ["20001"],
  },
  // {
  //   id: 3,
  //   epilogue: "15 + 14를 더하면 20이 맞을까?2",
  //   exam: [{ img: "../../../COMM/IMG/QUIZBATTLE/QUIZ1.PNG", txt: "", val: "" }],
  //   view: [
  //     { img: "", txt: "10002", val: "10002" },
  //     { img: "", txt: "20002", val: "20002" },
  //     { img: "", txt: "30002", val: "30002" },
  //   ],
  //   answer: ["30002"],
  // },
];

//플레이어 점수
let score1 = 0;
//분석이 점수
let score2 = 0;
// 문제 카운트
let quizCount = 0;
//가이드 실행 여부
let guideState = true;

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
  try {
    if (pageId === "readyGame") {
      $(".play_view").css("display", "none");
      $(".buttonArea > p").css("display", "none");
    }
  } catch (e) { }

  try {
    if (firstContents === "game") {
      $(".play_view").css("display", "flex");
    } else {
      $(".play_view").css("display", "none");
    }
  } catch (e) { }

  //확인문제 영상 시청 시 버튼 뜨지 않기
  try {
    if (watchVideo) {
      $(".play_view").css("display", "none");
    } else {
      $(".play_view").css("display", "flex");
    }
  } catch (e) { }
  //로딩 제거
  try {
    $(".window-loading").remove();
  } catch (e) { }

  console.log("퀴즈대결 GAME");
  GAME.dataLoad(quizList);
  $("#pageCnt").html(quizCount + 1);
  $("#pageCntAll").html(GAME.examData.length);
  quizSlideRender();
  quizBtnRender();
  explanationRender();
  buttonLen();

  // -----게임 시작 버튼-----{
  $(document).on("click", ".game_intro_start", function () {
    //가이드 뜸
    setTimeout(() => {
      if (guideState) {
        $(".pearl-guide").css("display", "flex");
        guideState = false;
      }
    }, [3400]);
    audioBG.seek(0);
    audioBG.play();
    GAME.soundPlay(audioButton);
    gameStart();
  });

  // 정답 버튼 클릭
  $(".quiz-list_item_btn").click(function () {
    GAME.soundPlay(audioButton);
    //버튼 disabled
    $(".quiz-list_item_btn").attr("disabled", true);
    //정답리스트 애니 관련 클래스 초기화
    $(".quiz-list_item").removeClass("quiz-list-up");
    $(".quiz-list_item").removeClass("motionStart");
    //현재 문제 정답
    let nowAnswer = GAME.examData[quizCount].answer;
    //선택된 정답
    let chooseAnswer = $(this).children()[0].innerHTML;
    let correctAnswerd = null;
    if (nowAnswer.includes(chooseAnswer)) {
      //정답 일 경우
      correctAnswerd = true;
      correctAnswer();
    } else {
      //정답이 아닐 경우
      correctAnswerd = false;
      wrongAnswer($(this), nowAnswer);
    }
    // 문제 카운트 + 1
    quizCount = quizCount + 1;
    //게임 끝내는 팝업
    endingFn(correctAnswerd);
  });
});

function gameStart() {
  $(".page_num").css("display", "flex");
  $(".quiz-list_item_btn").attr("disabled", true);
  // 인트로 페이드 아웃
  $(".game_intro").fadeOut(480);
  // 타이틀 떨어짐
  setTimeout(() => {
    $(".game_title").addClass("motionStart");
  }, [600]);
  // 캐릭터 슬라이드 하면 등장
  setTimeout(() => {
    GAME.soundPlay(audioWind);
    $(".character1-slide").addClass("motionStart");
    $(".character2-slide").addClass("motionStart");
  }, [1200]);
  //문제화면 등장
  setTimeout(() => {
    $(".quiz-screen-closeup").addClass("motionStart");
    $(".quiz-list_item_btn").attr("disabled", false);
  }, [2400]);
  //문제들 등장
  setTimeout(() => {
    $(".quiz-list-up").addClass("motionStart");
  }, [3000]);
}

// 게임 재시작
function gameRetry() {
  audioBG.seek(0);
  audioBG.play();
  $("#complete_popup").fadeOut(200, () => {
    $("#complete_popup").removeClass("defeat");
  });
  $(".quiz-screen_list").html("");
  $(".star-list_img").removeClass("motionStart");
  score1 = 0;
  score2 = 0;
  quizCount = 0;
  GAME.dataLoad(quizList);

  $("#pageCnt").html(quizCount + 1);
  $("#pageCntAll").html(GAME.examData.length);

  $(".quiz-list_item").addClass("quiz-list-up");
  $(".game_title").removeClass("motionStart");
  $(".character1-slide").removeClass("motionStart");
  $(".character2-slide").removeClass("motionStart");
  $(".quiz-list-up").removeClass("motionStart");
  $(".quiz-screen-closeup").removeClass("motionStart");
  quizSlideRender();
  quizBtnRender();
  explanationRender();
  buttonLen();
  setTimeout(() => {
    gameStart();
  }, 200);
}

//문제 슬라이드 랜더링
const quizSlideRender = () => {
  console.log(quizCount);
  $(GAME.examData).each(function (index, item) {
    $(".quiz-screen_list").css("width", `${100 * GAME.examData.length}%`);
    $(".quiz-screen_list").append(`
      <li class="quiz-screen_list_item">
        <h3 class="">${item.epilogue}</h3>
        ${GAME.examData[index].exam[0].img &&
      `<img src=${GAME.examData[index].exam[0].img} alt="" />`
      }
      </li>
      `);
  });
  $(".quiz-screen_list").css("transform", `translateX(0)`);
};

//문제 선택 버튼 랜더링
const quizBtnRender = () => {
  console.log(GAME.examData[quizCount].lcmRatio)
  if (GAME.examData[quizCount].view[0].img) {
    $(".quiz-list").addClass("img");
  } else {
    $(".quiz-list").removeClass("img");
  }
  for (let i = 0; i < 3; i++) {
    $(".quiz-list_item").eq(i).children().children().remove();
    $(".quiz-list_item")
      .eq(i)
      .children()
      .append(
        `
          <p class="${GAME.examData[quizCount].view[i].img ? "d-none" : ""}">${GAME.examData[quizCount].view[i].txt
        }</p>
          ${GAME.examData[quizCount].view[i].img &&
        `
              <div class="img-warp ${GAME.examData[quizCount].lcmRatio ? "lcmRatio" : ""}">
                <img src="./../../../COMM/IMG/QUIZBATTLE/${GAME.examData[quizCount].view[i].img}" />
              </div>
            `
        }
          `
      );
  }
};

//발문 랜더링
const explanationRender = () => {
  if (GAME.examData[quizCount].exam[0].txt) {
    $(".game_title").text(`${GAME.examData[quizCount].exam[0].txt}`);
  } else {
    $(".game_title").text("정답을 맞혀서 분석파를 이겨 보자!");
  }
};

//문제 버튼 갯수 2개, 3개 전환
const buttonLen = () => {
  if (grade == 'grade2' && unit == 'unit2') {
    if (GAME.examData[quizCount].view[2].txt) {
      $(".quiz-list_item").eq(2).removeClass("d-none");
    } else {
      $(".quiz-list_item").eq(2).addClass("d-none");
    }
  }
};

//다음 문제로 넘어감------------------------
const nextQuiz = () => {
  if (quizCount < GAME.examData.length) {
    //문제 퇴장모션
    $(".quiz-list_item").addClass("quiz-list-down");
    //다음문제 준비
    setTimeout(() => {
      explanationRender();
      quizBtnRender();
      buttonLen();
      $(".quiz-list_item").removeClass("quiz-list-down");
      $(".quiz-list_item").addClass("quiz-list-up");
    }, [1000]);
    //문제 등장 모션
    setTimeout(() => {
      $(".quiz-list_item").addClass("motionStart");
      $(".quiz-list_item_btn").attr("disabled", false);
    }, [1800]);
    //문제 스크린 화면 다음으로 슬라이드
    setTimeout(() => {
      GAME.soundPlay(audioWind);
      $(".quiz-screen_list").css(
        "transform",
        `translateX(-${(100 / GAME.examData.length) * quizCount}%)`
      );
      $("#pageCnt").html(quizCount + 1);
    }, [1200]);
  }
};

// 정답 맞춘 경우------------------------
const correctAnswer = () => {
  correctAnswerd = true;
  GAME.soundPlay(audioAnswer);

  $(".charac.default").hide();
  $(".charac.correct").show();
  setTimeout(() => {
    $(".charac.default").show();
    $(".charac.correct").hide();
  }, [1800]);

  // 정답 O 사인 페이드인
  setTimeout(() => {
    $(".osign").fadeIn(300);
    setTimeout(() => {
      $(".osign").fadeOut(300);
    }, [1000]);
  }, [300]);
  //플레이어 별 생성
  setTimeout(() => {
    $(".character1 .star-list_img")
      .eq(score1 - 1)
      .addClass("motionStart");
  }, [1800]);
  //다음 퀴즈로 넘어감
  setTimeout(() => {
    nextQuiz();
  }, [2800]);
  //플레이어 점수 + 1
  score1 = score1 + 1;
};

// 정답 틀린 경우------------------------
const wrongAnswer = (thisBtn, nowAnswer) => {
  GAME.soundPlay(audioAnswerWro);
  correctAnswerd = false;
  thisBtn.parent().addClass("quiz-wrong");
  setTimeout(() => {
    thisBtn.parent().removeClass("quiz-wrong");
  }, [1200]);
  //캐릭터 표정 애니메이션
  setTimeout(() => {
    $(".charac.default").hide();
    $(".charac.wrong").show();

    setTimeout(() => {
      $(".charac.default").show();
      $(".charac.wrong").hide();
    }, [1800]);
  }, [600]);
  //분석이 부저 불 들어옴
  setTimeout(() => {
    $(".character2 .desk.on").show();
    setTimeout(() => {
      $(".character2 .desk.on").hide();
    }, [2400]);
  }, [3200]);
  //정답에 테두리 표시
  setTimeout(() => {
    let answerIndex = 0;
    $(".quiz-list_item_btn p").each((index, item) => {
      // console.log(nowAnswer[0], $(item).text());
      if (nowAnswer[0] === $(item).text()) {
        answerIndex = index;
      }
    });

    $(".quiz-list_item").eq(answerIndex).addClass("outLine");
    setTimeout(() => {
      $(".quiz-list_item").eq(answerIndex).removeClass("outLine");
    }, [3200]);
  }, [4600]);
  //분석이 위에 O 표시
  setTimeout(() => {
    $(".character2 .osignsmall").fadeIn(200);
    setTimeout(() => {
      $(".character2 .osignsmall").fadeOut(200);
    }, [1800]);
  }, [5400]);
  //플레이어 별 생성
  setTimeout(() => {
    $(".character2 .star-list_img")
      .eq(score2 - 1)
      .addClass("motionStart");
  }, [6400]);
  //다음 퀴즈로 넘어감
  setTimeout(() => {
    nextQuiz();
  }, [8200]);
  //분석이 점수 + 1
  score2 = score2 + 1;
};

//승리 혹은 패배시 앤딩 이벤트
const endingFn = (answer) => {
  if (quizCount == GAME.examData.length && score1 >= score2) {
    try {
      setTimeout(() => {
        callFinish();
      }, [answer ? 2400 : 8800]);
    } catch (e) { }
    //승리 시
    $(".quiz-list_item_btn").attr("disabled", true);
    setTimeout(() => {
      audioBG.seek(0);
      audioBG.pause();
      $("#complete_popup").fadeIn(200);
      GAME.soundPlay(audioComplete);
    }, [answer ? 2400 : 8800]);
  } else if (quizCount == GAME.examData.length && score1 < score2) {
    try {
      setTimeout(() => {
        callFinish();
      }, [answer ? 2400 : 8800]);
    } catch (e) { }
    //패배 시
    $(".quiz-list_item_btn").attr("disabled", true);
    setTimeout(() => {
      audioBG.seek(0);
      audioBG.pause();
      GAME.soundPlay(audioWrong);
      $("#complete_popup").fadeIn(200);
      $("#complete_popup").addClass("defeat");
    }, [answer ? 2400 : 8800]);
  }
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
