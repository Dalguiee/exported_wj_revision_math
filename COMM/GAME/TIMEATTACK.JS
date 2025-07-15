//배경음
const audioBG = new Howl({
  src: ["../../../COMM/SOUND/GAME/BG_TIMEATTACK.MP3"],
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
//실패
const audioWrong = new Audio("../../../COMM/SOUND/GAME/WRONG.MP3");
//완료
const audioComplete = new Audio("../../../COMM/SOUND/GAME/COMPLETE.MP3");

//문항 데이터
let quizData = [
  {
    id: 0,
    epilogue: "수 모형이 나타내는 수를 찾아보세요.",
    exam: [
      {
        img: "../../../COMM/IMG/TIMEATTACK/QUIZ_IMG1.PNG",
        txt: "",
        val: "1",
      },
    ],
    view: [
      { img: "", txt: "1", val: "1" },
      { img: "", txt: "2", val: "2" },
      { img: "", txt: "3", val: "3" },
      { img: "", txt: "4", val: "4" },
    ],
    answer: ["1"],
  },
];

//정답 맞춘 갯수
let score = 0;

//카운트다운 함수 저장
let countDown;

//타이머
let timeAttackTimer = 90;

let audioWrongPlay = true;

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
  GAME.dataLoad(quizData);
  try {
    if (pageId === "readyGame") {
      // 개념 영상없애기
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
  //로드 후 로딩UI 제거
  try {
    $(".window-loading").remove();
  } catch (e) { }

  $(".game_title > p").html(GAME.examData[score].epilogue);

  // 게임 시작 버튼
  $(document).on("click", ".game_intro_start", function () {
    audioBG.seek(0);
    audioBG.play();
    GAME.soundPlay(audioButton);
    $(".page_num").css("display", "flex");
    $("#pageCntAll").html(GAME.examData.length);
    $("#pageCnt").html(score + 1);
    gameStart();
    timeRender(timeAttackTimer);
  });

  //정답 선택지 버튼
  $(document).on("click", ".answer-list_btn", function () {
    answerClick($(this));
  });
});

// 게임 시작하는 함수
const gameStart = () => {
  //가이드 뜸
  setTimeout(() => {
    if (guideState) {
      $(".pearl-guide").css("display", "flex");
      guideState = false;
    }
  }, [9800]);
  $(".page_num").css("display", "flex");
  quizRender();
  answerListRander();
  // 인트로 페이드 아웃
  $(".game_intro").fadeOut(480);
  //카트 등장
  setTimeout(() => {
    GAME.soundPlay(audioWalk);
    $(".game_cart").addClass("motion");
    //캐릭터 차량 뒤로 이동
    setTimeout(() => {
      GAME.soundPlay(audioWalk);
      $(".arm").hide();
      $(".character").addClass("motion");
      //운전석 이동
      setTimeout(() => {
        $(".game_car_character").addClass("motion");
        //타이틀 페이드인
        setTimeout(() => {
          $(".game_title").fadeIn(600);
          //도로 주행하는 모션
          setTimeout(() => {
            $(".cart_wheel").addClass("wheel-motion");
            $(".game_car_wheel").addClass("wheel-motion");
            $(".game").addClass("motion");
            setTimeout(() => {
              // 정답선택지 등장
              $(".game_car_screen").fadeIn(200);
              $(".game_car_screen").css("display", "flex");
              setTimeout(() => {
                // 문제 보기 등장
                $(".answer-list_item").addClass("motion");
              }, [400]);
              //타이머 실행
              setTimeout(() => {
                countDown = setInterval(() => {
                  timeRender(timeAttackTimer);
                  meltingIcecream(timeAttackTimer);
                  if (timeAttackTimer < 0) {
                    clearInterval(countDown);
                  }
                }, [1000]);
              }, [400]);
            }, [600]);
          }, [1000]);
        }, [1400]);
      }, [1600]);
    }, [2800]);
  }, [1200]);
};

// 게임 재시작하는 함수
const gameRetry = () => {
  audioBG.seek(0);
  audioBG.play();
  audioWrongPlay = true;
  GAME.dataLoad(quizData);
  score = 0;
  $("#pageCnt").html(score + 1);
  $("#pageCntAll").html(GAME.examData.length);
  for (let i = 2; i <= 4; i++) {
    $(".iscream").removeClass(`type${i}`);
  }
  $(".iscream").addClass(`type1`);
  $(".answer-list_item").removeClass("motion-down");
  $(".answer-list_item").removeClass("motion");
  $(".game_car_screen").css("display", "none");
  timeAttackTimer = 90;
  $("#complete_popup").fadeOut(200, () => {
    $("#complete_popup").removeClass("defeat");
  });
  $(".cart_wheel").removeClass("wheel-motion");
  $(".game_car_wheel").removeClass("wheel-motion");
  $(".game_title").css("display", "none");
  $(".game_cart").removeClass("motion");
  $(".character").removeClass("motion");
  $(".game_car_character").removeClass("motion");
  $(".game").removeClass("motion");
  $(".answer-list").removeClass("motion");
  $(".game_car_screen").removeClass("motion");
  gameStart();
  timeRender(timeAttackTimer);
};

//시간 변환 후 랜더링
const timeRender = (seconds) => {
  let min = parseInt((seconds % 3600) / 60);
  let sec = seconds % 60;
  if (min < 10) {
    min = `0${min}`;
  }
  if (sec < 10) {
    sec = `0${sec}`;
  }
  $(".cart_time").text(`${min}:${sec}`);
  timeAttackTimer = timeAttackTimer - 1;
};

//시간에 따른 아이스크림 변화
const meltingIcecream = (time) => {
  for (let i = 1; i <= 3; i++) {
    if ($(".iscream").hasClass(`type${i}`) && time < 90 - i * 30) {
      $(".iscream").removeClass(`type${i}`);
      $(".iscream").addClass(`type${i + 1}`);
    }
  }
  //시간 초과 시 패배
  if (time <= 0 && score < GAME.examData.length) {
    try {
      callFinish();
    } catch (e) { }
    audioBG.seek(0);
    audioBG.pause();
    setTimeout(() => {
      if (audioWrongPlay) {
        $("#complete_popup").fadeIn(300);
        $("#complete_popup").addClass("defeat");
        GAME.soundPlay(audioWrong);
        audioWrongPlay = false;
      }
    }, [1400]);
  }
};



//문제 보기 랜더링
const quizRender = () => {
  console.log("quizRender");
  console.log(GAME.examData[score]);
  $(".game_car_screen").empty();
  $(".game_car_screen").append(
    // `${GAME.examData[score].exam[0].txt ?
    //   GAME.examData[score].fz100 ?
    //     //  fz100 boolean 여부에 따라 삼항연산, fz100 클래스네임 추가
    //     `<p class="text fz100">${GAME.examData[score].exam[0].txt}</p>` : `<p class="text">${GAME.examData[score].exam[0].txt}</p>`

    //     // txt 없을경우 img 출력
    //     // h85 boolean 여부에 따라 이미지 크기 제한
    //   : GAME.examData[score].h85 ? 
    //   `<img src="${GAME.examData[score].exam[0].img}" class="img h85" />` : `<img src="${GAME.examData[score].exam[0].img}" class="img" />`
    // }`

    `${GAME.examData[score].exam[0].txt ?
        //  fz100 여부에 따라 삼항연산, fz100 클래스네임 추가
        `<p class="text ${GAME.examData[score].fz100 ? "fz100" : ""}">${GAME.examData[score].exam[0].txt}</p>`
        :
        // txt 없을경우 img 출력
        // h85 boolean 여부에 따라 이미지 크기 제한
        `<img src="${GAME.examData[score].exam[0].img}" class="img ${GAME.examData[score].h85 ? "h85" : ""}" />`
    }`
  );
};

//문제 리스트 랜더링
const answerListRander = () => {
  $(".game_title > p").html(GAME.examData[score].epilogue);
  $(".answer-list").empty();
  $(GAME.examData[score].view).each(function (index, item) {
    let textLength = false;
    if (item.txt.length > 3) {
      textLength = true;
    }
    $(".answer-list").append(
      `
          <li class="answer-list_item" style="animation-delay: 0.${index}s">
            <button class="answer-list_btn" data-answer="${item.val}">
            ${item.txt
        ? `<p class="text">${item.txt}</p>`
        : `<img src="${item.img}" class="img" />`
      }
            </button>
          </li>
        `
    );
  });
};

//정답 선택지 클릭
const answerClick = (el) => {
  $(".answer-list_btn").attr("disabled", true);
  console.log($(el)[0].innerText);
  const answer = el.data("answer");
  console.log(answer);
  if (GAME.examData[score].answer.includes("" + answer)) {
    //정답-----------
    GAME.soundPlay(audioAnswer);
    el.addClass("active");
    setTimeout(() => {
      el.removeClass("active");
      $(".answer-list_btn").attr("disabled", false);
      score = score + 1;
      if (score < GAME.examData.length) {
        $("#pageCnt").html(score + 1);
        $(".osign").fadeIn(300);
        setTimeout(() => {
          $(".osign").fadeOut(300);
        }, [600]);
        $(".transparentWall").show();
        setTimeout(() => {
          $(".transparentWall").hide();
        }, [2000]);
        //퀴즈 보기 불러오기 , 인터랙션
        setTimeout(() => {
          $(".game_car_screen").fadeOut(200, () => {
            quizRender();
            setTimeout(() => {
              $(".game_car_screen").fadeIn(200);
              $(".game_car_screen").css("display", "flex");
            }, [600]);
          });
        }, [1400]);
        //문제 리스트 , 인터랙션
        setTimeout(() => {
          $(".answer-list_item").removeClass("motion");
          $(".answer-list_item").addClass("motion-down");
          setTimeout(() => {
            answerListRander();
            setTimeout(() => {
              $(".answer-list_item").removeClass("motion-down");
              $(".answer-list_item").addClass("motion");
            }, [400]);
          }, [800]);
        }, [1200]);
      } else {
        try {
          callFinish();
        } catch (e) { }
        audioBG.seek(0);
        audioBG.pause();
        clearInterval(countDown);
        GAME.soundPlay(audioComplete);
        $("#complete_popup").fadeIn(200);
      }
    }, [400]);
  } else {
    //오답-----------
    el.addClass("wrong");
    $(".game_wrong").fadeIn(300);
    $(".game_wrong").addClass("motion");
    GAME.soundPlay(audioAnswerWro);
    setTimeout(() => {
      $(".game_wrong").fadeOut(300);
      setTimeout(() => {
        $(".game_wrong").removeClass("motion");
      }, [350]);
    }, [3000]);
    setTimeout(() => {
      el.removeClass("wrong");
      $(".answer-list_btn").attr("disabled", false);
    }, [3300]);
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
