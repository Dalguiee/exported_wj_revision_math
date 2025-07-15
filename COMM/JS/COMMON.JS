// 인트로이미지
const imageLoad1 = "../../../COMM/IMG/INTROCH.png";
const imageLoad2 = "../../../COMM/IMG/TEST/INTRO_OBJECT.PNG";
const imageLoad3 = "../../../COMM/IMG/CONCEPT/INTRO_OBJECT.PNG";

let winW = window.innerWidth;
let winH = window.innerHeight;
let oneEventStart = true;
let studypause = true;
let pauseValue = false;
let alProgrees,
  alProgreesAfter,
  Ch,
  bubbleText,
  bubbleWrap,
  player,
  narration,
  ChNum = 1;
let transition = true;

const Wrap = document.getElementById("wrap");
const ContentsWrap = document.getElementById("contents-wrap");

//페이지 데이터
let contentsData;
//통신 결과
let response;
// 오디오
let audio;

//로딩 프로그레스바
let loadingProgress = 0;
//페이지 로드 여부
let detectLoad = 0;

//인트로 이미지 로드 완료 여부
function load(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", resolve);
    image.addEventListener("error", reject);
    image.src = src;
  });
}
load(imageLoad1).then(() => {
  detectLoad += 1;
});
load(imageLoad2).then(() => {
  detectLoad += 1;
});
load(imageLoad3).then(() => {
  detectLoad += 1;
});

/**
 * 확인문제 결과에 따라 어떤 활동이 먼저인지 확인
 * firstContents 를 'video' , 'game'으로 구분
 * 80% 미만 영상이 먼저일때 = video
 * 80% 이상 게임이 먼저일때 = game
 */
let firstContents;

/**
 * @description localStorage에 데이터를 저장하는 함수.
 */
function SetLocalStorage(key, val) {
  if (window.localStorage) {
    window.localStorage.setItem(key, val);
  }
  return val;
}

/**
 * @description localStorage의 데이터를 가져오는 함수.
 */
function GetLocalStorage(key) {
  return window.localStorage ? window.localStorage.getItem(key) : "";
}

/**
 * @description localStorage에 데이터를 지우는 함수.
 */
function RemoveLocalStorage(key) {
  if (window.localStorage) {
    window.localStorage.removeItem(key);
  }
}

// 시작 버튼 오디오
const startAudio = "../../../COMM/SOUND/START.MP3";
const conceptStartAudio = new Audio("../../../COMM/SOUND/START.MP3");
// 이전, 다음 버튼 오디오
const commonChangeAudio = "../../../COMM/SOUND/CHANGEPAGE.MP3";
const pageAudio = new Audio("../../../COMM/SOUND/CHANGEPAGE.MP3");
// 터치 이벤트 오디오
// const commonClickAudio = "../../../COMM/SOUND/CLICK.MP3";
const touchAudio = new Audio("../../../COMM/SOUND/CLICK.MP3");

//개념익히기 배경음악
const conceptAudio = new Audio("../../../COMM/SOUND/CONCEPT_BGM.MP3");
//라인 소리
const audioLine = "../../../COMM/SOUND/GAME/LINE.MP3";

window.addEventListener("DOMContentLoaded", function () {
  init();
  detectLoad += 1;
  if (pageId === "readyGame") {
    winResize();
  }
});
$(window).on("resize", function () {
  winResize();
});

let timer = null;
// window size resize 하는 함수.
// function winResize() {
//   clearTimeout(timer);
//   timer = setTimeout(function () {
//     let bodyHeight = document.body.clientHeight;
//     let wrap = document.getElementById("wrap");
//     let calHeight = bodyHeight * (2000 / 1200);
//     wrap.style.zoom = calHeight / 2000;
//     // document.body.style.zoom = calHeight / 2000;
//     // wrap.style.transform = `scale(${calHeight / 2000})`;
//   }, 300);
// }

// 그어그어 이슈, dottodot 에서만 body zoom 적용
function winResize() {
  clearTimeout(timer);
  timer = setTimeout(function () {
    let bodyHeight = document.body.clientHeight;
    let wrap = document.getElementById("wrap");
    let calHeight = bodyHeight * (2000 / 1200);
    wrap.style.zoom = calHeight / 2000;
  }, 300);
}

console.log("-------data---------");

let agent = navigator.userAgent;
let deviceCheck = /SM-T500/.test(agent);
//디바이스 구분 (mo/pc)
function deviceConfirm() {
  const uaLower = window.navigator.userAgent.toLocaleLowerCase();
  const ua = window.navigator.userAgent;
  const ipad = uaLower.indexOf("ipad") > -1 || (uaLower.indexOf("macintosh") > -1 && "ontouchend" in document);
  const ios = /iPhone|iPad+iPod/i.test(ua);
  const aos = /Android/i.test(ua);

  if (ipad || ios || aos) {
    return "mo";
  } else {
    return "pc";
  }
}

console.log("device 정보 ::::: ", deviceConfirm());

// mo일때 코너 데이터 통신 - 저장한 학습이력을 가져오기 위해 !!!!!
if (deviceConfirm() === "mo") {
  try {
    window.javascript_object.getConerData();
  } catch (e) {
    console.log("코너 데이터 통신 에러 : ", e);
  }
}

/**
 * getConerData
 * @param {object} param 통신 결과값
 */
function getConerData(param) {
  console.log("*********************param***************************");
  console.log(param);
  responData.setResponse(param);
}

/**
 * 통신 후 결과 데이터 변환
 */
const responData = {
  setResponse(param) {
    console.log("*********************response***************************");

    response = JSON.parse(param).RESP_RESULT[0].ATDLEC_LOC;

    if (response) {
      // 이력 확인 팝업
      const popUpEl = document.createElement("div");

      popUpEl.classList.add("checkPop-wrap");
      popUpEl.innerHTML = `
          <div class="check-popUp">
            <p>
              이미 확인 문제를 완료하였습니다.<br/>
              ${response === "video" ? "개념 영상" : "학습 게임"}부터 이어 학습하시겠습니까?
            </p>
            <div class="popUp-btnWrap">
              <button class="reStart-btn">다시하기</button>
              <button class="continue-btn">이어하기</button>
            </div>
          </div>
              `;
      // 확인문제만 팝업 띄우기
      if (pageId === "test") {
        if (response === "video" || response === "game") {
          Wrap.appendChild(popUpEl);

          const reStartBtnEl = document.querySelector(".reStart-btn");
          const continueBtnEl = document.querySelector(".continue-btn");

          function removePop() {
            touchAudio.play();
            Wrap.removeChild(popUpEl);
          }

          reStartBtnEl.addEventListener("click", function () {
            window.javascript_object.putStudyVdo("1", "aa", "0");
            removePop();
            layout.test();
          });

          continueBtnEl.addEventListener("click", function () {
            removePop();
            contentsData = data[response];
            console.log(response);
            if (response === "video") {
              layout.video();
            } else {
              layout.game();
            }
          });
        }
      }
    }
  },
};

//videojs 옵션
// videojs.Vhs.GOAL_BUFFER_LENGTH = 10;
// videojs.Vhs.MAX_GOAL_BUFFER_LENGTH = 150;
let videoOptions = {
  playbackRates: [1, 1.2, 1.5, 2, 0.8],
  poster: "",
  controls: true,
  preload: "auto",
  width: winW,
  height: winH,
  autoplay: "play",
  muted: false,
  // muted: true, //테스트용
  playsinline: true,
  html5: {
    vhs: {
      overrideNative: true,
      enableLowInitialPlaylist: true,
    },
    nativeAudioTracks: false,
    nativeVideoTracks: false,
  },
  flash: {
    vhs: {
      enableLowInitialPlaylist: true,
    },
  },
  controlBar: {
    playToggle: true,
    pictureInPictureToggle: true,
    remainingTimeDisplay: false,
    progressControl: true,
    qualitySelector: false,
    durationDisplay: true,
    currentTimeDisplay: true,
    liveDisplay: false,
    timeDivider: true,
    fullscreenToggle: false,
    audioTrackButton: false,
    volumePanel: false,
  },
};

console.log(pageId);

/**
 * init 초기 컨텐츠 생성
 */
function init() {
  // 데이터 셋팅 (readyGame일 경우 전 차시 데이터 셋팅)
  if (pageId === "readyGame") {
    console.log(unit);
    contentsData = JSON.parse(JSON.stringify(dataset[grade][unit][chapter - 1].game));
  } else {
    contentsData = data[pageId];
  }
  console.log(contentsData);

  ContentsWrap.classList.add(pageId);
  switch (pageId) {
    case "readyGame":
      layout.readyGame();
      break;
    case "concept":
      layout.concept();
      break;
    case "test":
      layout.test();
      break;
  }
}

// 컨텐츠 레이아웃
const layout = {
  //준비 학습
  readyGame: () => {
    console.log("contentsData ::: ", contentsData);
    const readyGameType = contentsData?.type;

    ContentsWrap.innerHTML = `
            <section class="gameCont"></section>
        `;
    const gameContEl = document.querySelector(".gameCont");

    gameContEl.classList.add(readyGameType);
    game.createGameContent(gameContEl, readyGameType);
  },

  //개념 익히기
  concept: () => {
    let conceptData = data?.concept;
    console.log("개념쏙쏙 데이터::::::", conceptData);

    // 인트로 페이지 생성
    ContentsWrap.innerHTML = `
            <div class="content-intro">
                <div class="intro-inner">
                    <h4>개념익히기</h4>
                    <h1 class="intro-tit ${conceptData.title.length > 12 ? "intro-tit2" : ""}">${conceptData.title}</h1>
                    <div class="guideTxtWrap">
                        <div>
                            ${conceptData.guideTxt
                              .map(
                                (item) => `
                            <p>${item}</p>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                    <div class="character"></div>
                    <button class="startBtn">시작하기</button>
                </div>
            </div>
        `;
    const conceptStartBtnEl = document.querySelector(".startBtn");
    conceptStartBtnEl.addEventListener("click", function () {
      console.log("개념 쏙쏙 시작");
      conceptStartAudio.play();

      // 개념익히기 배경 음악
      onConceptBgm();

      //초기페이지 세팅
      initConceptPage();
    });

    //활동 데이터
    const activityData = conceptData?.activityData;

    // 총 개념 번호
    const totalActivity = Object.keys(activityData).length;
    //개념 번호
    let currentActivity = 1;

    // 한 개념 내의 현재 페이지 번호
    let currentPage = 1;
    // 한 개념 내의 완료 페이지
    let completePage = 0;

    // 페이지 완료 상태
    let completePageState = false;

    //컨텐츠 페이지 생성
    function initConceptPage() {
      let totalPageData = activityData[currentActivity];
      let totalPages = totalPageData.length;
      let currentPageData = activityData[currentActivity][currentPage - 1];
      console.log(currentPageData);
      console.log(currentPage);
      // console.log("totalPageData",totalPageData)
      console.log("totalPages", totalPages);
      // console.log("currentPageData",currentPageData)
      // console.log("currentPage",currentPage)

      if (currentPageData.activityTit.state) {
        playAudio(currentPageData.activityTit.audio);
        // playEffectAudioHandler(currentPageData.activityTit.audio)
      } else {
        audio = null;
      }

      ContentsWrap.innerHTML = `
                <div class="content-wrap content-intro">
                    <div class="content-inner">
                        <div class="header">
                            <div class="h-left">
                                <button class="playBtn"><img src="../../../COMM/IMG/PLAYBTN.PNG" alt="스피커 버튼"/></button>
                                <h1 class="content-tit" >${currentPageData.activityTit.txt}</h1>
                            </div>
                            <div class="h-right">
                                <div class="pageCont"><span class="active">${currentActivity}</span>/${totalActivity}</div>  
                            </div>
                        </div>

                        <button class="arrowBtn prevBtn ${currentPage - 1 === 0 && currentActivity === 1 ? "d-none" : "on"}" ></button>
                        <button class="arrowBtn nextBtn ${currentActivity !== 1 && currentPage === totalPages ? "d-none" : completePageState ? "on" : ""}" ></button> 
                        
                        <div class="content off">
                        </div>

                        <div class="click__car__character"></div>
                    </div>

                    <ul class="pagination">
                        ${totalPageData.map((item) => `<li key=${item.id} class=${item.id === currentPage ? "on" : "off"}></li>`).join("")}
                    </ul>
                </div>
                
            `;

      const playBtnEl = document.querySelector(".playBtn");
      const nextBtnEl = document.querySelector(".nextBtn");
      const prevBtnEl = document.querySelector(".prevBtn");

      // 개념 익히기 타이틀 사운드 재생이벤트
      playBtnEl.addEventListener("click", () => {
        if (audio && !audio.paused) return;

        pauseConceptAudio();
        touchAudio.play();
        playAudio(currentPageData.activityTit.audio);
        audio.addEventListener("ended", function () {
          onResumeConceptAudio();
        });
      });

      /**
       * 이전 버튼 클릭 이벤트
       */
      function prevPage() {
        // playAudio(commonChangeAudio);
        pageAudio.play();
        if (currentPage > 1) {
          currentPage--;
        } else if (currentPage === 1 && currentActivity === totalActivity) {
          console.log("이전 개념으로 넘어가ㅏㅏㅏ");
          currentActivity--;
          currentPage = 1;
          completePage = 0;
        }
        pauseAudio();
        pauseAudioObj();
        initConceptPage();
      }

      /**
       * 다음 버튼 클릭 이벤트
       */
      function nextPage() {
        // playAudio(commonChangeAudio);
        if (conCompletePageState) {
          pageAudio.play();
          if (currentPage < totalPages) {
            currentPage++;
          } else if (currentActivity !== totalActivity && currentPage === totalPages) {
            console.log("다음 개념으로 넘어감");
            currentActivity++;
            currentPage = 1;
            completePage = 0;
          }

          conCompletePageState = false;
          initConceptPage();
        }
      }

      nextBtnEl.addEventListener("click", () => nextPage());
      prevBtnEl.addEventListener("click", () => prevPage());

      // concept 데이터
      conCompletePageState = completePageState;
      conData = currentPageData;
      conCurrentPage = currentPage;
      conTotalPageData = totalPageData;
      conTotalPage = totalPages;
      conActivityData = activityData;
      conCurrentActivity = currentActivity;

      conUiRender();
    }
    //임시 초기 페이지 세팅
    // initConceptPage();
  },

  //확인 문제
  test: () => {
    const testData = data?.test;
    console.log("확인 문제 데이터::::::", testData);

    // 인트로 페이지 생성
    ContentsWrap.innerHTML = `
            <div class="content-intro">
                <div class="intro-inner">
                    <h4>확인문제</h4>
                    <h1 class="intro-tit ${testData.title.length > 12 ? "intro-tit2" : ""}">${testData.title}</h1>
                    <div class="guideTxtWrap">
                        <div>
                          ${testData.guideTxt
                            .map(
                              (item) => `
                          <p>${item}</p>
                          `
                            )
                            .join("")}
                        </div>
                    </div>
                    <div class="character"></div>
                    <button class="startBtn">시작하기</button>
                </div>
            </div>
        `;

    const testStartBtnEl = document.querySelector(".startBtn");
    testEvent.createTestPage(testData, testStartBtnEl);
  },

  //개념 더하기
  video: () => {
    // 중도 이탈 시 확인문제 점수로 firstContents 정의 (0426)
    if (firstContents === undefined) {
      correctCount = GetLocalStorage("examScore");
      if (correctCount !== null) {
        firstContents = correctCount >= 4 ? "game" : "video";
      }
    }

    // 확인 문제 > 학습 게임 > 개념 영상 플로우 진행 시
    // 학습 게임 load로 인한 메타 변경 원복 (0508)
    document.querySelector('meta[name="viewport"]').setAttribute("content", "width=device-width,initial-scale=1, maximum-scale=1, user-scalable=no");

    ContentsWrap.innerHTML = ` 
            <div id="videoPlayer-wrapper"></div>
        `;

    console.log(data);
    const videoEl = document.querySelector("#videoPlayer-wrapper");
    video.firstCreateVideo(videoEl, data.video);
  },

  //실력 쑥쑥 게임 컨텐츠
  game: () => {
    // 중도 이탈 시 확인문제 점수로 firstContents 정의 (0426)
    if (firstContents === undefined) {
      correctCount = GetLocalStorage("examScore");
      if (correctCount !== null) {
        firstContents = correctCount >= 4 ? "game" : "video";
      }
    }

    console.log("contentsData ::: ", contentsData);
    const gameType = contentsData?.type;

    ContentsWrap.innerHTML = `
            <section class="gameCont"></section>
        `;
    const gameContEl = document.querySelector(".gameCont");

    gameContEl.classList.add(gameType);
    game.createGameContent(gameContEl, gameType);
  },
};

// 배열 랜덤 재배열
function shuffle(array) {
  array.sort(() => 0.5 - Math.random());
  return array;
}

// 배열 랜덤 원복
function unshuffle(array) {
  const copiedArray = [...array];
  copiedArray.sort((a, b) => array.indexOf(a) - array.indexOf(b));

  return copiedArray;
}

//개념 익히기 배경 오디오 재생
function offConceptBgm() {
  conceptAudio.pause();
  turnOff = true;
}
function onConceptBgm() {
  conceptAudio.volume = 0.5;
  conceptAudio.loop = true;
  conceptAudio.play();
  turnOff = false;
}

// 오디오 재생
function playAudio(el) {
  if (audio && !audio.paused) {
    // 이미 재생 중인 오디오가 있다면 정지
    audio.pause();
    audio.currentTime = 0;
  }

  audio = new Audio(el);
  audio.muted = false;
  audio.addEventListener("ended", () => {
    audio.muted = true;
  });

  audio
    .play()
    .then(() => {
      audio.muted = false;
    })
    .catch((error) => {
      console.error("오디오 재생 오류:", error);
    });
}

// 오디오 정지
function pauseAudio() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

function pauseAudioObj() {
  if (audioObj) {
    audioObj.volume = 0;
    audioObj.pause();
    audioObj.currentTime = 0;
    turnOff = true;
  }
}

// 개념익히기 중도 음성 정지
function pauseConceptAudio() {
  if (audioObj) {
    audioObj.pause();
    turnOff = true;
  }
}

function onResumeConceptAudio() {
  if (audioObj) {
    if (audioObj.ended) {
      console.log("오디오가 이미 끝났습니다.");
    } else {
      console.log("오디오가 끝나지 않았습니다.");
      audioObj.volume = 1;
      audioObj.play();
      turnOff = false;
    }
  } else {
    console.log("오디오 객체가 존재하지 않습니다.");
  }
}

// 디바이스 홀드 오디오 정지
function onPause() {
  if (audio) {
    audio.pause();
  }

  if (audioObj) {
    audioObj.pause();
  }

  if (pageId === "concept") {
    offConceptBgm();
  }
  turnOff = true;
}

function bgmSoundStop() {
  if (audio) {
    audio.pause();
  }

  if (audioObj) {
    audioObj.pause();
  }

  if (pageId === "concept") {
    offConceptBgm();
  }
  turnOff = true;
}

function onResume() {
  if (audio) {
    audio.volume = 1;
    audio.play();
  }

  if (audioObj) {
    audioObj.volume = 1;
    audioObj.play();
  }

  if (pageId === "concept") {
    onConceptBgm();
  }
  turnOff = false;
}

// 효과음 후 발문 재생 이벤트
function playEffectAudioHandler(el) {
  if (audio) {
    audio.addEventListener("ended", function () {
      playAudio(el);
    });
  }
}

//종료 함수
function callFinish() {
  window.javascript_object.callFinish();
}

//개념 더하기 비디오 이벤트
const video = {
  firstCreateVideo: (videoEl, videoData) => {
    video.resetVideo(videoEl);

    //비디오 주소 임시
    videoEl.innerHTML = `
        <video-js 
            id=play-video 
            class="vjs-default-skin video-js" 
        > 
             <source src=${videoData.src}>
        </video-js>
    `;
    player = videojs("play-video", videoOptions);
    video.createVideo();
    video.playEventHandler();

    let spinner = document.getElementsByClassName("vjs-loading-spinner")[0];
    spinner.innerHTML = "<img src='../../../COMM/IMG/LODING.GIF' alt='이미지'>";

    // LOCK Btn
    let lockBtn = document.createElement("button");
    lockBtn.classList.add("lock-button");
    lockBtn.innerHTML = "LOCK";
    lockBtn.addEventListener("click", toggleControls);
    ContentsWrap.appendChild(lockBtn);
  },

  createVideo: () => {
    studypause = true;
    transition = true;
    player.ready(function () {
      player.play();
    });
  },

  playEventHandler: () => {
    player.on("ended", function (e) {
      transition = false;
      console.log(transition);

      const completePopup = document.createElement("div");

      completePopup.classList.add("video-complete-popup");
      completePopup.innerHTML =
        firstContents === "video"
          ? `
          <div class="complete-popInner">
            <img src="../../../COMM/IMG/COMPLETE_POP.PNG" alt="비디오 완료 팝업"/>
            <div class="popBtn-wrap">
              <button class="reStartBtn"></button>
              <button class="goGameBtn"></button>
            </div>
          </div>
        `
          : `
        <div class="complete-popInner">
          <img src="../../../COMM/IMG/LASTPOPUP.PNG" alt=" 최종 완료 팝업"/>
          <div class="popBtn-wrap popBtn-wrap2">
            <button class="reStartBtn"></button>
          </div>
        </div>
        `;

      ContentsWrap.appendChild(completePopup);

      const videoReStartBtnEl = document.querySelector(".reStartBtn");
      const goGameBtnEl = document.querySelector(".goGameBtn");

      videoReStartBtnEl.addEventListener("click", function () {
        player.currentTime(0);
        player.play();
        ContentsWrap.removeChild(completePopup);
      });

      if (goGameBtnEl) {
        goGameBtnEl.addEventListener("click", function () {
          contentsData = data["game"];
          layout.game();
        });
      }

      window.javascript_object.callFinish();
    });
  },

  resetVideo: (obj) => {},
};

function fadeIn(target, speed = 50) {
  let level = 0;
  let inTimer = null;
  inTimer = setInterval(function () {
    level = fadeInAction(target, level, inTimer);
  }, speed);
}
function fadeInAction(target, level, inTimer) {
  level = level + 0.1;
  changeOpacity(target, level, true);
  if (level > 1) clearInterval(inTimer);
  return level;
}
function fadeOut(target, speed = 50) {
  let level = 1;
  let outTimer = null;
  outTimer = setInterval(function () {
    level = fadeOutAction(target, level, outTimer);
  }, speed);
}
function fadeOutAction(target, level, outTimer) {
  level = level - 0.1;
  changeOpacity(target, level, false);
  if (level < 0) {
    clearInterval(outTimer);
  }
  return level;
}
function changeOpacity(target, level, State) {
  let obj = target;
  obj.style.display = State ? "block" : "none";
  obj.style.opacity = level;
  obj.style.MozOpacity = level;
  obj.style.KhtmlOpacity = level;
  obj.style.MsFilter = "'progid: DXImageTransform.Microsoft.Alpha(Opacity=" + level * 100 + ")'";
  obj.style.filter = "alpha(opacity=" + level * 100 + ");";
}

function toggleControls(e) {
  let _this = e.target;
  console.log(_this);
  let lockDom = document.body;
  let screenLock;
  let buttonClass = "active";
  let screenLockClass = "screen-lock";

  if (_this.classList.contains(buttonClass)) {
    _this.classList.remove(buttonClass);
    screenLock = document.querySelector("." + screenLockClass);
    screenLock.remove();
  } else {
    _this.classList.add(buttonClass);
    screenLock = document.createElement("div");
    screenLock.classList.add(screenLockClass);
    lockDom.appendChild(screenLock);
  }
}

function lockScreen() {
  let isActive = document.querySelector(".lock-button").classList.contains("active");
  let screenLock;
  let screenLockClass = "screen-lock";
  let bodyEl = document.body;

  if (isActive) {
    screenLock = document.createElement("div");
    screenLock.classList.add(screenLockClass);
    bodyEl.appendChild(screenLock);
  }
}
function lockClear() {
  let screenLock;
  let screenLockClass = "screen-lock";
  if (document.querySelector("." + screenLockClass) != null || document.querySelector("." + screenLockClass) != undefined) {
    screenLock = document.querySelector("." + screenLockClass);
    screenLock.remove();
  }
}
// let itemNum;
// console.log(dataTheme);
// preload();

// function preload() {
//     itemNum = Object.keys(dataTheme).length;

//     console.log(itemNum);
// }

// pc일 때 이력 저장 테스트
if (deviceConfirm() === "pc") {
  let dummy = {
    RESP_RESULT: [
      {
        BOOK_CODE: "",
        CHAP_NAME: "확인문제",
        SCORE: null,
        QVIEW_TMP_URL: "",
        QST_EXSN_YN: "N",
        VDO_SEQ: null,
        PSG_EXSN_YN: "N",
        CHAP_TY_CD: "A",
        APPKG_NAME: "com.wjthinkbig.NFhtml5viewer",
        QST_BTCH_MARK_YN: "N",
        TDSTD_DSP_YN: "Y",
        LESN_SYSTEM_CODE: "NF11",
        NEXT_ATMT_VALUE: "N",
        FRST_STD_COMP_DT: null,
        APMDL_KEY: "",
        // ATDLEC_LOC: "game", //"ATDLEC_LOC":"video", "ATDLEC_LOC":"game"
        ATDLEC_LOC: null,
        PSG_TY_CD: null,
        DSP_NMORD: 1,
        STD_PRGS_ST_CD: "SR50",
        CSS_COURSE_CODE: "MATH",
        CONER_SEQ: 5635108,
        NEXT_ATMT_YN: "N",
        EXHT_DTL_SEQ: null,
        CHAP_SEQ: 5635171,
        NRST_STD_DTM: "20240102 14:14:11",
        ACTV_NAME: "com.wjthinkbig.NFhtml5viewer.view.StudyViewerWebviewActivity",
      },
    ],
  };

  response = dummy.RESP_RESULT[0].ATDLEC_LOC;

  if (response) {
    // 이력 확인 팝업
    const popUpEl = document.createElement("div");

    popUpEl.classList.add("checkPop-wrap");
    popUpEl.innerHTML = `
        <div class="check-popUp">
          <p>
            이미 확인 문제를 완료하였습니다.<br/>
            ${response === "video" ? "개념 영상" : "학습 게임"}부터 이어 학습하시겠습니까?
          </p>
          <div class="popUp-btnWrap">
            <button class="reStart-btn">다시하기</button>
            <button class="continue-btn">이어하기</button>
          </div>
        </div>
            `;

    //확인문제만 팝업 띄우기
    if (pageId === "test") {
      Wrap.appendChild(popUpEl);

      const reStartBtnEl = document.querySelector(".reStart-btn");
      const continueBtnEl = document.querySelector(".continue-btn");

      function removePop() {
        touchAudio.play();
        Wrap.removeChild(popUpEl);
      }

      reStartBtnEl.addEventListener("click", function () {
        // window.javascript_object.putStudyVdo("1", "aa", "0");
        removePop();
        layout.test();
      });

      continueBtnEl.addEventListener("click", function () {
        removePop();
        contentsData = data[response];
        console.log(response);
        if (response === "video") {
          layout.video();
        } else {
          layout.game();
        }
      });
    }
  }
}

// 검수용 리셋 버튼
function createResetBtn() {
  const resetBtn = document.createElement("button");
  resetBtn.innerHTML = `video 가기`;

  resetBtn.style.cssText = `
    position : absolute;
    bottom: 2%;
    left: 2%;
    border: 1px solid #fff;
    z-index : 99;
    color: #fff;
    font-size : 20px;
  `;

  Wrap.appendChild(resetBtn);

  resetBtn.addEventListener("click", function () {
    // console.log()
    const pop = document.querySelector(".checkPop-wrap");
    if (pop) {
      Wrap.removeChild(pop);
    }
    layout.video();
  });
}

// 개념 종료 함수 호출
// 마지막 페이지 현재 페이지 번호 == 총 페이지 수 일 경우 완료 처리
function conceptFinished() {
  if (conCurrentPage === conTotalPage) {
    callFinish();
  }
}

// 터치유도 가이드
function clickTouchGuide(audio) {
  document.querySelector(".content").classList.remove("off");
  document.querySelector(".content").classList.add("on");

  document.querySelector(".content.on").addEventListener("touchstart", function () {
    offConceptGuide();
  });

  $(".content").append(`
        <div class="overlay__guide__wrap">
          <div class="guide__wrap__handbox">
            <div class="wrap__handbox__target ${conceptContData.guideClass}">
              <img src="../../../COMM/IMG/TOUCH_GUIDE.png" />
            </div>
          </div>
        </div>
  `);

  if (audio) {
    audioPlay(audio);
  }
}

// 개념익히기 가이드 삭제
function offConceptGuide() {
  // pauseAudio();
  $(".click__car__character").hide();
  $(".overlay__guide__wrap").hide();
}

// 오디오끝나면 터치유도 가이드 사라짐
function hdwadEnds(val) {
  audioPlay(val);

  audioObj.addEventListener("ended", function () {
    $(".overlay__guide__wrap").hide();
  });
}

// 개념익히기 캐릭터 보이기
function showCharacterHandler() {
  const characterEl = document.querySelector(".click__car__character");

  // characterEl.style.display = 'block'
  characterEl.style.opacity = 1;
}

//로딩
const windowLoading = () => {
  if (pageId === "test" || pageId === "concept") {
    const loading = document.createElement("div");
    loading.classList.add("loading-wrap");
    loading.innerHTML = `
    <div class="loading-bar">
      <div class="loading-progress">
        <div class="loading-progress_inner" style="width : 0%"></div>
      </div>
      <p class="loading-text">0%</p>
    </div>
    `;
    document.querySelector("html").appendChild(loading);
    setTimeout(() => {
      let loadingInterval1 = setInterval(() => {
        if (loadingProgress < 90) {
          loadingProgress += 1;
          $(".loading-progress_inner").css("width", `${loadingProgress}%`);
          $(".loading-text").html(`${loadingProgress}%`);
          if (loadingProgress === 90) {
            clearInterval(loadingInterval1);
            let detectInterval = setInterval(() => {
              if (detectLoad > 3) {
                let loadingInterval2 = setInterval(() => {
                  if (loadingProgress < 100) {
                    loadingProgress += 1;
                    $(".loading-progress_inner").css("width", `${loadingProgress}%`);
                    $(".loading-text").html(`${loadingProgress}%`);
                    setTimeout(() => {
                      clearInterval(loadingInterval2);
                      $(".loading-wrap").remove();
                    }, [2000]);
                  }
                }, [70]);
                clearInterval(detectInterval);
              }
            }, [20]);
          }
        }
      }, [20]);
    }, [100]);
  }
};
//즉시실행
windowLoading();
