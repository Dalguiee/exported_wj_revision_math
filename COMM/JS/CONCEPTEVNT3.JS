// 스텝별 타임 관련 함수
let timerStart = 0;
let timerRemain = 0;
let timerCallback;
let timer;

function timerInit() {
  timerStart = 0;
  timerRemain = 0;
  timerCallback = "";
}

function timerSet(timerSetCallback, delay) {
  timerStart = Date.now();
  timerRemain = delay;
  timerCallback = timerSetCallback;

  timer = setTimeout(timerCallback, timerRemain);
}

function timerSetPause() {
  clearTimeout(timer);
  timerRemain -= Date.now() - timerStart;
}

function timerResume() {
  clearTimeout(timer);
  timerSet(timerCallback, timerRemain);
}

// 오디오 관련 변수
let audio = new Audio();
let audioNow = 0;
let audioList;
let audioCallback;
let audioCallbackData;
let audioPlayingFlag = false;
let audioSetFlag = false;

let titSound = new Audio();
let titSoundPlayingFlag = false;

let effectSound = new Audio();
let effectSoundPlayingFlag = false;

const audioSetChange = (newAudio) => {
  audio.src = newAudio;
};

const audioSetPause = () => {
  audio.pause();
};

const audioSetPlay = () => {
  audio.play();
};

// 오디오 재생 상태 초기화
const audioSetInit = () => {
  audio.pause();
  audioNow = 0;
  audio.onended = "";
  audio.onplay = "";
  audio.src = "";
  audioList = "";
  audioPlayingFlag = false;
};

function audioSetPlaying() {
  audioPlayingFlag = true;

  audio.src = audioList[audioNow];
  audio.play();
  audioNow++;

  // audio.onplay = function () {
  audio.onloadeddata = function () {
    // callback type start 처리
    if (audioCallbackData.length > 0) {
      for (let i = 0; i < audioCallbackData.length; i++) {
        if (audioCallbackData[i].idx == audioNow) {
          if (audioCallbackData[i].callback) {
            audioCallback = audioCallbackData[i].callback;

            if (audioCallbackData[i].type == "start") audioCallback();
          }
        }
      }
    }
  };

  audio.onended = function () {
    // callback type end 처리
    if (audioCallbackData.length > 0) {
      for (let i = 0; i < audioCallbackData.length; i++) {
        if (audioCallbackData[i].idx == audioNow) {
          if (audioCallbackData[i].callback) {
            audioCallback = audioCallbackData[i].callback;
            if (audioCallbackData[i].type == "end") audioCallback();
          }
        }
      }
    }

    if (audioNow < audioList.length) {
      audioSetPlaying();
    } else {
      audioSetInit();
    }
  };
}

// 오디오 재생 리스트 세팅
function audioSet(audList, audCallback = "") {
  if (!audioSetFlag) {
    // 짧은 시간에 중복 이벤트 방지
    audioSetFlag = true;

    audioSetInit();

    setTimeout(() => {
      audioList = audList;
      audioCallbackData = audCallback;

      audioSetFlag = false;

      if (!titSoundPlayingFlag && !effectSoundPlayingFlag) {
        audioSetPlaying();
      }
    }, [100]);
  }
}

// 스텝 진행 일시정지
function stepSetPause() {
  // 오디오 일시정지
  audioSetPause();

  // 오디오 재생 중일 경우, 타임 스크립트 일시정지
  if (audioPlayingFlag === true && timerRemain > 0) timerSetPause();
}

// 스텝 재진행
function stepSetResume() {
  // 오디오 다시 재생
  if (audioPlayingFlag === true) {
    audioSetPlay();
  } else {
    if (audioNow < audioList.length) {
      audioSetPlaying();
    }
  }

  // 오디오 재생 중일 경우, 타임 스크립트 다시 실행
  if (audioPlayingFlag === true && timerRemain > 0) timerResume();
}

// 페이지 진행 일시정지
function pageSetPause() {
  if (effectSoundPlayingFlag === true) {
    effectSound.pause();
  } else if (titSoundPlayingFlag === true) {
    titSound.pause();
  } else {
    stepSetPause();
  }
}

// 페이지 재진행
function pageSetResume() {
  if (effectSoundPlayingFlag === true) {
    effectSound.play();
  } else if (titSoundPlayingFlag === true) {
    titSound.play();
  } else {
    stepSetResume();
  }
}

// 이전 다음 버튼 클릭 시
function pageAudioReset() {
  if (titSoundPlayingFlag === true) {
    titSound.pause();
    titSoundPlayingFlag = false;
  }

  audioSetInit();

  effectAudioSet("pageChange");
}

//2024-12-11 음성 오류 픽스
function titleAudioSet(titSoundSrc) {
  if (!effectSoundPlayingFlag) {
    stepSetPause();
    effectSound.src = "../../../COMM/SOUND/CLICK2.MP3";
    effectSound.load();

    effectSound.addEventListener("canplaythrough", function onReady() {
      effectSound.play().catch((err) => {
        console.error("effectSound error:", err.message);
      });
      effectSound.removeEventListener("canplaythrough", onReady);
    });

    effectSound.onended = function () {
      titSound.src = titSoundSrc;
      titSound.load();

      titSound.addEventListener("canplaythrough", function onTitReady() {
        titSound.play().catch((err) => {
          console.error("titSound error:", err.message);
        });
        titSoundPlayingFlag = true;

        titSound.removeEventListener("canplaythrough", onTitReady);
      });

      titSound.onended = function () {
        titSoundPlayingFlag = false;
        stepSetResume();
      };
    };
  }
}

// titleAudioSet 함수 이전 버전
// function titleAudioSet(titSoundSrc) {
//   stepSetPause();

//   effectSound.src = "../../../COMM/SOUND/CLICK2.MP3";
//   effectSound.play();

//   effectSound.onended = function () {
//     titSound.src = titSoundSrc;
//     titSound.play();

//     titSoundPlayingFlag = true;

//     titSound.onended = function () {
//       titSoundPlayingFlag = false;
//       stepSetResume();
//     };
//   };
// }

function effectAudioSet(effectSoundType) {
  let effectSoundSrc = "";

  switch (effectSoundType) {
    case "pageChange":
      effectSoundSrc = "../../../COMM/SOUND/CHANGEPAGE3.MP3";
      break;
    case "click":
    case "quizSelect":
    case "quizKeypad":
    case "quizDragAndDrop":
      effectSoundSrc = "../../../COMM/SOUND/CLICK2.MP3";
      break;
    case "pageStart":
    case "effectStart":
      effectSoundSrc = "../../../COMM/SOUND/START.MP3";
      break;
    case "effect":
      effectSoundSrc = "../../../COMM/SOUND/EFFECT.MP3";
      break;
    case "wrong":
      effectSoundSrc = "../../../COMM/SOUND/WRONG.MP3";
      break;
    case "correct":
      effectSoundSrc = "../../../COMM/SOUND/CORRECT.MP3";
      break;
  }

  effectSound.src = effectSoundSrc;
  effectSound.play();
  effectSoundPlayingFlag = true;

  effectSound.onended = function () {
    effectSoundPlayingFlag = false;

    if (!titSoundPlayingFlag) {
      stepSetResume();
    }
  };
}

// bgm 재생
let audioBG = new Howl({
  src: ["../../../COMM/SOUND/CONCEPT_BGM.MP3"],
  volume: 0.7,
  autoplay: false,
  loop: true,
});

// 패드 OFF 시 Audio 일시정지
function onPause() {
  try {
    audioBG.pause();
    pageSetPause();
  } catch (e) {}
}

function bgmSoundStop() {
  try {
    audioBG.pause();
    pageSetPause();
  } catch (e) {}
}

// 패드 ON 시 Audio 다시 재생
function onResume() {
  try {
    audioBG.play();
    pageSetResume();
  } catch (e) {}
}

// 시작 버튼 클릭 시
function audioBtnStart() {
  effectAudioSet("pageStart");

  audioBG.seek(0);
  audioBG.play();
}

//페이지 set
const stepSet = () => {
  $(`.btn-next`).attr("disabled", true);
  $(".step").css("display", "none");
  $(".step")
    .eq(disStep - 1)
    .css("display", "block");
  headerSet();
  setFooter();
  setPageBtn();
  $(".main_prev-next .btn-next").removeClass("blinking");
};

//헤더 타이틀, 페이지SET
const headerSet = () => {
  let page = pageData[disStep - 1].headerPage;
  $(".header_title h3").html(pageData[disStep - 1].title);
  $(".header_page").html(`<span>${page[0]}</span>/${page[1]}`);

  if (pageData[disStep - 1].title) {
    $("#contents-main .header").css("visibility", "visible");
    $("#contents-main .step-list").css("visibility", "visible");
  } else {
    $("#contents-main .header").css("visibility", "hidden");
    $("#contents-main .step-list").css("visibility", "hidden");
  }
};

//푸터 페이지SET
const setFooter = () => {
  let page = pageData[disStep - 1].footerPage;
  $(".step-list").empty();
  for (let i = 1; i <= page[1]; i++) {
    $(".step-list").append(
      `<li class="step-list_item ${i === page[0] ? "active" : ""}"></li>`
    );
  }
};

//페이지버튼 hidden 여부
const setPageBtn = () => {
  let page = pageData[disStep - 1];
  if (page.prev) {
    $(".btn-prev").css("display", "block");
  } else {
    $(".btn-prev").css("display", "none");
  }
  if (page.next) {
    $(".btn-next").css("display", "block");
  } else {
    $(".btn-next").css("display", "none");
  }
};

//정답 맞춘 경우
const correctly = () => {
  $(".btn-next").attr("disabled", false);
  $(".btn-next").addClass("blinking");
};

// 키패드 관련 변수
let keypadInput = ""; // 키패드 입력 값

let keypadWrap = "key-pad-wrap"; // 키패드 전체 영역
let keypadWrapEl = "." + keypadWrap;
let keypad = "key-pad"; // 키패드
let keypadEl = "." + keypad;
let keypadDone = "key-pad-done"; // 키패드 입력 완료
let keypadDoneEl = "." + keypadDone;
let keypadOn = "key-pad-on"; // 키패드 활성화
let keypadOnEl = "." + keypadOn;

let keypadBtn = "key-pad_btn"; // 키패드 버튼
let keypadBtnEl = "." + keypadBtn;
let keypadBtnCheck = "key-pad_btn-check"; // 키패드 입력 완료 버튼
let keypadBtnCheckEl = "." + keypadBtnCheck;
let keypadBtnBack = "key-pad_btn-back"; // 키패드 뒤로 가기 버튼
let keypadBtnBackEl = "." + keypadBtnBack;
let keypadBtnClose = "key-pad_btn-close"; // 키패드 닫기 버튼
let keypadBtnCloseEl = "." + keypadBtnClose;

let keypadBtnTxt = "keypad_txt";
let keypadBtnTxtEl = "." + keypadBtnTxt;

// 키패드 초기화
const keypadSetClear = () => {
  /* 키패드 호출 2개 이상을 할 경우, 충돌 나지 않도록 click 이벤트 해제 처리*/
  $(document).off("click", keypadBtnCheckEl);
  keypadInput = "";

  if ($(keypadWrapEl).length > 0) $(keypadWrapEl).remove();
  if ($(keypadOnEl).length > 0)
    $(keypadOnEl).removeClass(keypadOn + " active " + keypadDone);
};

// 키패드 초기화 (리셋)
const keypadSetInit = () => {
  keypadSetClear();
  $(keypadBtnTxtEl)
    .removeClass(keypadDone + " disabled")
    .off("click")
    .html("?");
};

// 키패드 닫기 - 정답 체크 X, 키패드 재선택 (0605)
const keypadClose = () => {
  if ($(keypadOnEl).length > 0) {
    $(keypadOnEl).addClass("blink");
    keypadSetClear();
  }
};

// 키패드 켜기
const keypadSetOn = (btn, right = 14, bottom = 14) => {
  if (!btn.hasClass(keypadDone) && !btn.hasClass("disabled")) {
    keypadSetClear();
    keypadInput = btn.text().replace(/[^0-9]/g, "");

    // 키패드 초기화 실행을 위해 약간의 delay 추가
    setTimeout(() => {
      let keypadHTML = '<div class="' + keypadWrap + '">';
      keypadHTML +=
        '<div class="' +
        keypad +
        '" style="right:' +
        `${right}` +
        "px; bottom:" +
        `${bottom}` +
        'px;">';
      keypadHTML += '<button class="' + keypadBtn + '">1</button>';
      keypadHTML += '<button class="' + keypadBtn + '">2</button>';
      keypadHTML += '<button class="' + keypadBtn + '">3</button>';
      keypadHTML += '<button class="' + keypadBtn + '">4</button>';
      keypadHTML += '<button class="' + keypadBtn + '">5</button>';
      keypadHTML += '<button class="' + keypadBtnBack + '"></button>';
      keypadHTML += '<button class="' + keypadBtn + '">6</button>';
      keypadHTML += '<button class="' + keypadBtn + '">7</button>';
      keypadHTML += '<button class="' + keypadBtn + '">8</button>';
      keypadHTML += '<button class="' + keypadBtn + '">9</button>';
      keypadHTML += '<button class="' + keypadBtn + '">0</button>';
      keypadHTML += '<button class="' + keypadBtnCheck + '"></button>';
      keypadHTML += '<button class="' + keypadBtnClose + '"></button>';
      keypadHTML += "</div>"; // keypad
      keypadHTML += "</div>"; // keypadWrap

      $(".main_content").append(keypadHTML);

      btn.addClass(keypadOn + " active");
      effectAudioSet("click");
    }, [100]);
  }
};

// 키패드 정답
const keypadSetCorrect = (btn) => {
  btn.addClass(keypadDone).off("click");
  keypadSetOff(btn, true);
  keypadInput = "";
};

// 키패드 끄기 / keypadCorrectFlag - 오답 체크용
const keypadSetOff = (btn, keypadCorrectFlag = false) => {
  /* 키패드 호출 2개 이상을 할 경우, 충돌 나지 않도록 click 이벤트 해제 처리*/
  $(document).off("click", keypadBtnCheckEl);

  btn.removeClass(keypadOn + " active").addClass(" disabled");
  $(keypadWrapEl).remove();

  effectAudioSet("quizKeypad");

  // 오답인 경우 1초 후 빈칸 입력값 초기화
  if (!keypadCorrectFlag) {
    setTimeout(() => {
      btn.html("?").removeClass(" disabled");
    }, 1000);
  }
};

//키패드 숫자 버튼
$(document).on("click", keypadBtnEl, function (e) {
  e.stopPropagation();
  effectAudioSet("quizKeypad");

  let keypadLength = parseInt($(keypadOnEl).data("length"));

  // 2자리 수 이상 입력 키패드에 대응
  if (keypadLength > 1) {
    let keypadNowTxt = $(keypadOnEl).text();

    if (keypadNowTxt == "?") {
      keypadInput = `${$(this).text()}`;
    } else if (keypadNowTxt.length < keypadLength) {
      keypadInput = keypadNowTxt + `${$(this).text()}`;
    }
  } else {
    keypadInput = `${$(this).text()}`;
  }

  $(keypadOnEl).html(keypadInput);
});

//키패드 뒤로가기 버튼
$(document).on("click", keypadBtnBackEl, function (e) {
  e.stopPropagation();
  effectAudioSet("quizKeypad");

  $(keypadOnEl).html("?");
  keypadInput = "";
});

//키패드 닫기 버튼
$(document).on("click", keypadBtnCloseEl, function (e) {
  e.stopPropagation();
  keypadClose();
});

//키패드 이외의 영역 클릭 시
$(document).on("click", keypadWrapEl, function (e) {
  e.stopPropagation();
  $(keypadBtnCheckEl).click();
});

let dragStartFlag = false;
// 드래그 할 경우 함수
const dregFn = () => {
  $(".draggable")
    .draggable()
    .on("draggable:start", function (droppp, drag) {
      if (!dragStartFlag) {
        dragStartFlag = true;
        effectAudioSet("quizDragAndDrop");
      }

      $(".answer_list .touchMotion_hand").remove();

      $(".draggable").removeClass("dragging");
      $(this).addClass("dragging");
      $(".draggable:not(.dragging)")
        .css("pointer-events", "")
        .css("transform", "");
    })
    .on("draggable:stop", function (droppp, drag) {
      $(this).removeClass("dragging");
    });
};

//드롭 할 경우 함수
const dropppFn = () => {
  $(".droppable")
    .droppable({ disabled: false })
    .on("droppable:drop", function (droppp, drag) {
      let dragAnswer = drag.item[0].dataset.val;
      let answer = droppp.currentTarget.dataset.val;
      if (answer === dragAnswer) {
        $(droppp.currentTarget).find(".placeholder").css("display", "none");
      } else {
        return false;
      }
      drag.item.addClass("pointerNone");
    });
};

// 드래그 드롭 세팅
const quizDragDropSetOn = (dropEl, dropListEl, dropArr, correct, step) => {
  let callback = step ? step.dropppFn : dropppFn;
  quizDragDropSetOnNew(dropEl, dropListEl, dropArr, correct, callback);
  return;

  quizDragDropSetInit();

  setTimeout(() => {
    if (dropArr.length > 0) {
      let html = '<div class="answer_list">';
      for (let i = 0; i < dropArr.length; i++) {
        html +=
          '<div class="answer answer' +
          (i + 1) +
          ' draggable" data-val="' +
          (i + 1) +
          '">' +
          dropArr[i] +
          "</div>";
      }
      html += '<div class="touchMotion_hand"></div>';
      html += "</div>";

      dropListEl.html(html);
      dregFn();
    }

    quizDragAndDropGuide(dropListEl);

    dropEl
      .addClass("droppable")
      .attr("data-val", correct)
      .html('<div class="placeholder">?</div>');

    if (step) {
      step.dropppFn();
    } else {
      dropppFn();
    }
  }, 100);
};

// 드래그 드롭 정답일 경우
const quizDragDropSetCorrect = (correctEl, isHidden = false) => {
  $(".droppable").find(".placeholder").remove();
  $(".droppable")
    .droppable({ disabled: true })
    .off("droppable:drop")
    .removeClass("droppable");
  $(".draggable")
    .draggable({ disabled: true })
    .off("draggable:start")
    .off("draggable:stop")
    .removeClass("draggable")
    .addClass("disabled");

  if (isHidden) {
    $(".answer_list.active").remove();
  } else {
    $(".answer_list").removeClass("active");
  }
};

// 드래그 드롭 초기화
const quizDragDropSetInit = () => {
  dragStartFlag = false;
  $(".droppable")
    .droppable({ disabled: true })
    .off("droppable:drop")
    .removeClass("droppable");
  $(".draggable")
    .draggable({ disabled: true })
    .off("draggable:start")
    .off("draggable:stop")
    .removeClass("draggable disabled");
  $(".answer_list.active").remove();
};

// 5단원 사용 공통 ~
// 한 페이지에서 선택 문제 2개 이상 나올 경우를 위해 step이 아닌 callback을 넣도록 변경 (0411)
const quizDragDropSetOnNew = (
  dropEl,
  dropListEl,
  dropArr,
  correct,
  callback
) => {
  quizDragDropSetInit();

  setTimeout(() => {
    if (dropArr.length > 0) {
      let html = '<div class="answer_list active">';
      for (let i = 0; i < dropArr.length; i++) {
        html +=
          '<div class="answer answer' +
          (i + 1) +
          ' draggable" data-val="' +
          (i + 1) +
          '">' +
          dropArr[i] +
          "</div>";
      }
      html += '<div class="touchMotion_hand"></div>';
      html += "</div>";

      dropListEl.html(html);
      dregFn();
    }

    quizDragAndDropGuide(dropListEl);

    dropEl
      .addClass("droppable")
      .attr("data-val", correct)
      .html('<div class="placeholder">?</div>');

    if (callback) {
      callback();
    }
  }, 100);
};

// 멀티 드래그 드롭 세팅
const quizMultiDragDropSetOn = (dropList, dropListEl, dropArr, step) => {
  let callback = step ? step.dropppFn : dropppFn;
  quizMultiDragDropSetOnNew(dropList, dropListEl, dropArr, callback);
  return;

  quizDragDropSetInit();

  setTimeout(() => {
    if (dropArr.length > 0) {
      let html = '<div class="answer_list">';
      for (let i = 0; i < dropArr.length; i++) {
        html +=
          '<div class="answer answer' +
          (i + 1) +
          ' draggable" data-val="' +
          (i + 1) +
          '">' +
          dropArr[i] +
          "</div>";
      }
      html += '<div class="touchMotion_hand"></div>';
      html += "</div>";

      dropListEl.html(html);
      dregFn();
    }

    quizDragAndDropGuide(dropListEl);

    if (dropList.length > 0) {
      for (let i = 0; i < dropList.length; i++) {
        $(dropList[i].dropEl)
          .addClass("droppable")
          .attr("data-val", dropList[i].correct)
          .html('<div class="placeholder">?</div>');
      }
    }

    if (step) {
      step.dropppFn();
    } else {
      dropppFn();
    }
  }, 100);
};

// 멀티 드래그 드롭 정답일 경우
const quizMultiDragDropSetCorrect = (correctEl) => {
  $(correctEl).find(".placeholder").remove();
  $(correctEl)
    .droppable({ disabled: true })
    .off("droppable:drop")
    .removeClass("droppable");
};

// 멀티 드래그 드롭 정답 모두 맞춘 후
const quizMultiDragDropSetCorrectly = (isHidden = false) => {
  $(".draggable")
    .draggable({ disabled: true })
    .off("draggable:start")
    .off("draggable:stop")
    .removeClass("draggable")
    .addClass("disabled");

  if (isHidden) {
    $(".answer_list.active").remove();
  } else {
    $(".answer_list").removeClass("active");
  }
};

// 5단원 사용 공통 ~
// 한 페이지에서 선택 문제 2개 이상 나올 경우를 위해 step이 아닌 callback을 넣도록 변경 (0411)
const quizMultiDragDropSetOnNew = (dropList, dropListEl, dropArr, callback) => {
  quizDragDropSetInit();

  setTimeout(() => {
    if (dropArr.length > 0) {
      let html = '<div class="answer_list active">';
      for (let i = 0; i < dropArr.length; i++) {
        html +=
          '<div class="answer answer' +
          (i + 1) +
          ' draggable" data-val="' +
          (i + 1) +
          '">' +
          dropArr[i] +
          "</div>";
      }
      html += '<div class="touchMotion_hand"></div>';
      html += "</div>";

      dropListEl.html(html);
      dregFn();
    }

    quizDragAndDropGuide(dropListEl);

    if (dropList.length > 0) {
      for (let i = 0; i < dropList.length; i++) {
        $(dropList[i].dropEl)
          .addClass("droppable")
          .attr("data-val", dropList[i].correct)
          .html('<div class="placeholder">?</div>');
      }
    }

    if (callback) {
      callback();
    }
  }, 100);
};

const quizDragAndDropGuide = (dropListEl) => {
  setTimeout(() => {
    dropListEl
      .find(".answer_list .touchMotion_hand")
      .fadeOut("fast", function () {
        $(this).remove();
      });
  }, 2000);
};

// 선택형 문제
const quizSelectSetInit = (answerEl, answerArr) => {
  answerEl.find(".select_list").remove();
  $(".select_list").removeClass("active");

  if (answerArr.length > 0) {
    let html = '<div class="select_list active">';
    for (let i = 0; i < answerArr.length; i++) {
      html +=
        '<button type="button" class="answer answer' +
        (i + 1) +
        '" data-val="' +
        (i + 1) +
        '">' +
        answerArr[i] +
        "</button>";
    }
    html += "</div>";

    answerEl.html(html);
  }
};

// 3단원 사용 공통
const quizSelectSetOn = (correct, step) => {
  quizSelectSetOnNew(correct, step.quizSelectCorrect);
  return;

  $(".select_list .answer")
    .addClass("unselected")
    .click(function () {
      let $this = $(this);
      $(".select_list .answer").removeClass("unselected");
      $this.addClass("selected");

      // 중복 클릭 불가능하도록 disabled 처리
      $(".select_list .answer").attr("disabled", true);

      effectAudioSet("quizSelect");

      if ($this.data("val") == correct) {
        $this.siblings(".answer").addClass("disabled");
        $(".select_list .answer").off("click");

        step.quizSelectCorrect(true);
      } else {
        setTimeout(() => {
          $this.removeClass("selected");

          // 중복 클릭 불가능하도록 disabled 처리 1초 후 해제
          $(".select_list .answer").attr("disabled", false);
        }, 1000);
        step.quizSelectCorrect(false);
      }
    });
};

// 4단원 사용 공통 ~
// 한 페이지에서 선택 문제 2개 이상 나올 경우를 위해 step이 아닌 callback을 넣도록 변경 (0329)
// correct - quizSelectSetInit() 에서 설정하는 answerArr 배열의 정답 순서
// callback - 버튼 클릭 후 실행되는 callback 함수
// correctTextBox - 정답을 맞추고 났을 때 내용이 입력되어야 하는 element / (0404 추가)
// isHidden - 정답을 맞추고 난 후 버튼 리스트를 유지할 것인지 아닌지 (false - 유지, true - 유지안함(삭제)) / (0404 추가)
// slow - 오답시 selected가 조금 느리게 풀림
const quizSelectSetOnNew = (
  correct,
  callback,
  correctTextBox = "",
  isHidden = false,
  slow = false
) => {
  $(".select_list.active .answer")
    .addClass("unselected")
    .click(function () {
      let $this = $(this);
      $(".select_list.active .answer").removeClass("unselected");
      $this.addClass("selected");

      // 중복 클릭 불가능하도록 disabled 처리
      $(".select_list.active .answer").attr("disabled", true);

      effectAudioSet("quizSelect");

      if ($this.data("val") == correct) {
        $this.siblings(".answer").addClass("disabled");
        $(".select_list.active").removeClass("active");
        $(".select_list .answer").off("click");

        callback(true);

        if (correctTextBox.length > 0) {
          if ($this.text() != "") {
            correctTextBox.html($this.text());
          } else {
            correctTextBox.html($this.html());
          }
        }

        if (isHidden) {
          $this.parent().remove();
        }
      } else {
        if (slow) {
          setTimeout(() => {
            $this.removeClass("selected");

            // 중복 클릭 불가능하도록 disabled 처리 1초 후 해제
            $(".select_list.active .answer").attr("disabled", false);
          }, 4000);
          callback(false);
        } else {
          setTimeout(() => {
            $this.removeClass("selected");

            // 중복 클릭 불가능하도록 disabled 처리 1초 후 해제
            $(".select_list.active .answer").attr("disabled", false);
          }, 1000);
          callback(false);
        }
      }
    });
};

// quizSelectSetOnNew 복수 정답 버전
const quizMultiSelectSetOnNew = (correct, callback) => {
  let correctCopy = [...correct];

  $(".select_list.active .answer")
    .addClass("unselected")
    .click(function () {
      let $this = $(this);
      $(".select_list.active .answer").removeClass("unselected");
      $this.addClass("selected");

      // 중복 클릭 불가능하도록 disabled 처리
      $(".select_list.active .answer").attr("disabled", true);
      effectAudioSet("quizSelect");

      if (correctCopy.includes($this.data("val"))) {
        if (correctCopy.length == 1) {
          $(".select_list .answer").each(function () {
            let $this = $(this);
            let val = $this.data("val");
            if (!correct.includes(val)) {
              $this.addClass("disabled");
            }
          });
          $(".select_list.active").removeClass("active");
          $(".select_list .answer").off("click");

          callback([true, true]);
        } else {
          const index = correctCopy.indexOf($this.data("val"));

          if (index !== -1) {
            correctCopy.splice(index, 1);
          }

          setTimeout(() => {
            // 중복 클릭 불가능하도록 disabled 처리 1초 후 해제
            $(".select_list.active .answer").attr("disabled", false);
          }, 1000);

          callback([true, false]);
        }
      } else {
        setTimeout(() => {
          $this.removeClass("selected");

          // 중복 클릭 불가능하도록 disabled 처리 1초 후 해제
          $(".select_list.active .answer").attr("disabled", false);
        }, 1000);
        callback(false);
      }
    });
};

// 터치 유도 이벤트 공통
const touchMotionSetOn = (top, left, callback, touchEl = "") => {
  let randomNo = 0;
  do {
    randomNo = Math.floor(Math.random() * 89999) + 10000;
    if (!$(".touchMotion" + randomNo).length) break;
  } while (1);

  let html =
    '<div class="touchMotion touchMotion__comm touchMotion' +
    randomNo +
    '" style="top:' +
    top +
    "px; left:" +
    left +
    'px; display: block;">';
  html += '<div class="touchMotion_point"></div>';
  html += '<div class="touchMotion_hand"></div>';
  html += "</div>";
  $(".main_content").append(html);

  let touchMotion = ".touchMotion" + randomNo;

  $(document).on("click", touchMotion, function () {
    effectAudioSet("click");

    $(touchMotion).remove();
    callback();

    if (touchEl.length > 0) {
      touchEl.off("click").removeClass("touchMotion__event");
    }
  });

  if (touchEl.length > 0) {
    touchEl.addClass("touchMotion__event");

    touchEl.click(() => {
      $(touchMotion).remove();
      touchEl.off("click").removeClass("touchMotion__event");
      effectAudioSet("click");

      callback();
    });
  }
};

const touchMotionSetInit = () => {
  $(".touchMotion__comm").remove();
  $(".touchMotion__event").off("click").removeClass("touchMotion__event");
};

/* 공통 사운드 처리 */
$(document).on("click", ".touchMotion", function () {
  if (!$(this).hasClass("touchMotion__comm")) {
    effectAudioSet("click");
  }
});

const drawVerticalLine = () => {
  let start, end, detail, interval, html, detailInterval, detailCnt;

  $(".vertical_line_box").each(function () {
    start = $(this).data("start"); // 시작 숫자 (int)
    end = $(this).data("end"); // 종료 숫자 (int)
    detail = $(this).data("detail"); // 1단위 (true/false)
    interval = $(this).data("interval"); // 간격 (int)

    html =
      '<div class="line vertical' +
      (start > 0 ? "" : " start_zero") +
      ' dp_flex">';
    for (let i = start; i <= end; i += interval) {
      html += '<div class="number number' + i + '"><span>' + i + "</span>";
      if (detail == true) {
        detailInterval = $(this).data("detail-interval");
        detailCnt = Math.ceil(interval / detailInterval);

        for (let j = 0; j < detailCnt; j++) {
          if (start == i && start == 0 && j < detailCnt / 2) continue;
          html +=
            '<div class="detail" style="left:' +
            (100 / detailCnt) * j +
            '%;"></div>';
        }
      }
      html += "</div>";
    }
    html += "</div>";

    $(this).html(html);
  });
};

$(document).ready(function () {
  drawVerticalLine();
});

// 곱셈표
const createMulTable = () => {
  let start, end, html, quiz;

  $(".mul_table_box").each(function () {
    start = $(this).data("start"); // 시작 숫자 (int)
    end = $(this).data("end"); // 종료 숫자 (int)
    quiz = $(this).data("quiz"); // 빈칸 (int)

    html = `
      <table>
        <tbody>
    `;
    for (let i = start; i <= end + 1; i++) {
      html += '<tr class="tr tr' + (i + 1) + '">';
      for (let j = start; j <= end + 1; j++) {
        if (quiz != undefined) {
          let isQuizCell = quiz.find((q) => q[0] === i - 1 && q[1] === j - 1);

          if (i == 0 && j == 0) {
            html +=
              '<td class="title_td title_td' +
              (j + 1) +
              '"><span>×</span></td>';
          } else if (i > 0 && j == 0) {
            html +=
              '<td class="title_td title_td' +
              (j + 1) +
              '"><span>' +
              (i - 1) +
              "</span></td>";
          } else if (i == 0 && j > 0) {
            html +=
              '<td class="title_td title_td' +
              (j + 1) +
              '"><span>' +
              (j - 1) +
              "</span></td>";
          } else if (isQuizCell) {
            html +=
              '<td class="text_td text_td' +
              (j + 1) +
              " blank blank" +
              (quiz.indexOf(isQuizCell) + 1) +
              '"><div></div></td>';
          } else {
            html +=
              '<td class="text_td text_td' +
              (j + 1) +
              '"><span>' +
              (i - 1) * (j - 1) +
              "</span></td>";
          }
        } else {
          if (i == 0 && j == 0) {
            html +=
              '<td class="title_td title_td' +
              (j + 1) +
              '"><span>×</span></td>';
          } else if (i > 0 && j == 0) {
            html +=
              '<td class="title_td title_td' +
              (j + 1) +
              '"><span>' +
              (i - 1) +
              "</span></td>";
          } else if (i == 0 && j > 0) {
            html +=
              '<td class="title_td title_td' +
              (j + 1) +
              '"><span>' +
              (j - 1) +
              "</span></td>";
          } else {
            html +=
              '<td class="text_td text_td' +
              (j + 1) +
              '"><span>' +
              (i - 1) * (j - 1) +
              "</span></td>";
          }
        }
      }
      html += "</tr>";
    }
    html += `
        </tbody>
      </table>
    `;

    $(this).html(html);
  });
};

$(document).ready(function () {
  createMulTable();
});

/* 시계 유형 */
/*
  clock - 시계가 만들어질 요소
  time - 시계의 초기 시간
  handle - 조작 침 설정 'h'(시침) 또는 'm'(분침) / 생략 시 시계 생성만 됨
  correct - 정답 시간 / 생략 시 callback 진행 되지 않음
  callback - 조작 후 실행될 함수
*/
class ClockEx {
  constructor(clock, time, handle = null, correct = null, callback = null) {
    this.clock = clock;
    this.callback = callback;
    this.dragEl = null;
    this.centerX = 0;
    this.centerY = 0;
    this.angle = 0;
    this.rotateDeg = 0;
    this.clockNum = 0;
    this.minuteDeg = null;
    this.hourDeg = null;
    this.handle = handle;
    this.dragVal = null;
    this.initTime = time.split(":");
    this.correctTime = correct != null ? correct.split(":") : null;
    this.correctFlag = false;
    this.handleFlag = false;

    if (this.handle != null) {
      this.dragVal = this.handle == "m" ? "--minute-deg" : "--hour-deg";
    }

    this.createAnalogClock();
    this.generateClockStyles();
  }

  createAnalogClock = () => {
    const minTimesPerHour = 4;
    const totalHours = 12;
    const totalMinTimes = totalHours * minTimesPerHour;

    /* 시계 생성 */
    let html = `
      <div class="analog-clock">
        <div class="hand hour"></div>
        <div class="hand minute"></div>
    `;

    for (let i = 1; i <= totalHours; i++) {
      html += `<div class="time time${i}"><span>${
        i === 12 ? 12 : i
      }</span></div>`;
      for (let j = 1; j <= minTimesPerHour; j++) {
        html += `<div class="min_time min_time${i}_${j}"></div>`;
      }
    }

    html += `
        <div class="drag-area"></div>
      </div>
      <div class="clock-frame"></div>

      <div class="touchMotion touchMotion__comm">
        <div class="touchMotion_hand"></div>
      </div>
    `;

    this.clock.html(html);
    this.dragEl = this.clock.find(".drag-area");
    this.dragEl.draggable();

    /* 초기 시간 각도 설정 */
    this.setClockRotate(this.initTime);
    if (this.handle == null) {
      this.setFixedClockRotate();
    }

    console.log("시계 생성 완료!");
  };

  generateClockStyles = () => {
    let degreei, baseDegree, minuteDegree;

    /* 시계 스타일 설정 */
    for (let i = 1; i <= 12; i++) {
      degreei = i === 1 ? 2 : i - 1;
      baseDegree = (i - 1) * 30;

      this.clock
        .find(`.time.time${degreei}`)
        .css("transform", `rotate(${baseDegree}deg`);
      this.clock
        .find(`.time.time${degreei} span`)
        .css("transform", `rotate(${-baseDegree}deg`);

      for (let j = 1; j <= 4; j++) {
        minuteDegree = baseDegree + j * 6;
        this.clock
          .find(`.min_time.min_time${i}_${j}`)
          .css("transform", `rotate(${minuteDegree}deg)`);
      }
    }
  };

  roundRotateDeg = () => {
    // 소수점 있는 각도를 정수로 반올림
    let roundedDeg = Math.round(this.rotateDeg);

    // 30의 배수로 반올림
    let unit = this.dragVal == "--minute-deg" ? 6 : 30;
    let remainder = roundedDeg % unit;
    if (remainder <= unit / 2) {
      roundedDeg -= remainder;
    } else {
      roundedDeg += unit - remainder;
    }

    /* 분침 위치에 따른 시침 위치 세부 조정 */
    if (this.dragVal == "--hour-deg") {
      roundedDeg += (this.minuteDeg / 6) * 0.5;
    }

    this.rotateDeg = roundedDeg;
  };

  setClockRotate = (setTime) => {
    this.minuteDeg = parseInt(setTime[1]) * 6;
    document.documentElement.style.setProperty("--minute-deg", this.minuteDeg);

    this.hourDeg = parseInt(setTime[0]) * 30 + (this.minuteDeg / 6) * 0.5;
    document.documentElement.style.setProperty("--hour-deg", this.hourDeg);
  };

  setFixedClockRotate = () => {
    this.clock
      .find(".hand.minute")
      .css("transform", `translate3D(-50%, 0, 0) rotate(${this.minuteDeg}deg)`);
    this.clock
      .find(".hand.hour")
      .css("transform", `translate3D(-50%, 0, 0) rotate(${this.hourDeg}deg)`);
  };

  setClockEvent = () => {
    if (this.handle != null) {
      $(this.clock).find(".touchMotion").css("display", "block");
      timerSet(() => {
        timerInit();
        $(this.clock).find(".touchMotion").css("display", "none");
      }, 2000);
      this.dragEl.on("draggable:start", this.draggableStart.bind(this));
      this.dragEl.on("draggable:stop", this.draggableStop.bind(this));
    }
  };

  draggableStart = () => {
    console.log("시계 작동 시작!");
    effectAudioSet("effectStart");
    $(this.clock).find(".touchMotion").css("display", "none");

    this.centerX = this.clock.offset().left + this.clock.width() / 2;
    this.centerY = this.clock.offset().top + this.clock.height() / 2;

    this.dragEl.on("touchmove", this.draggableDrag.bind(this));
    this.dragEl.on("mousemove", this.draggableDrag.bind(this));

    this.handleFlag = true;
  };

  draggableDrag = (event) => {
    if (this.handleFlag) {
      if (event.touches.length > 0) {
        this.angle = Math.atan2(
          event.touches[0].pageX - this.centerX,
          event.touches[0].pageY - this.centerY
        );
        console.log("event.pageX : ", event.touches[0].pageX);
        console.log("event.pageY : ", event.touches[0].pageY);
      } else {
        this.angle = Math.atan2(
          event.pageX - this.centerX,
          event.pageY - this.centerY
        );
        console.log("event.pageX : ", event.pageX);
        console.log("event.pageY : ", event.pageY);
      }

      // 마우스 위치와 중심 사이의 각도 계산
      console.log("centerX : ", this.centerX);
      console.log("centerY : ", this.centerY);
      console.log("angle : ", this.angle);

      // 각도를 도(degree) 단위로 변환
      this.rotateDeg = this.angle * (180 / Math.PI) * -1 + 180;
      console.log("rotateDeg : ", this.rotateDeg);

      this.clockNum =
        Math.round((this.rotateDeg % 360) / 30, 0) === 12
          ? 0
          : Math.round((this.rotateDeg % 360) / 30, 0);
      $(`.time${this.clockNum}`).siblings().removeClass("on");
      $(`.time${this.clockNum}`).addClass("on");

      document.documentElement.style.setProperty(this.dragVal, this.rotateDeg);

      if (this.dragVal == "--minute-deg") {
        let hourRotateDeg = (this.rotateDeg / 6) * 0.5 + this.hourDeg;
        document.documentElement.style.setProperty("--hour-deg", hourRotateDeg);

        /* 분침 조작 시 정답 처리 */
        if (this.correctTime != null) {
          if (parseInt(this.correctTime[1]) == 0) {
            /* 정답이 정시일 경우 */
            if (this.rotateDeg > 358.0) {
              this.correctFlag = true;
              this.draggableStop();
            }
          } else if (
            parseInt(this.correctTime[1]) == 58 ||
            parseInt(this.correctTime[1]) == 59
          ) {
            /* 정답이 58분 ,59분일 경우  */
            if (parseInt(this.correctTime[1]) == 58) {
              if (this.rotateDeg > 349.0) {
                this.correctFlag = true;
                this.draggableStop();
              }
            } else {
              if (this.rotateDeg > 355.0) {
                this.correctFlag = true;
                this.draggableStop();
              }
            }
          } else {
            /* 정답이 정시가 아닐 경우 */
            if (
              Math.round(parseInt(this.correctTime[1]) / 5, 0) == this.clockNum
            ) {
              this.correctFlag = true;
              this.draggableStop();
            }
          }
        }
      } else {
        /* 시침 조작 시 정답 처리 */
        if (this.correctTime != null) {
          if (parseInt(this.correctTime[0]) == this.clockNum) {
            this.correctFlag = true;
            this.draggableStop();
          }
        }
      }
    }
  };

  draggableStop = () => {
    console.log("시계 작동 끝!");
    this.handleFlag = false;

    // 드래그 영역 초기화
    this.dragEl.css("left", "").css("top", "");

    // 변수값 초기화
    this.centerX = 0;
    this.centerY = 0;

    this.clock.find(".time.on").removeClass("on");

    this.dragEl.off("touchmove");
    this.dragEl.off("mousemove");

    if (this.correctFlag) {
      this.dragEl.off("draggable:start");
      this.dragEl.off("draggable:stop");

      if (this.handle == "m") {
        this.minuteDeg = this.rotateDeg;
      } else {
        this.hourDeg = this.rotateDeg;
      }

      this.setClockRotate(this.correctTime);
      this.setFixedClockRotate();
      this.callback(true);
      this.correctFlag = false;
    } else {
      if (this.correctTime != null) {
        this.callback(false);
      }

      this.roundRotateDeg();
      document.documentElement.style.setProperty(this.dragVal, this.rotateDeg);
    }
  };
}

// 선 그리기
const drawCanvasSetOn = (canvasEl, activeEl, imgUrl, callback, color) => {
  let writeChecked = true;
  const canvas = document.getElementById(canvasEl);
  const ctx = canvas.getContext("2d");
  let drawImage = new Image();
  let painting = false;
  let stopped = false;
  let active = true;
  let gifSource = $(activeEl + " .canvas__bg__write img").attr("src");

  $(activeEl + " .canvas__bg__write").addClass("active");
  $(activeEl + " .canvas__bg__write img").attr("src", "");
  $(activeEl + " .canvas__bg__write img").attr(
    "src",
    gifSource + "?" + new Date().getTime()
  );

  setTimeout(() => {
    $(activeEl + " .canvas__bg__write").removeClass("active");
    active = false;
  }, 3000);

  drawImage.src = imgUrl;
  drawImage.onload = () => {
    canvas.setAttribute("width", drawImage.width);
    canvas.setAttribute("height", drawImage.height);
    canvas.classList.add("on");
    ctx.drawImage(drawImage, 0, 0);

    ctx.globalCompositeOperation = "source-atop";
    pattern = ctx.createPattern(drawImage, "no-repeat");

    ctx.strokeStyle = color;
    ctx.lineWidth = 30;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  function startPainting(event) {
    if (stopped) return;
    if (active) return;
    effectAudioSet("click");
    painting = true;
  }

  function stopPainting(event) {
    if (stopped) return;
    if (active) return;
    stopped = true;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    callback();
  }

  function onMouseMove(event) {
    if (stopped) return;
    if (active) return;

    const x = event.x;
    const y = event.y;
    if (!painting) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  function getTouchPos(canvasDom, touchEvent) {
    const rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top,
    };
  }

  if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);

    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touchPos = getTouchPos(canvas, e);
      startPainting(touchPos);
    });

    canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      stopPainting(e);
    });

    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touchPos = getTouchPos(canvas, e);
      onMouseMove(touchPos);
    });
  }
};

const drawCanvasSetInit = (canvasEl, imgUrl, color) => {
  const canvas = document.getElementById(canvasEl);
  const ctx = canvas.getContext("2d");

  // 캔버스 전체를 지웁니다.
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 초기 이미지를 다시 그립니다.
  let drawImage = new Image();
  drawImage.src = imgUrl;
  drawImage.onload = () => {
    canvas.setAttribute("width", drawImage.width);
    canvas.setAttribute("height", drawImage.height);
    canvas.classList.remove("on");
    ctx.drawImage(drawImage, 0, 0);

    ctx.globalCompositeOperation = "source-atop";
    const pattern = ctx.createPattern(drawImage, "no-repeat");

    ctx.strokeStyle = color;
    ctx.lineWidth = 30;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };
};
