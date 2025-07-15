// 인트로이미지
const imageLoad1 = "../../../COMM/IMG/INTROCH.png";
const imageLoad2 = "../../../COMM/IMG/TEST/INTRO_OBJECT.PNG";
const imageLoad3 = "../../../COMM/IMG/CONCEPT/INTRO_OBJECT.PNG";

let player = "";
let transition = true; // ??
let resizingTimer = null; // window size resizing timer

//로딩 프로그레스바
let loadingProgress = 0;
//페이지 로드 여부
let detectLoad = 0;

const Wrap = document.getElementById("wrap");
const ContentsWrap = document.getElementById("contents-wrap");

//페이지 데이터
let contentsData;
//통신 결과
let response;

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

window.addEventListener("load", function () {
  detectLoad += 1;
  winResize();
  init();
  setIntroUI();

  // 폰트 로드 여부 확인
  // fontjs.font.setup(); // run setup when the DOM is ready
  // setInterval(() => {
  //   console.log(fontjs.font.isInstalled("OAGothic-ExtraBold"));
  // }, [500]);

  // gamePageLoad();
  // videoPageLoad();
});
$(window).on("resize", function () {
  winResize();
});

// window size resize 하는 함수.
function winResize() {
  clearTimeout(resizingTimer);
  resizingTimer = setTimeout(function () {
    let bodyHeight = document.body.clientHeight;
    let wrap = document.getElementById("wrap");
    let calHeight = bodyHeight * (2000 / 1200);
    wrap.style.zoom = calHeight / 2000;
  }, 300);
}

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

// 초기 셋팅
function init() {
  let deviceCheck = deviceConfirm();
  console.log("device 정보 ::::: ", deviceCheck);
  // mo일때 코너 데이터 통신 - 저장한 학습이력을 가져오기 위해 !!!!!

  if (deviceConfirm() === "mo") {
    try {
      window.javascript_object.getConerData();
    } catch (e) {
      console.log("error: " + e.message);
    }
  } else {
    // pc일때
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
          ATDLEC_LOC: "null",
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
    if (response === "video" || response === "game") {
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

      Wrap.appendChild(popUpEl);

      $(".reStart-btn").on("click", () => {
        btnClickAudioEx.play();
        // window.javascript_object.putStudyVdo("1", "aa", "0");
        Wrap.removeChild(popUpEl);
        // 개념쏙쏙
        // layout.test();
      });

      $(".continue-btn").on("click", () => {
        btnClickAudioEx.play();
        Wrap.removeChild(popUpEl);
        if (response === "video") {
          //비디오 실행
          videoPageLoad();
        } else {
          //게임 실행
          gamePageLoad();
        }
      });
    }
  }
}

// 이력 확인 팝업 띄우기
function checkHistory(history) {
  if (history) {
    const popUpEl = document.createElement("div");
    popUpEl.classList.add("checkPop-wrap");
    popUpEl.innerHTML = `
          <div class="check-popUp">
            <p>
              이미 확인 문제를 완료하였습니다.<br/>
              ${history === "video" ? "개념 영상" : "학습 게임"}부터 이어 학습하시겠습니까?
            </p>
            <div class="popUp-btnWrap">
              <button class="reStart-btn">다시하기</button>
              <button class="continue-btn">이어하기</button>
            </div>
          </div>
        `;
    Wrap.appendChild(popUpEl);

    // 다시하기
    $(".reStart-btn").on("click", () => {
      btnClickAudioEx.play();
      window.javascript_object.putStudyVdo("1", "aa", "0");
      Wrap.removeChild(popUpEl);
      // index3 다시시작 코드 넣어야함 (layout.test())
    });

    // 이어하기
    $(".continue-btn").on("click", () => {
      btnClickAudioEx.play();
      Wrap.removeChild(popUpEl);
      if (history === "video") {
        //비디오 실행
        videoPageLoad();
      } else {
        //게임 실행
        gamePageLoad();
      }
    });
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
    playType = JSON.parse(param).RESP_RESULT[0].ATDLEC_LOC;
    if (playType === "video" || playType === "game") {
      checkHistory(playType);
    }
  },
};

// 인트로 셋팅
function setIntroUI() {
  $("#contents-wrap").html(`
            <div class="content-intro">
                <div class="intro-inner">
                    <h4>${intro?.type === "concept" ? "개념익히기" : "확인문제"}</h4>
                      <h1 class="intro-tit intro-tit2">${intro?.title}</h1>
                    <div class="guideTxtWrap">
                        <div>
                          ${intro?.subTitle.map((item) => `<p>${item}</p>`).join("")}
                        </div>
                    </div>
                    <div class="character">
                    </div>
                    <button class="startBtn">시작하기</button>
                </div>
            </div>
        `);
  $("#contents-wrap").css("style", "background-image: url(../IMG/TEST/INTRO_OBJECT.PNG)");

  // 인트로 시작하기 버튼
  $(".startBtn").on("click", () => {
    console.log("개념 쏙쏙 시작");
    $("#contents-wrap").html("");
    $("#contents-main").css("display", "flex");
  });
}

//개념 더하기 비디오 이벤트
const videoEx = {
  option: {
    playbackRates: [1, 1.2, 1.5, 2, 0.8],
    poster: "",
    controls: true,
    preload: "auto",
    width: window.innerWidth,
    height: window.innerHeight,
    fill: true,
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
  },

  firstCreateVideo: (videoEl, videoData) => {
    videoEx.resetVideo(videoEl);

    //비디오 주소 임시
    videoEl.innerHTML = `
        <video-js 
            id=play-video 
            class="vjs-default-skin video-js" 
        > 
             <source src=${videoData}>
        </video-js>
    `;
    player = videojs("play-video", videoEx.option);
    videoEx.createVideo();
    videoEx.playEventHandler();

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

      // 중도 이탈 시 확인문제 점수로 firstContents 정의 (0426)
      if (firstContents === undefined) {
        correctCount = GetLocalStorage("examScore");
        if (correctCount !== null) {
          firstContents = correctCount >= 4 ? "game" : "video";
        }
      }

      winResize();

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
          contentsData = gameData?.game;
          // layout.game();
          watchVideo = true;
          gamePageLoad();
        });
      }

      window.javascript_object.callFinish();
    });
  },

  resetVideo: (obj) => {},
};

// 오디오 자동재생
function audioPlay(audioObj, audioLs, callback) {
  audioObj.pause();
  audioObj.onended = "";
  audioObj.src = "";
  audioObj.src = audioLs[0];

  audioObj.play();
  let nextAudioIndex = 1;
  audioObj.onended = function () {
    if (nextAudioIndex < audioLs.length) {
      audioObj.src = audioLs[nextAudioIndex];
      audioObj.play();
    }
    nextAudioIndex++;
    if (callback) {
      callback(nextAudioIndex);
    }
  };
}

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

//종료 함수
function callFinish() {
  window.javascript_object.callFinish();
}

//비디오 페이지로 이동
const videoPageLoad = () => {
  $("#contents-wrap").css("display", "block");
  $(".checkexam-warp").css("display", "none");
  $(".key-pad").css("display", "none");
  $(".correct-character").css("display", "none");
  $(".hintBox-warp").css("display", "none");
  $(".reaction").css("display", "none");

  // 확인 문제 > 학습 게임 > 개념 영상 플로우 진행 시
  // 학습 게임 load로 인한 메타 변경 원복 (0508)
  const viewport = $('meta[name="viewport"]');
  viewport.attr("content", "width=device-width,initial-scale=1, maximum-scale=1, user-scalable=no");

  $("#contents-wrap").show();
  $("#contents-wrap").html(`<div id="videoPlayer-wrapper"></div>`);
  console.log(videoURL);
  const videoEl = document.querySelector("#videoPlayer-wrapper");
  videoEx.firstCreateVideo(videoEl, videoURL);
};

//게임 페이지로 이동
const gamePageLoad = () => {
  // windowLoading();
  console.log("gameData ::: ", gameData);
  const gameType = gameData?.game?.type;
  $("#contents-wrap").css("display", "block");
  $(".checkexam-warp").css("display", "none");
  $(".key-pad").css("display", "none");
  $(".correct-character").css("display", "none");
  $(".hintBox-warp").css("display", "none");
  $(".reaction").css("display", "none");

  // 중도 이탈 시 확인문제 점수로 firstContents 정의 (0426)
  if (firstContents === undefined) {
    correctCount = GetLocalStorage("examScore");
    if (correctCount !== null) {
      firstContents = correctCount >= 4 ? "game" : "video";
    }
  }

  $("#contents-wrap").show();
  $("#contents-wrap").html(`<section class="gameCont"></section>`);
  const gameContEl = document.querySelector(".gameCont");

  gameContEl.classList.add(gameType);
  game.createGameContent(gameContEl, gameType);
};

//로딩
const windowLoading = () => {
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
  document.querySelector("body").appendChild(loading);
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

                    if (intro?.type === "concept") {
                      console.log("pageAction");
                      stepSet();
                    }

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
};
//즉시실행
windowLoading();
