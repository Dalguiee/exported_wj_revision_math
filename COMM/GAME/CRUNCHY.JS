// 배경음
const audioBG = new Howl({
  src: ["../../../COMM/SOUND/GAME/BG_CRUNCHY.MP3"],
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

$(".pearl-guide").on("click", () => {
  $(".pearl-guide").css("display", "none");
});
$(".pearl-guide").on("mouseup", () => {
  $(".pearl-guide").css("display", "none");
});
$(".pearl-guide").on("touchend", () => {
  $(".pearl-guide").css("display", "none");
});

const IMGROOT = "../../../COMM/IMG/CRUNCHY";
let jsonData = [
  {
    epilogue: "376+45= ?",
    view: [
      { img: "", txt: "12", val: "12" },
      { img: "", txt: "220", val: "220" },
      { img: "", txt: "24", val: "24" },
      { img: "", txt: "50", val: "50" },
    ],
    answer: ["12"],
  },
  // {
  //   epilogue: "123+456= ?",
  //   view: [
  //     { img: "", txt: "12", val: "12" },
  //     { img: "", txt: "220", val: "220" },
  //     { img: "", txt: "50", val: "50" },
  //     { img: "", txt: "24", val: "24" },
  //   ],
  //   answer: ["12"],
  // },
];

let questionNum = 1; // 문항 숫자
let fireTarget = null; // virus target
let answerBool = false; // 정답유무
let ifRetray = false; //재시작 여부

let guideState = true; //가이드 실행 여부

$(document).ready(() => {
  // window.addEventListener("load", function () {
  console.log("뽀득뽀득 GAME");
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
  uiSetting();
  GAME.onView($("#popup1"), true);
});

// ui 셋팅
function uiSetting() {
  $("#question").html(GAME.examData[questionNum - 1].epilogue);
  $("#pageCnt").html(questionNum);
  $("#pageCntAll").html(GAME.examData.length);
}

// 게임시작
function gameStart() {
  audioBG.seek(0);
  audioBG.play();
  //가이드 뜸
  setTimeout(() => {
    if (guideState) {
      $(".pearl-guide").css("display", "flex");
      guideState = false;
    }
  }, [4600]);
  $(".page_num").css("display", "flex");
  GAME.soundPlay(audioButton);
  setTimeout(() => {
    GAME.soundPlay(audioWind);
    questionStartAni();
  }, [1200]);
  GAME.onView($("#popup1"), false);
  GAME.onView($(".virusArea"), true);
  GAME.onView($(".content"), true);
  // GAME.onView($(".epilogue"), true);
  ifRetray = true;
}

// 다음게임
function gameNext() {
  $(".virusArea").fadeOut(1000, () => {
    if (questionNum == GAME.examData.length) {
      try {
        callFinish();
      } catch (e) {}
      audioBG.pause();
      GAME.onView($("#complete_popup"), true);
      GAME.soundPlay(audioComplete);
    } else {
      questionNum++;
      $(".virus").remove();
      uiSetting();
      virusCreate();
    }
  });
}

function epilogueText() {
  if (GAME.examData[questionNum - 1].exam) {
    $(".epilogue p").html(GAME.examData[questionNum - 1].exam);
  } else {
    $(".epilogue p").html("정답을 들고 있는 균을 없애봐요!");
  }
}

// 게임 재시작
function gameRetry() {
  console.log("gameRetry");
  // GAME.onView($(".epilogue"), false);
  GAME.onView($("#complete_popup"), false);
  $(".hand").css("top", "-1500px");
  $(".virus").remove();
  questionNum = 1;
  fireTarget = null;
  answerBool = false;
  setTimeout(() => {
    GAME.dataLoad(jsonData);
    uiSetting();
    gameStart();
  }, 1000);
  $(".epilogue").hide();
}

// 문제 애니메이션 start
function questionStartAni() {
  $(".hand").animate(
    {
      top: "0",
    },
    1000,
    "swing"
  );
  if (ifRetray) {
    setTimeout(() => {
      $(".question").fadeIn(1500, () => {
        GAME.onView($(".question"), true);
        virusCreate();
      });
    }, [1200]);
  } else {
    $(".question").fadeIn(1500, () => {
      GAME.onView($(".question"), true);
      virusCreate();
    });
  }
}

// 바이러스 생성
function virusCreate() {
  // 에필로그 생성
  epilogueText();
  $(".epilogue").fadeIn(1000);
  //------
  let virusSelection = GAME.examData[questionNum - 1].view;
  $.each(virusSelection, (idx, view) => {
    let virus = new Virus(view.txt, view.img);
    $(".virusArea").append(virus.obj);
  });
}

// 조준
function fireHeadAim() {
  setTimeout(() => {
    GAME.soundPlay(audioButton);
  }, [1000]);
  GAME.onView($("#touchBlock"), true);

  let target = $(fireTarget.obj);
  let targetOffset = target.offset();
  let targetCenterX = targetOffset.left + target.width() / 2;
  let targetCenterY = targetOffset.top + target.height() / 2;
  let fireHead = $(".fire_head");
  let fireHeadOffset = fireHead.offset();
  let fireHeadCenterX = fireHeadOffset.left + fireHead.width() / 2;
  let fireHeadCenterY = fireHeadOffset.top + fireHead.height() / 2;

  var angle = Math.atan2(
    targetCenterY - fireHeadCenterY,
    targetCenterX - fireHeadCenterX
  );
  angle = angle * (180 / Math.PI) + 90;
  let currentAngle = 0;
  let finalAngle = angle - currentAngle;
  if (-10 < finalAngle && finalAngle < 10) {
    finalAngle = 0;
  }
  waterInitPos();

  $(".fire_head").animate(
    {
      rotate: `${finalAngle}deg`,
    },
    500,
    () => {
      pumpAni();
    }
  );

  // water Position Init
  function waterInitPos() {
    let water = $(".fire_water");
    GAME.onView(water, false);
    water.addClass("hide");
    water.css("top", "");
    water.css("bottom", "0px");
    water.css("left", `50%`);
    GAME.onView($(".fire_water-boom"), false);
    GAME.onView($(".fire_water-obj"), true);
  }
}

// 펌프 애니메이션
function pumpAni() {
  $(".fire").animate(
    {
      bottom: "-70px",
    },
    500,
    () => {
      $(".fire").animate(
        {
          bottom: "0px",
        },
        500,
        () => {
          waterFire();
        }
      );
    }
  );
}

// 펌프 발사
function waterFire() {
  let water = $(".fire_water");
  let virus = $(fireTarget.obj);
  let target = $(fireTarget.targetObj);

  let targetOffset = target.position();
  let targetCenterX = targetOffset.left - water.width() / 2;
  let targetCenterY = targetOffset.top - water.height() / 2;
  console.log('virus_width', virus.width());  
  console.log('virus_height', virus.height());
  console.log('target ::: ', target);
  console.log(targetOffset);

  console.log(targetCenterX, targetCenterY);

  water.addClass("show");
  $(".fire_water").animate(
    {
      top: `${targetCenterY}px`,
      left: `${targetCenterX}px`,
    },
    400,
    () => {
      GAME.onView($(".fire_water-obj"), false);
      GAME.onView($(".fire_water-boom"), true);
      waterBombAni();
    }
  );
}

// 펌프 터지는 애니메이션
function waterBombAni() {
  let check = answerCheck();
  if (check) {
    $(".fire_water-boom").animate(
      {
        scale: 8,
      },
      1000,
      () => {
        $(".fire_water-boom").css("scale", "0.5");
        GAME.onView($(".fire_water-boom"), false);
        if (answerBool) {
          GAME.onView($("#popup2"), true);
          setTimeout(() => {
            GAME.onView($("#popup2"), false);
            GAME.onView($("#touchBlock"), false);
            gameNext();
          }, 2000);
        }
      }
    );
  } else {
    GAME.onView($(".fire_water-boom"), false);
    GAME.onView($(".fire_water-obj"), true);
    $(".fire_water-obj").css(
      "background",
      `center/contain no-repeat url("${IMGROOT}/WATER_CRY.PNG")`
    );
    $(".fire").addClass("shaking");
    $(".fire_pad").css(
      "background",
      `center/contain no-repeat url("${IMGROOT}/FIREPADRED.PNG")`
    );
    $(".fire_water").animate(
      {
        top: "+=200",
        opacity: 0,
      },
      1000,
      () => {
        GAME.onView($(".fire_water"), false);
        $(".fire_water").css("opacity", 1);
        setTimeout(() => {
          $(".fire").removeClass("shaking");
          $(".fire_pad").css(
            "background",
            `center/contain no-repeat url("${IMGROOT}/FIREPAD.PNG")`
          );
          fireTarget.bgChange(fireTarget.defaultBg);
          GAME.onView($("#touchBlock"), false);
        }, 1000);
      }
    );
  }
}

// 정답 체크
function answerCheck() {
  if (GAME.examData[questionNum - 1].answer.includes(fireTarget.value)) {
    GAME.soundPlay(audioAnswer);
    answerBool = true;
    fireTarget.bgChange(fireTarget.cryBg);
    $(fireTarget.obj)
      .stop(true, true)
      .fadeOut(2000, () => {
        $(fireTarget.obj).css("display", "flex");
        $(fireTarget.obj).css("opacity", "0");
      });
    return answerBool;
  } else {
    GAME.soundPlay(audioAnswerWro);
    answerBool = false;
    fireTarget.bgChange(fireTarget.smileBg);
    return answerBool;
  }
}

// 바이러스 class
class Virus {
  constructor(_value, _img) {
    this.obj = document.createElement("div");
    this.btnObj = document.createElement("button");
    this.targetObj = document.createElement("div");
    this.defaultBg = `${IMGROOT}/VIRUS.PNG`;
    this.cryBg = `${IMGROOT}/VIRUS_CRY.PNG`;
    this.smileBg = `${IMGROOT}/VIRUS_SMILE.PNG`;
    this.value = _value;
    this.img = _img;
    this.init();
    this.aniRotation();
    // this.aniScale();
    // this.aniTop();
  }
  // 초기화
  init() {
    $(this.obj).append(this.btnObj);
    $(this.obj).append(this.targetObj);
    $(this.obj).addClass("virus");
    $(this.btnObj).addClass("virus_btn");
    $(this.targetObj).addClass("virus_target");
    this.btnObj.onclick = () => {
      this.onTouch();
    };
    if (this.img) {
      this.btnObj.innerHTML = `
        <div class="img">
          <img src="${IMGROOT}/${this.img}" alt="${this.value}"/>
        </div>
      `;
    } else {
      this.btnObj.innerHTML = `<p>${this.value}</p>`;
    }
    this.bgChange(this.defaultBg);
    $(this.btnObj).animate({ opacity: "1" }, 500);
  }
  bgChange(bgName) {
    $(this.btnObj).css("background", `center/contain no-repeat url("${bgName}")`);
  }
  // object touch
  onTouch() {
    fireTarget = this;
    fireHeadAim();
  }
  onCrush() {}
  // animation randomTime
  randomTime() {
    let ranTime = Math.floor(Math.random() * 2500 + 1000);
    return ranTime;
  }
  // animation rotation
  aniRotation() {
    let ranDegree = Math.floor(Math.random() * 91) - 45; // -45 ~ 45
    $(this.btnObj).animate(
      {
        rotate: `${ranDegree}deg`,
      },
      this.randomTime(),
      () => {
        this.aniRotation();
      }
    );
  }
  // animation scale
  aniScale() {
    let ranScale = Math.random() * 0.6 + 0.7; // 0.7 ~ 1.3
    $(this.btnObj).animate(
      {
        scale: ranScale,
      },
      this.randomTime(),
      () => {
        this.aniScale();
      }
    );
  }
  // animation top
  aniTop() {
    let ranTop = Math.floor(Math.random() * 300); // 0 ~ 300
    $(this.btnObj).animate(
      {
        top: ranTop,
      },
      this.randomTime(),
      () => {
        this.aniTop();
      }
    );
  }
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
