// 배경음
const audioBG = new Howl({
  src: ["../../../COMM/SOUND/GAME/BG_MART.MP3"],
  volume: 0.8,
  autoplay: false,
  loop: true,
});
//버튼 클릭 음
const audioButton = new Audio("../../../COMM/SOUND/GAME/BUTTON.MP3");
//휙 소리
const audioWind = new Audio("../../../COMM/SOUND/GAME/WIND.MP3");
//캐릭 걷는 사운드
const audioWalk = new Audio("../../../COMM/SOUND/GAME/WALK.MP3");
//정답 소리
const audioAnswer = new Audio("../../../COMM/SOUND/GAME/ANSWER.MP3");
//정답 틀림
const audioAnswerWro = new Audio("../../../COMM/SOUND/GAME/ANSWERWRO.MP3");
//완료
const audioComplete = new Audio("../../../COMM/SOUND/GAME/COMPLETE.MP3");

let jsonData = [
  {
    id: "0",
    epilogue: "",
    exam: [
      {
        txt: "일의 자리 숫자가 4인 숫자인 수를 찾아보세요.",
        img: "",
        val: "0",
      },
    ],
    view: [
      { img: "grape", txt: "412", val: "0" },
      { img: "apple", txt: "349", val: "1" },
      { img: "watermelon", txt: "704", val: "2" },
    ],
    answer: ["2"],
  },
  {
    id: "1",
    epilogue: "밑줄 친 숫자가 나타내는 값을 고르세요.",
    exam: [
      {
        txt: `1<U>6</U>7`,
        img: "",
        val: "1",
      },
    ],
    view: [
      { img: "grape", txt: "600", val: "0" },
      { img: "apple", txt: "60", val: "1" },
      { img: "watermelon", txt: "6", val: "2" },
    ],
    answer: ["1"],
  },
];

//정답 맞춘 갯수
let score = 0;

//준비학습(ready), 실력쏙쏙(skill) 여부
let mode = "ready";

// 첫번째 문제 풀이 여부
let firstDrag = false;

//시작시 실행
// window.addEventListener("load", function () {
$(document).ready(function () {
  try {
    if (pageId === "readyGame") {
      mode = "ready";
    } else {
      mode = "skill";
    }
  } catch (e) { }

  try {
    if (firstContents === "game") {
      $(".winPopup_btn").css("display", "flex");
      mode = "skill";
    } else {
      $(".winPopup_btn").css("display", "none");
      mode = "ready";
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
    $(".window-loading").remove();
  } catch (e) { }

  GAME.dataLoad(jsonData);
  $("#pageCnt").html(score + 1);
  $("#pageCntAll").html(GAME?.examData?.length);
});

// 게임 시작 버튼
$(document).on("click", ".game_intro_start", function () {
  audioBG.seek(0);
  audioBG.play();
  GAME.soundPlay(audioButton);
  gameStart();
  setTimeout(() => {
    if (!firstDrag) {
      $(".mart-guide").css("display", "block");
    }
  }, [10000]);
});

// 재시작 버튼
$(document).on("click", ".winPopup_restart", function () {
  audioBG.seek(0);
  audioBG.play();
  GAME.soundPlay(audioButton);
  reStart();
});

$(".mart-guide").on("click", () => {
  $(".mart-guide").css("display", "none");
});
$(".mart-guide").on("mouseup", () => {
  $(".mart-guide").css("display", "none");
});
$(".mart-guide").on("touchend", () => {
  $(".mart-guide").css("display", "none");
});

window.addEventListener("DOMContentLoaded", function () {
  winResize();
});
$(window).on("resize", function () {
  winResize();
});

//초기화
const martInit = () => {
  $(".view").empty();
  console.log($(".view"));
  $(".cart").removeClass("droppable");
};

let martTimer = null;
// window size resize 하는 함수.
function winResize() {
  clearTimeout(martTimer);
  martTimer = setTimeout(function () {
    let bodyHeight = document.body.clientHeight;
    let wrap = document.getElementById("wrap");
    let calHeight = bodyHeight * (2000 / 1200);
    wrap.style.zoom = calHeight / 2000;
  }, 300);
}

// 게임 시작하는 함수
const gameStart = () => {
  $(".page_num").css("display", "flex");
  // 인트로 페이드 아웃
  $(".game_intro").fadeOut(480);
  setTimeout(() => {
    //캐릭터 왼쪽에서 등장
    GAME.soundPlay(audioWalk);
    $(".character").addClass("motion");
    //발문 등장
    setTimeout(() => {
      appearExam();
      setTimeout(() => {
        viewRender();
        dregFn();
        dropppFn();
      }, [1200]);
    }, [1400]);
  }, [800]);
};

//재시작
const reStart = () => {
  score = 0;
  $("#pageCnt").html(score + 1);
  $("#pageCntAll").html(GAME.examData.length);
  $(".winPopup").fadeOut(480);
  GAME.dataLoad(jsonData);
  martInit();
  $(".quiz_paper").css("display", "none");
  $(".quiz_paper").addClass("falling");
  $(".character").removeClass("motion");
  gameStart();
  //카트 안 물건 fadeout 후 장바구니 비워짐
  $(".view_item_inner").fadeOut(0);
  $(".view_item").fadeOut(0);
  setTimeout(() => {
    $(".view_item_inner").remove();
  }, [480]);
};

// 다음 게임 시작
const gameNext = () => {
  martInit();
  viewRender();
  dregFn();
  dropppFn();
  $("#pageCnt").html(score + 1);
};

//문제 등장
const appearExam = () => {
  //발문 있을 시 fadein 하며 나타남, 없을시 fadeout
  setTimeout(() => {
    if (GAME.examData[score]?.epilogue) {
      $(".game_title").text(GAME.examData[score].epilogue);
    } else {
      $(".game_title").text("정답인 상품을 카트에 담아보자.");
    }
    $(".game_title").fadeIn(300);
  }, [1200]);
  //종이 떨어지는 모션 (첫문제일 시 안떨어짐)
  $(".quiz_paper").removeClass("print");
  if (score > 0) {
    $(".quiz_paper").addClass("falling");
  }
  //종이 출력되는 애니실행
  setTimeout(() => {
    $(".quiz_paper").css("display", "flex");
    GAME.soundPlay(audioWind);
    let textLength = GAME.examData[score].exam[0].txt
      .replace("<U>", "")
      .replace("</U>", "").length;
    $(".quiz").empty();
    if (GAME.examData[score].exam[0].img) {
      $(".quiz").append(`
      <div class="quiz_paper">
        <div class="quiz_paper_img ${GAME.examData[score].cSize ? "cSizeFig" : ""}">
          <img src="../../../COMM/IMG/MART/${GAME.examData[score].exam[0].img}" alt="" class="${GAME.examData[score].cSize ? "cSize" : ""}" />
        </div>
        <p>${GAME.examData[score].exam[0].txt}</p>
      </div>
    `);
      $(".quiz_paper").addClass("print");
    } else {
      $(".quiz").append(`
      <div class="quiz_paper ${textLength >= 10 ? "fontsmall" : ""}" style="${textLength >= 30 ? "font-size: 56px" : ""
        }">
        <p>${GAME.examData[score].exam[0].txt}</p>
      </div>
    `);
      $(".quiz_paper").addClass("print");
    }
  }, [1000]);
};
//뷰 랜더링
const viewRender = () => {
  let viewData = GAME.examData[score].view;
  $(".view").empty();
  $.each(viewData, function (index, item) {
    let textLen = item.txt.length;
    if (item.txt.substr(-3) === "PNG") {
      $(".view").append(`
      <li class="view_item ${item.img} ${item.val ? "" : "d-none"}">
        <div class="view_item_inner draggable ${item.img}" data-val="${item.val
        }">
          <img src="../../../COMM/IMG/MART/${item.txt}" alt=""/>
        </div>
          <img class="view_item_img" src="../../../COMM/IMG/MART/${item.txt
        }" alt=""/>
      </li>
    `);
    } else {
      $(".view").append(`
          <li class="view_item ${textLen > 4 ? "small" : ""} ${item.img} ${item.val ? "" : "d-none"} ${GAME.examData[score].sCize ? "cSize" : ""}">
            <div class="view_item_inner ${textLen > 4 ? "small" : ""} draggable ${item.img}" data-val="${item.val}">
              <p class="view_item_inner_text ${GAME.examData[score].cSize ? "cSize" : ""}">${item.txt}</p>
            </div>
            <p class="view_item_text">${item.txt}</p>
          </li>
        `);
    }
  });

  if ($('.view').find(".view_item.small").length > 0) {
    $('.view').find(".view_item:not(.small)").addClass('small');
  }

  // 애니메이션 딜레이
  setTimeout(() => {
    $.each($(".view_item"), function (index, item) {
      $(item).css("animation-delay", `${index * 3090}ms`);
    });
    $(".view_item").addClass("motion");
  }, [800]);
};

// 드래그 할 경우 함수
const dregFn = () => {
  $(".draggable")
    .draggable()
    .on("draggable:start", function (droppp, drag) {
      firstDrag = true;
      GAME.soundPlay(audioButton);
      $(".view_item").addClass("ani-stop");
      $(".draggable").removeClass("dragging active");

      drag.item.addClass("active");
      drag.item.parent().addClass("zIndex");
      
      $(this).addClass("dragging");
      $(".draggable:not(.dragging)").css("pointer-events", "").css("transform", "");
    })
    .on("draggable:stop", function (droppp, drag) {
      $(".view_item").removeClass("ani-stop");
      drag.item.removeClass("active");
      drag.item.parent().removeClass("zIndex");
      
      $(this).removeClass("dragging");
    });
};

//드롭 할 경우 함수
const dropppFn = () => {
  $(".droppable")
    .droppable()
    .on("droppable:drop", function (droppp, drag) {
      let dragAnswer = drag.item[0].dataset.val;
      let answer = GAME.examData[score].answer[0];
      // 정답체크
      //정답
      if (answer === dragAnswer) {
        answerCorrectly();
        drag.item.parent().hide();
      } else {
        wrongAnswer();
        return false;
      }
    });
};

//정답 맞춘 경우
const answerCorrectly = () => {
  //정답 소리
  GAME.soundPlay(audioAnswer);
  $(".warp").addClass("pointerNone");
  setTimeout(() => {
    $(".view_item").addClass("ani-stop");
  }, [200]);
  //정답 O 사인 출력
  $(".osign").fadeIn(300);
  setTimeout(() => {
    $(".osign").fadeOut(300);
    setTimeout(() => {
      $(".game_title").fadeOut(480);
    }, [1000]);
  }, [1000]);
  $(".transparentWall").show();
  setTimeout(() => {
    $(".transparentWall").hide();
  }, [3200]);
  //스코어 +1 후 다음 인터랙션
  score = score + 1;
  // 마지막 문제가 아닐 경우
  if (score < GAME.examData.length) {
    setTimeout(() => {
      appearExam();
      setTimeout(() => {
        $(".warp").removeClass("pointerNone");
        gameNext();
      }, [3200]);
    }, [2400]);
    //카트 안 물건 fadeout 후 장바구니 비워짐
    setTimeout(() => {
      $(".view_item_inner").fadeOut(480);
      $(".view_item").fadeOut(480);
      setTimeout(() => {
        $(".view_item_inner").remove();
      }, [480]);
      $(".warp").removeClass("pointerNone");
    }, [2300]);
    // 마지막 문제일경우
  } else {
    try {
      callFinish();
    } catch (e) { }
    //앤딩 팝업창
    $(".view_item").addClass("ani-stop");
    $(".warp").removeClass("pointerNone");
    GAME.soundPlay(audioComplete);
    setTimeout(() => {
      audioBG.seek(0);
      audioBG.pause();
      switch (mode) {
        case "ready":
          $(".winPopup.ready").fadeIn(480);
          break;
        case "skill":
          $(".winPopup.skill").fadeIn(480);
          break;
        default:
          $(".winPopup.ready").fadeIn(480);
      }
    }, [1400]);
  }
};

//답 틀린 경우
const wrongAnswer = () => {
  GAME.soundPlay(audioAnswerWro);
  $(".wrong").fadeIn(300);
  $(".warp").addClass("pointerNone");
  setTimeout(() => {
    $(".wrong").fadeOut(300);
    setTimeout(() => {
      $(".warp").removeClass("pointerNone");
    }, [200]);
  }, [1000]);
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
