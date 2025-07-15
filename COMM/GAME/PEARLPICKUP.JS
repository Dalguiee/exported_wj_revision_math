//배경음
const audioBG = new Howl({
  src: ["../../../COMM/SOUND/GAME/BG_PEARLPICKUP.MP3"],
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

const IMG_ROOT = "../../../COMM/IMG/PEARLPICKUP";
const jsonData = [
  {
    epilogue: "2보다 1만큼 더 큰 수",
    view: [
      { img: "", txt: "1" },
      { img: "", txt: "2" },
      { img: "", txt: "3" },
      { img: "", txt: "4" },
    ],
    answer: ["1"],
  },
  {
    epilogue: "10보다 1만큼 더 큰 수",
    view: [
      { img: "", txt: "1" },
      { img: "", txt: "2" },
      { img: "", txt: "3" },
      { img: "", txt: "4" },
    ],
    answer: ["1"],
  },
];

$(".pearl-guide").on("click", () => {
  $(".pearl-guide").css("display", "none");
});
$(".pearl-guide").on("mouseup", () => {
  $(".pearl-guide").css("display", "none");
});
$(".pearl-guide").on("touchend", () => {
  $(".pearl-guide").css("display", "none");
});

// 문항 현재 숫자
let questionNum = 1;
// 현재 문항
let questionCurExam = null;
// 현재 잡은 target
let targetPearl = null;
// 현재 잡은 target 복사본
let targetPearlClone = null;

// window.addEventListener("load", function () {
$(document).ready(function () {
  console.log("진주줍줍 GAME");

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

  try {
    winResize();
  } catch (e) {
    console.warn("winResize is not defined");
  }

  try {
    $(".window-loading").remove();
  } catch (e) { }
  GAME.dataLoad(jsonData);
  dataSettings();
});

function bgStart() {
  audioBG.seek(0);
  audioBG.play();
}

// 데이터 셋팅
function dataSettings() {
  // 문항 현재 숫자
  questionNum = 1;
  // 문항 셋팅
  questionCurExam = GAME.examData[questionNum - 1];
  // 발문
  $(".submarine_epilogue span").html(questionCurExam.epilogue);
  // 문항 현재 수
  $("#pageCnt").html(questionNum);
  // 문항 전체 수
  $("#pageCntAll").html(GAME.examData.length);
}

// 데이터 다음 문항
function dataNext() {
  questionNum++;
  questionCurExam = GAME.examData[questionNum - 1];
  // 문항 현재 수
  $("#pageCnt").html(questionNum);
  $(".submarine_epilogue span").html(questionCurExam.epilogue);
}

// 데이터 마지막 문항 체크
function completeCheck() {
  if (questionNum == GAME.examData.length) {
    try {
      callFinish();
    } catch (e) { }
    audioBG.pause();
    $("#complete_popup").fadeIn(300);
    GAME.soundPlay(audioComplete);
    return true;
  } else {
    return false;
  }
}

// 게임시작
function gameStart() {
  $(".page_num").css("display", "flex");
  setTimeout(() => {
    if (questionNum === 1) $(".pearl-guide").css("display", "flex");
  }, [1500]);
  GAME.soundPlay(audioButton);
  console.log("게임시작");
  targetPearl = null;
  targetPearlClone = null;
  GAME.onView($(".intro"), false);
  GAME.onView($(".theme"), true);
  GAME.onView($(".popup"), false);
  $(".fish_area").html("");
  $(".pearl").remove();
  $(".hold_start").animate(
    {
      bottom: "100px",
    },
    1500
  );
  $(".submarine")
    .animate(
      {
        top: "140px",
      },
      1500
    )
    .animate(
      {
        top: "60px",
      },
      500,
      () => {
        pearlCreate();
      }
    );
}

// 게임재시작
function gameReStart() {
  bgStart();
  $("#complete_popup").fadeOut(300);
  let gameData = GAME.dataLoad();
  if (gameData) GAME.examData = gameData;
  dataSettings();
  gameStart();
}

// 게임영상보기
function gamePlayViewer() { }

// 진주 생성
function pearlCreate() {
  let initFontSize = 120;
  let minFontSize = initFontSize;

  $.each(questionCurExam.view, function (idx) {
    let that = this;
    let pearlObj = document.createElement("div");

    let txtLength = that.txt.length;
    let fontSize = initFontSize;
    if (txtLength > 5) {
      fontSize = 70;
    } else if (txtLength > 2) {
      fontSize = 90;
    }

    if (minFontSize > fontSize) {
      minFontSize = fontSize;
      $('.pearl span').css('font-size', minFontSize + 'px');
    }

    console.log("minFontSize : ", minFontSize);
    console.log("fontSize : ", fontSize);

    $(pearlObj).addClass("pearl action");
    $(pearlObj).attr({
      style: `animation-delay: ${(14 / questionCurExam.view.length) * idx}s;`,
    });
    $(pearlObj).attr("value", that.txt);
    $(pearlObj).html(`
      <div class="pearl_bg"></div>
      <span class="${questionCurExam.tSize ? "tSize" : ""}" style="${that.img ? "opacity: 0" : "font-size: " + minFontSize + "px;"} ">${that.txt}</span>
      ${that.img ? `<img class="${questionCurExam.cSize ? "cSize" : ""}" src="../../../COMM/IMG/PEARLPICKUP/${that.img}" />` : ""}
    `);
    $(".fish_area").append(pearlObj);
  });
}

// 중간 애니메이션 멈추기
function aniStop(bool) {
  if (bool) {
    // $(".game_bg").addClass("ani-pause");
    $(".pearl").addClass("ani-pause");
  } else {
    // $(".game_bg").removeClass("ani-pause");
    $(".pearl").removeClass("ani-pause");
  }
}

// 진주 잡기
function catching() {
  GAME.soundPlay(audioButton);
  if ($(".crab_line").hasClass("action")) return;
  console.log("catching");
  if (!targetPearl) {
    $(".crab_line").addClass("action");

    let crashCheck = setInterval(() => {
      $.each($(".pearl"), (idx, pearl) => {
        // 충돌 체크
        let collisionBool = isColliding($(".crab_head")[0], pearl);
        if (collisionBool) {
          targetPearl = pearl;
          targetPearlClone = pearl.cloneNode(true);
          $(targetPearlClone).removeClass("action");
          $(targetPearlClone).css({
            top: "auto",
            right: "auto",
            bottom: "-395px",
            left: "-195px",
            "animation-delay": "0s",
          });
          $(pearl).css("opacity", 0);
          aniStop(true);
          $(".crab_line")[0].append(targetPearlClone);
          answerCheck($(targetPearlClone).attr("value"));
          clearInterval(crashCheck);
          return false;
        }
      });
    }, 100);

    $(".crab_line").bind("animationend", () => {
      $(".crab_line").removeClass("action");
      clearInterval(crashCheck);
    });
  }
}

// 정답 체크 반환
function answerCheck(_answer) {
  if (questionCurExam.answer.includes(_answer)) {
    GAME.soundPlay(audioAnswer);
    setTimeout(() => {
      GAME.soundPlay(audioWind);
    }, [2000]);
    console.log("정답 유무 : true");
    GAME.onView($(".popup"), true);
    setTimeout(() => {
      GAME.onView($(".popup"), false);
      // 완료 시 체크
      let completeRes = completeCheck();
      if (completeRes) return;

      $(".submarine_epilogue span").animate(
        {
          top: -250,
        },
        1000,
        () => {
          dataNext();
          $(".submarine_epilogue span").css("top", "250px");
        }
      );

      $(".submarine_epilogue span").animate(
        {
          top: 0,
        },
        1000
      );
      $(".pearl").fadeOut(2000);
      setTimeout(() => {
        gameStart();
      }, 2000);
    }, 2000);
    return true;
  } else {
    // 정답 false
    setTimeout(() => {
      GAME.soundPlay(audioAnswerWro);
      $(targetPearlClone)
        .children(".pearl_bg")
        .css(
          "background",
          `center/contain no-repeat
      url("${IMG_ROOT}/PEARL_BG_FAIL.PNG")`
        );
      $(targetPearlClone).addClass("shaking");
      setTimeout(() => {
        $(targetPearlClone).fadeOut(1000, () => {
          $(targetPearl).css("opacity", 1);
          aniStop(false);
          targetPearl = null;
        });
      }, 1000);
    }, 800);

    return false;
  }
}

// 충돌 체크
function isColliding(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  const horiCollision = rect1.left < rect2.right && rect1.right > rect2.left;
  const vertiCollision = rect1.top < rect2.bottom && rect1.bottom > rect2.top;

  return horiCollision && vertiCollision;
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
