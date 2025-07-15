let conActivityData = ""; // 활동 데이터
let conCurrentPage = ""; // 현재 페이지 수
let conTotalPage = ""; // 총 페이지 수
let conTotalPageData = ""; // 전체 페이지 데이터
let conData = ""; // 현재 페이지 데이터
let conceptContData = "";
let conCur = ""; // 현재 타입 정보
let audioObj = ""; // 오디오 Element

// 개념익히기 설명 있는지
let isStopElement = false;

let wrongAudio = "../../../COMM/SOUND/GAME/ANSWERWRO.MP3";
let answerAudio = "../../../COMM/SOUND/GAME/ANSWER.MP3";

let stopTopContEl = document.createElement("div");
stopTopContEl.classList.add("stop_top_content");

let conTypeInfo = {
  /**
   *
   * 학년, 학기, 차시, 순서
   *
   */

  // 2학년 2차시
  "2_1_2_1": {
    render: () => {
      contentObj = `
        <div class="container">
          <div class="img__wrap__box">
            <img src="${conceptContData.img.bgImg}" />
          </div>

          <div class="common__calc__wrap ${conceptContData.hideClass}">
            <div class="calc__wrap__btnsbox">
              <div class="wrap__btnsbox__numberbtns">
                <div class="btnsbox__numberbtns__box">
                  <button>1</button>
                  <button>2</button>
                  <button>3</button>
                  <button>4</button>
                  <button>5</button>
                </div>
                <div class="btnsbox__numberbtns__box">
                  <button>6</button>
                  <button>7</button>
                  <button>8</button>
                  <button>9</button>
                  <button>0</button>
                </div>
              </div>

              <div class="wrap__btssbox__fn">
                <button>
                  <img src="../../../COMM/IMG/KEYPAD_DEL.PNG" />
                </button>
                <button>
                  <img src="../../../COMM/IMG/KEYPAD_CON.PNG" />
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      $(".content").addClass("_2_1_2_1");
      $("._2_1_2_1").html(contentObj);
      conCur.Fn2_1_2_1();
    },
    Fn2_1_2_1: () => {
      $(".click__car__character").hide();

      if (audio) {
        audio.addEventListener("ended", function () {
          clickTouchGuide();
        });
      }

      // 클릭 시 이미지 변경과 사운드 재생
      if (conceptContData.audio.answerAudio || conceptContData.audio.loadAudio) {
        $(".img__wrap__box").on("click", function () {
          touchAudio.play();
          $(this).addClass("disabled");
          $(".img__wrap__box > img").attr("src", conceptContData.img.clickToImg);

          $(".img__wrap__box > img").hide();
          $(".img__wrap__box > img").fadeIn("slow");
          audioPlay(conceptContData.audio.answerAudio);

          if (!conData.stop) {
            nextBtnHandler();
          } else {
            stopTopContEl.innerHTML = `
              <div class="top_img">
                <img src="${conData.stop.topImg}" alt="top_img"/>
              </div>
            `;
            showConceptPage(stopTopContEl);
          }
        });
      }
    },
  },
  // 2학년 2차시 3page 키패드.
  keypad: {
    answer: "",

    render: () => {
      contentObj = `
          <div class="keypad__wrapper">
            <div class="keypad__top__wrapper">
              <div class="keypad__number__box">
                ${conceptContData.dataNum
                  .map(
                    (item) =>
                      `
                      ${
                        item.text === conceptContData.answer
                          ? `
                    <span class="on"> <div class="keypad__answer__box on" data-val="${item.text}"></div></span>
                      `
                          : `
                        <span>${item.text}</span>
                      `
                      }
                    `
                  )
                  .join("")}
              </div>

              
              <div class="calculator__box">
                <div class="calculator__number__btns">

                </div>

                <div class="calculator__fn__btns">
                  <button id="backBtn">
                    <img src="../../../COMM/IMG/CONCEPT/BACKBTN.png"/>
                  </button>

                  <button id="checkBtn">
                    <img src="../../../COMM/IMG/CONCEPT/CHECKBTN.png"/>
                  </button>
                </div>

                <div class="calculator__close_wrap">
                  <div class="closeBtn"></div>
                </div>

              </div>
  
              <div class="top_img">
                <img src="${conceptContData.topImg}" />

                <div class="aniBox"></div>
              </div>
            </div>

          </div>


        `;
      $(".content").addClass("keypadtype");
      $(".keypadtype").html(contentObj);
      conCur.keypadTypeFn();

      // 키패드 외부 영역 클릭 닫기 기능 추가 (0605)
      document.addEventListener("click", function (e) {
        let keypad = document.querySelector(".calculator__box");
        let selectedAnswerBox = document.querySelector(".keypad__answer__box.active");

        // 클릭된 요소가 키패드 자신이거나 키패드 내부 요소인 경우 무시
        if (e.target.closest(".keypad") === keypad || keypad.contains(e.target) || e.target === selectedAnswerBox) {
          return;
        }

        console.log("키패드 외부 영역 클릭");
        $(".calculator__box.active #checkBtn").click();
      });
    },
    // keypadTypeFn 숫자데이터 요소추가
    keypadTypeFn: () => {
      // keypad type
      conCur.keypadInit();

      audioPlay(conceptContData.audio.loadAudio);

      const aniBox = document.querySelector(".aniBox");

      audioObj.addEventListener("ended", function () {
        aniBox.classList.add("active");
        // conceptContData.audio.audioList.forEach((el, idx)=>{
        //   if (aniBox){
        //       setTimeout(()=> {
        //         // audioPlay(el);
        //         aniBox.style.width = `calc(7% + (9.2% * ${idx}))`
        //     }, 1200 * idx)
        //   }
        // });

        function playAudioList(audioList, index) {
          if (index < audioList.length) {
            audioPlay(audioList[index]);
            if (aniBox) {
              aniBox.style.width = `calc(7% + (9.2% * ${index}))`;
            }
            audioObj.addEventListener("ended", function () {
              if (index === 8) {
                console.log("마지막 구십 끝!!!!!!!!!!!!!!!!!!!!!!!!!");
                clickTouchGuide();
                keypadEvent();
              } else {
                playAudioList(audioList, index + 1);
              }
            });
          }
        }

        playAudioList(conceptContData.audio.audioList, 0);
      });

      function keypadEvent() {
        $(".keypad__answer__box.on").on("click", function () {
          if (!$(this).hasClass("eventNone")) {
            touchAudio.play();
            conCur.answer = $(this)
              .text()
              .replace(/[^0-9]/g, "");
            $(".calculator__box").css("display", "flex").addClass("active");
            // $(".keypad__answer__box").text("");
            $(this).addClass("active");
          }
        });

        $(".calculator__number__btns > button").on("click", function () {
          touchAudio.play();
          $(".keypad__answer__box.on").text(conCur.calcKeyboardBtn(this.dataset.val));
        });

        $("#backBtn").on("click", function () {
          touchAudio.play();
          conCur.answer = conCur.answer.slice(0, -1);
          $(".keypad__answer__box.on").text(conCur.answer);
        });

        $("#checkBtn").on("click", function () {
          touchAudio.play();
          if (conCur.answer == conceptContData.answer) {
            audioPlay(answerAudio);
            $(".calculator__box").removeClass("active").hide();
            $(".keypad__answer__box").removeClass("active").addClass("eventNone");
            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.audio.answerAudio);

              document.querySelector(".keypad__wrapper").innerHTML = `
              <div class="keypad_result">
                <img src="${conceptContData.answerImg}" />
              </div>
            `;
              audioObj.addEventListener("ended", function () {
                if (!conData.stop) {
                  nextBtnHandler();
                } else {
                  stopTopContEl.innerHTML = `
                    <div class="top_txt">
                      <p class="txt1">100</p>
                      <p class="txt2">백</p>
                    </div>
                    <div class="top_img">
                      <img src="${conData.stop.topImg}" alt="top_img"/>
                    </div>
                  `;
                  showConceptPage(stopTopContEl);

                  setTimeout(() => {
                    document.querySelector(".txt1").classList.add("on");

                    setTimeout(() => {
                      document.querySelector(".txt2").style.display = "block";
                    }, 1000);
                  }, 5000);
                }
              });
            });
          } else {
            console.log("오답");
            audioPlay(wrongAudio);
            $(".calculator__box").removeClass("active").hide();
            $(".keypad__answer__box").removeClass("active").text("");
          }
        });

        // 키패드 닫기 기능 추가 (0605)
        $(".calculator__box .closeBtn").on("click", function (e) {
          e.stopPropagation();
          $(".calculator__box").removeClass("active").css("display", "none");
          // $("#checkBtn").off('click');
          $(".keypad__answer__box").removeClass("active");
        });
      }
    },
    calcBtnsAdd: () => {
      const calcBtns = [
        {
          id: 1,
          text: 1,
        },
        {
          id: 2,
          text: 2,
        },
        {
          id: 3,
          text: 3,
        },
        {
          id: 4,
          text: 4,
        },
        {
          id: 5,
          text: 5,
        },
        {
          id: 6,
          text: 6,
        },
        {
          id: 7,
          text: 7,
        },
        {
          id: 8,
          text: 8,
        },
        {
          id: 9,
          text: 9,
        },
        {
          id: 0,
          text: 0,
        },
      ];
      for (i = 0; i < calcBtns.length; i++) {
        $(".calculator__number__btns").append(`<button data-val="${calcBtns[i].text}">${calcBtns[i].text}</button>`);
      }
    },
    keypadAddElt: () => {
      for (i = 0; i < conceptContData.dataNum.length; i++) {
        if (conceptContData.dataNum[i].text !== conceptContData.answer) {
          $(".keypad__number__box").append(`<span>${conceptContData.dataNum[i].text}</span>`);
        } else {
          $(".keypad__number__box").append(`<span class="on">${(conceptContData.dataNum[i].text = "")}</span>`);
          $(".keypad__number__box > .on").append(`<div class="keypad__answer__box on" data-val="${conceptContData.dataNum[i].text}"></div>`);
        }
      }
    },
    /**
     * 계산기
     */
    // 뒤로가기
    calcBack: () => {},
    // 완료
    calcComplete: () => {},
    // 키보드 버튼
    calcKeyboardBtn: (targetVal) => {
      let res = conCur.answer.length < 3 ? (conCur.answer += targetVal) : conCur.answer;
      return res;
    },
    keypadInit: () => {
      $(".click__car__character").css("display", "none");
      // conCur.keypadAddElt();
      conCur.calcBtnsAdd();
    },
  },

  // 2학년 1-2차시 2번 개념
  spacing: {
    render: () => {
      // 문제문항 데이터
      const data = [{ text: ["100은 90보다", "만큼 더 큰 수입니다."] }, { text: ["100은 80보다", "만큼 더 큰 수입니다."] }, { text: ["100은 99보다", "만큼 더 큰 수입니다."] }];

      // 해당 페이지의 id를 이용하여, 해당페이지에 맞는 문제문항 data가지고 옴.
      let idx = conData.id - 1;

      contentObj = `
          <div class="spacing__container">
            <div class="spacing__top">
              <div class="aniWrap"></div>
            
              <div class="spacing__btns__box">
                <button class=${conceptContData.contClass === "spacing01" ? "on" : ""}>10만큼씩 세기</button>
                <button class=${conceptContData.contClass === "spacing02" ? "on" : ""}>20만큼씩 세기</button>
                <button class=${conceptContData.contClass === "spacing03" ? "on" : ""}>1만큼씩 세기</button>
              </div>
              
              <div class="spacing__top__con">
                  <img src="${conceptContData.topImg}" class="${conceptContData.boxSmallSize}">
              </div>

            </div>

            <div class="spacing__bottom">
              <div class="spacing__bottom__top">
                <span>${data[idx].text[0]}</span>
                <div class="spacing__question__box border__styled">?</div>
                <span>${data[idx].text[1]}</span>
              </div>

              <div class="spacing__bottom__viewbox"></div>
            </div>
          </div>
        `;
      $(".content").addClass("spacingtype");
      $(".content").addClass(conceptContData.contClass);
      $(".spacingtype").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.spacingFn();
        });
      } else {
        conCur.spacingFn();
      }
    },
    spacingFn: () => {
      conCur.spacingInit();

      if (conceptContData.audio.loadAudio) {
        audioPlay(conceptContData.audio.loadAudio);
      }

      clickTouchGuide();

      const topBtnEl = document.querySelector(".spacing__btns__box button.on");
      topBtnEl.classList.add("active");

      topBtnEl.addEventListener("click", function () {
        touchAudio.play();
        topBtnEl.classList.add("disabled");

        // 수직선 간격 만큼 div 추가
        const aniContLen = conceptContData.topAniLen;

        for (let i = 0; i < aniContLen; i++) {
          const aniBar = document.createElement("div");
          aniBar.classList.add("aniBar");
          document.querySelector(".aniWrap").appendChild(aniBar);
        }

        const aniBar = document.querySelectorAll(".aniBar");

        aniBar.forEach((el, index) => {
          el.style.width = `calc(100% / ${aniContLen})`;
        });
        addAnimationHandler(aniBar);
        audioPlay(conceptContData.audio.epilogueAudio);

        audioObj.addEventListener("ended", function () {
          document.querySelector(".spacing__bottom").classList.add("active");
          clickTouchGuide();
          $(".wrap__handbox__target").css({
            top: "61%",
            left: "46%",
          });

          document.querySelector(".spacing__question__box").addEventListener("click", function () {
            touchAudio.play();
            document.querySelector(".spacing__bottom__viewbox").classList.add("active");

            clickTouchGuide();
            $(".wrap__handbox__target").css({
              top: "78%",
              left: "41%",
            });
          });

          const answerBtnEl = document.querySelectorAll(".spacing__click__box");

          answerBtnEl.forEach((el) => {
            el.addEventListener("click", function () {
              touchAudio.play();
              answerBtnEl.forEach((el) => {
                el.classList.remove("active");
              });
              el.classList.add("active");

              if (el.getAttribute("data-val") === conceptContData.cardAnswer.toString()) {
                console.log("정답");
                audioPlay(answerAudio);
                document.querySelector(".spacing__question__box").innerText = el.getAttribute("data-val");
                audioObj.addEventListener("ended", function () {
                  audioPlay(conceptContData.audio.epilogueAudio02);

                  audioObj.addEventListener("ended", function () {
                    if (!conData.stop) {
                      nextBtnHandler();
                    } else {
                      stopTopContEl.innerHTML = `
                        <div class="top_img">
                          <img src="${conData.stop.top01Img}" alt="top_img01"/>
                  
                          <div class="aniWrap">
                            <div class="aniBar aniBar1"></div>
                            <div class="aniBar aniBar1"></div>
                          </div>
                        </div>
                        <div class="top_img02">
                          <img src="${conData.stop.top02Img}" alt="top_img02"/>
                  
                          <div class="aniWrap aniWrap2">
                            <div class="aniBar aniBar2"></div>
                          </div>
                        </div>
                        <div class="stop_ani_wrap">
                          <img src="${conData.stop.top03Img}" alt="돋보기"/>
                        </div>
                      `;

                      $(".click__car__character").hide();
                      showConceptPage(stopTopContEl);
                    }
                  });
                });
                document.querySelector(".spacing__bottom__viewbox").style.opacity = 0;
                document.querySelector(".spacing__bottom__viewbox").classList.add("disabled");
              } else {
                console.log("오답");
                audioPlay(wrongAudio);

                setInterval(() => {
                  el.classList.remove("active");
                }, 1000);
              }
            });
          });
        });
      });
    },
    spacingInit: () => {
      // 빈칸 정답 초기세팅
      $(".spacing__question__box").val(conceptContData.cardAnswer);

      // 답안 클릭박스 요소추가
      for (i = 0; i < conceptContData.cardData.length; i++) {
        $(".spacing__bottom__viewbox").append(`<button class="spacing__click__box" data-val=${conceptContData.cardData[i].val}>${conceptContData.cardData[i].title}</button>`);
      }
    },
  },
  //2학년 1-3차시 1번
  "2_1_3_1": {
    render: () => {
      contentObj = `
          <div class="container">
            <div class="top_contWrap"></div>
          </div>
      `;

      $(".content").addClass("_2_1_3_1");
      $(".content").addClass(conceptContData.contClass);
      $("._2_1_3_1").html(contentObj);

      for (var i = 0; i < conceptContData.topLen; i++) {
        const topContEl = document.createElement("div");
        topContEl.classList.add("top_cont");

        topContEl.innerHTML = `
          <span class="topTxt">100</span>
          <img src="${conceptContData.topImg}" alt="100"/>
        `;
        document.querySelector(".top_contWrap").appendChild(topContEl);
      }

      $(".click__car__character").hide();
      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.Fn2_1_3_1();
        });
      } else {
        conCur.Fn2_1_3_1();
      }
    },
    Fn2_1_3_1: () => {
      audioPlay(conceptContData.audio.loadAudio);
      const topContEl = document.querySelectorAll(".top_cont");
      topContEl.forEach((el, index) => {
        setTimeout(function () {
          el.classList.add("animated");
        }, index * 1000);
      });

      audioObj.addEventListener("ended", function () {
        document.querySelector(".top_contWrap").classList.add("active");
        clickTouchGuide();
        $(".wrap__handbox__target").css({
          top: "44%",
          left: "50%",
        });

        audioPlay(conceptContData.audio.loadAudio02);

        const clickTopEl = document.querySelector(".top_contWrap");
        clickTopEl.addEventListener("click", function () {
          touchAudio.play();
          clickTopEl.classList.add("disabled");
          document.querySelectorAll(".topTxt").forEach((el) => {
            el.style.display = "none";
          });
          const aniTxt = document.createElement("span");
          aniTxt.classList.add("c-p");
          aniTxt.innerHTML = conceptContData.topAniTxt;
          clickTopEl.appendChild(aniTxt);

          if (!conData.stop) {
            nextBtnHandler();
          } else {
            stopTopContEl.innerHTML = `
                <div class="top_img">
                  <img src="${conData.stop.topImg}" alt="top_img"/>
                </div>
              `;
            showConceptPage(stopTopContEl);
          }
        });
      });
    },
  },

  // 2학년 3차시 7p
  "2_1_3_7": {
    render: () => {
      // 문제문항 데이터
      const TEXT_DATA = [
        {
          text1: ["100이 4개이면", "이고, 10이 10개이면 100이므로"],
          text2: ["100이", "개이면 500입니다."],
          answerText: [300, 400, 500],
        },
        {
          text1: ["100이 3개이면", "이고, 10이 10개이면 100이므로 "],
          text2: ["100이", "개이면 400입니다."],
        },
      ];

      // 해당 페이지의 id를 이용하여, 해당페이지에 맞는 문제문항 data가지고 옴.
      let idx = conData.id - 1;

      contentObj = `
          <div class="container">
            <div class="center__sort__box">
              <div class="click__answer__box">
                <div class="touch__img__box">
                  <img class="touch__img" src="${conceptContData.img.touchImg}" />

                  <div class="figure__img__box">
                    <img src="${conceptContData.img.bgImg}" />

                    <div class="image__box__wrap">
                      <img src="${conceptContData.img.figureImg}" />
                      <img src="${conceptContData.img.figureImg}" />
                      <img src="${conceptContData.img.figureImg}" />
                      <img src="${conceptContData.img.figureImg}" />
                      <img src="${conceptContData.img.figureImg}" />
                      <img src="${conceptContData.img.figureImg}" />
                      <img src="${conceptContData.img.figureImg}" />
                      <img src="${conceptContData.img.figureImg}" />
                      <img src="${conceptContData.img.figureImg}" />
                      <img src="${conceptContData.img.figureImg}" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="click__answer__word">
                <div class="answer__word__box1">
                  <p>${TEXT_DATA[idx].text1[0]}</p>
                  <div class="${conceptContData.class.boxSmallSize} spacing__question__box" data-answer="400">?</div>
                  <p>${TEXT_DATA[idx].text1[1]}</p>
                </div>

                <div class="answer__word__box2">
                  <p>${TEXT_DATA[idx].text2[0]}</p>
                  <div class="${conceptContData.class.boxSmallSize} spacing__question__box" data-answer="5">?</div>
                  <p>${TEXT_DATA[idx].text2[1]}</p>
                </div>
              </div>

              <div class="click__card__box">
                <div class="card__box__answer">300</div>

                <div class="card__box__answer">400</div>

                <div class="card__box__answer">500</div>
              </div>
            </div>
          </div>
      `;
      $(".content").addClass("_2_1_3_7");
      $("._2_1_3_7").html(contentObj);
      $(".click__car__character").hide();

      audio.addEventListener("ended", function () {
        conCur.Fn2_1_3_7();
      });
    },
    Fn2_1_3_7: () => {
      const answer1 = $(".spacing__question__box")[0].dataset.answer; // 빈칸1 정답
      const answer2 = $(".spacing__question__box")[1].dataset.answer; // 빈칸2 정답
      let count = 0;

      // 1번째 터치가이드
      clickTouchGuide();

      audioPlay(conceptContData.audio.loadAudio);

      // 이미지 클릭 시 사운드재생되면서 1.5초마다 모형 1개씩 보임
      $(".touch__img").on("click", function () {
        touchAudio.play();
        audioPlay(conceptContData.audio.figureAudio);

        // 마우스 이벤트 none처리.
        $(".touch__img").addClass("eventNone");

        // 오디오 끝나고 2번째 터치가이드
        $(audioObj).on("ended", function () {
          clickTouchGuide();
          $(".modelGuide1").css({
            top: "52%",
            left: "40%",
          });
        });

        for (let i = 0; i < $(".image__box__wrap>img").length; i++) {
          setTimeout(() => {
            $(".image__box__wrap>img").eq(i).css("opacity", 1);
          }, i * 1500);
        }

        // 터치유도 모형 오디오가 끝나면 문제1, 2번 보임
        $(audioObj).on("ended", function () {
          $(".click__answer__word").css("opacity", 1);
        });
      });

      for (let i = 0; i < $(".spacing__question__box").length; i++) {
        $(".spacing__question__box")
          .eq(i)
          .on("click", function () {
            touchAudio.play();
            $(".card__box__answer").removeClass("active");
            $(".click__card__box").css("opacity", 1);

            // 빈칸1, 2 클릭 시 선택문항 dataset, text변경 toggle
            if ($(".spacing__question__box")[i] == $(".spacing__question__box")[0]) {
              $(".card__box__answer").eq(0).text("300");
              $(".card__box__answer").eq(1).text("400");
              $(".card__box__answer").eq(2).text("500");
              $(".click__card__box").removeClass("disabled");
              count = 1;
            } else {
              $(".card__box__answer").eq(0).text("3");
              $(".card__box__answer").eq(1).text("4");
              $(".card__box__answer").eq(2).text("5");
              $(".click__card__box").removeClass("disabled");
              count = 2;
            }
            clickTouchGuide();
            $(".modelGuide1").css("display", "none");
            $(".click__card__box").addClass("ready");
            if (count === 2) {
              if (!conData.stop) {
                nextBtnHandler();
              } else {
                showConceptPage();
              }
            }
          });
      }

      // 빈칸 1, 2 정답 시 빈칸 채움
      for (let j = 0; j < $(".card__box__answer").length; j++) {
        $(".card__box__answer")
          .eq(j)
          .on("click", function () {
            touchAudio.play();
            $(".click__card__box").removeClass("ready");
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
            // 문제1 정/오답 시 스타일 변경, 오디오 재생
            if (answer1 == this.innerText && count === 1) {
              $(".spacing__question__box").eq(0).removeClass("border__styled");
              $(".spacing__question__box").eq(0).text(this.innerText);

              audioPlay(answerAudio);
              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.audio.problem1.answerAudio);
              });

              $(".spacing__question__box").eq(0).addClass("eventNone");
              $(".click__card__box").css("opacity", 0);
              $(".click__card__box").addClass("disabled");

              clickTouchGuide();
              $(".modelGuide1").css({
                top: "59%",
                left: "32%",
              });
            }

            if (answer1 != this.innerText && count === 1) {
              setTimeout(() => {
                $(this).removeClass("active");
              }, 1000);
              audioPlay(wrongAudio);
              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.audio.problem1.wrongAudio);
              });
            }

            // 문제2 정/오답 시 스타일 변경, 오디오 재생
            if (answer2 == this.innerText && count === 2) {
              $(".spacing__question__box").eq(1).removeClass("border__styled");
              $(".spacing__question__box").eq(1).text(this.innerText);

              audioPlay(answerAudio);
              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.audio.problem2.answerAudio);
              });
              $(".spacing__question__box").eq(1).addClass("eventNone");
              $(".click__card__box").css("opacity", 0);
              $(".click__card__box").addClass("disabled");
            }

            if (answer2 != this.innerText && count === 2) {
              setTimeout(() => {
                $(this).removeClass("active");
              }, 1000);
              audioPlay(wrongAudio);
              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.audio.problem2.wrongAudio);
              });
            }

            // 문제 1, 2번 모두 정답 시 화살표 스타일변경
            if ($(".border__styled").length == 0) {
              $(".prevBtn").addClass("on");
              $(".nextBtn").addClass("on");
            }
          });
      }
    },
  },

  // 2학년 3차시 8p
  "2_1_3_8": {
    render: () => {
      // 문제문항 데이터
      const TEXT_DATA = [
        {
          text1: ["100이 3개이면", "이고, 10이 10개이면 100이므로"],
          text2: ["100이", "개이면 400입니다."],
          answerText: [300, 400, 500],
        },
        {
          text1: ["100이 3개이면", "이고, 10이 10개이면 100이므로 "],
          text2: ["100이", "개이면 400입니다."],
        },
      ];

      // 해당 페이지의 id를 이용하여, 해당페이지에 맞는 문제문항 data가지고 옴.
      let idx = conData.id - 1;

      contentObj = `
          <div class="container">
            <div class="center__sort__box">
              <div class="click__answer__box">
                <div class="touch__img__box2">
                  <div class="img__box2__container">
                    <div class="box2__touch__imgbox" id="touchImg1">
                      <img src="${conceptContData.img.touchImg1}" />
                    </div>

                    <div class="box2__touch__imgbox" id="touchImg2">
                      <img src="${conceptContData.img.touchImg2}" />
                    </div>
                  </div>

                  <div class="img__box2__rightbox">
                    <div class="box2__backwon__box">
                      <img src="${conceptContData.img.touchImg1}" />
                      <img src="${conceptContData.img.touchImg1}" />
                      <img src="${conceptContData.img.touchImg1}" />
                    </div>

                    <div class="box2__sibwon__box">
                      <div>
                        <img src="${conceptContData.img.touchImg2}" />
                        <img src="${conceptContData.img.touchImg2}" />
                        <img src="${conceptContData.img.touchImg2}" />
                        <img src="${conceptContData.img.touchImg2}" />
                        <img src="${conceptContData.img.touchImg2}" />
                      </div>

                      <div>
                        <img src="${conceptContData.img.touchImg2}" />
                        <img src="${conceptContData.img.touchImg2}" />
                        <img src="${conceptContData.img.touchImg2}" />
                        <img src="${conceptContData.img.touchImg2}" />
                        <img src="${conceptContData.img.touchImg2}" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="click__answer__word">
                <div class="answer__word__box1">
                  <p>${TEXT_DATA[idx].text1[0]}</p>
                  <div class="${conceptContData.class.boxSmallSize} spacing__question__box" data-answer="300">?</div>
                  <p>${TEXT_DATA[idx].text1[1]}</p>
                </div>

                <div class="answer__word__box2">
                  <p>${TEXT_DATA[idx].text2[0]}</p>
                  <div class="${conceptContData.class.boxSmallSize} spacing__question__box" data-answer="4">?</div>
                  <p>${TEXT_DATA[idx].text2[1]}</p>
                </div>
              </div>

              <div class="click__card__box">
                <div class="card__box__answer">300</div>

                <div class="card__box__answer">400</div>

                <div class="card__box__answer">500</div>
              </div>
            </div>
          </div>
      `;
      $(".content").addClass("_2_1_3_8");
      $("._2_1_3_8").html(contentObj);
      conCur.Fn2_1_3_8();
    },
    Fn2_1_3_8: () => {
      const answer1 = $(".spacing__question__box")[0].dataset.answer; // 빈칸1 정답
      const answer2 = $(".spacing__question__box")[1].dataset.answer; // 빈칸2 정답
      let count = 0;

      // 터치 이미지 1번 먼저 누를 수 있게 이벤트NONE처리.
      $("#touchImg2").addClass("eventNone");

      $(".click__car__character").hide();

      // 1번째 터치가이드
      clickTouchGuide();

      audioPlay(conceptContData.audio.loadAudio);

      $("#touchImg1").on("click", function () {
        touchAudio.play();
        audioPlay(conceptContData.audio.touchAudio1);
        count++;

        for (let i = 0; i < $(".box2__backwon__box>img").length; i++) {
          setTimeout(() => {
            $(".box2__backwon__box>img").eq(i).css("opacity", 1);
          }, i * 1000);
        }

        $("#touchImg1").addClass("eventNone");

        // 터치1의 사운드재생이 끝나면 터치이미지2를 클릭가능하게 함.
        $(audioObj).on("ended", function () {
          $("#touchImg2").removeClass("eventNone");

          // 2번째 터치가이드
          clickTouchGuide();
          $(".modelGuide2").css({
            left: "28%",
          });
        });
      });

      $("#touchImg2").on("click", function () {
        touchAudio.play();
        audioPlay(conceptContData.audio.touchAudio2);
        count++;

        // 오디오 끝나면 문제 보임
        $(audioObj).on("ended", function () {
          $(".click__answer__word").css("opacity", 1);
          clickTouchGuide();
          $(".modelGuide2").css({
            top: "52%",
            left: "41%",
          });
        });

        for (let i = 0; i < $(".box2__sibwon__box img").length; i++) {
          setTimeout(() => {
            $(".box2__sibwon__box img").eq(i).css("opacity", 1);
          }, i * 1300);
        }

        $("#touchImg2").addClass("eventNone");
      });

      for (let i = 0; i < $(".spacing__question__box").length; i++) {
        $(".spacing__question__box")
          .eq(i)
          .on("click", function () {
            touchAudio.play();
            $(".card__box__answer").removeClass("active");
            $(".click__card__box").css("opacity", 1);

            // 빈칸1, 2 클릭 시 선택문항 dataset, text변경 toggle
            if ($(".spacing__question__box")[0] == $(".spacing__question__box")[i]) {
              $(".card__box__answer").eq(0).text("500");
              $(".card__box__answer").eq(1).text("400");
              $(".card__box__answer").eq(2).text("300");
              $(".click__card__box").removeClass("disabled");
              count = 1;
            } else {
              $(".card__box__answer").eq(0).text("3");
              $(".card__box__answer").eq(1).text("2");
              $(".card__box__answer").eq(2).text("4");
              $(".click__card__box").removeClass("disabled");
              count = 2;
            }
            clickTouchGuide();
            $(".modelGuide2").css("display", "none");
            $(".click__card__box").addClass("ready");
          });
      }

      // 빈칸 1, 2 정답 시 빈칸 채움
      for (let j = 0; j < $(".card__box__answer").length; j++) {
        $(".card__box__answer")
          .eq(j)
          .on("click", function () {
            touchAudio.play();
            $(".click__card__box").removeClass("ready");
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
            // 문제1 정/오답 시 스타일 변경, 오디오 재생
            if (answer1 == this.innerText && count === 1) {
              $(".spacing__question__box").eq(0).removeClass("border__styled");
              $(".spacing__question__box").eq(0).text(this.innerText);

              audioPlay(answerAudio);
              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.audio.problem1.answerAudio);
              });

              $(".spacing__question__box").eq(0).addClass("eventNone");
              $(".click__card__box").css("opacity", 0);
              $(".click__card__box").addClass("disabled");

              clickTouchGuide();
              $(".modelGuide2").css({
                top: "59%",
                left: "32%",
              });
            }

            if (answer1 != this.innerText && count === 1) {
              setTimeout(() => {
                $(this).removeClass("active");
              }, 1000);
              audioPlay(wrongAudio);
              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.audio.problem1.wrongAudio);
              });
            }

            // 문제2 정/오답 시 스타일 변경, 오디오 재생
            if (answer2 == this.innerText && count === 2) {
              $(".spacing__question__box").eq(1).removeClass("border__styled");
              $(".spacing__question__box").eq(1).text(this.innerText);

              audioPlay(answerAudio);
              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.audio.problem2.answerAudio);
              });

              $(".spacing__question__box").eq(1).addClass("eventNone");
              $(".click__card__box").css("opacity", 0);
              $(".click__card__box").addClass("disabled");
            }

            if (answer2 != this.innerText && count === 2) {
              setTimeout(() => {
                $(this).removeClass("active");
              }, 1000);
              audioPlay(wrongAudio);
              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.audio.problem2.wrongAudio);
              });
            }

            // 문제 1, 2번 모두 정답 시 화살표 스타일변경
            if ($(".border__styled").length == 0) {
              $(".prevBtn").addClass("on");
              $(".nextBtn").addClass("on");

              conceptFinished();
            }
          });
      }
    },
  },

  // 2학년 4차시 1/2 1p
  "2_1_4_1": {
    render: () => {
      contentObj = `
          <div class="container">
            <div class="center__sort__box">
              <div class="number__img__box">
                ${conceptContData.img.topImg
                  .map(
                    (item, idx) =>
                      `
                      <div class="top_img" key=${idx}>
                        <img src="${item}" />
                      </div>
                    `
                  )
                  .join("")}
              </div>

              <div class="number__bottom__box">
                <div class="number__table__wrap">
                  <div class="table__wrap__title">
                    <div class="wrap__title__text">백 모형</div>

                    <div class="wrap__title__text">십 모형</div>

                    <div class="wrap__title__text">일 모형</div>
                  </div>

                  <div class="table__wrap__imgbox">
                    ${conceptContData.img.bottomImg
                      .map(
                        (item, idx) =>
                          `
                      <div key=${idx} class="bottom_img">
                        <img src="${item}" class="a_100" />
                      </div>`
                      )
                      .join("")}
                
                  </div>
                
                </div>
                
              </div>
            </div>
          </div>
      `;
      $(".content").addClass("_2_1_4_1");
      $("._2_1_4_1").html(contentObj);
      $(".click__car__character").hide();

      audio.addEventListener("ended", function () {
        conCur.Fn2_1_4_1();
      });
    },
    Fn2_1_4_1: () => {
      ///////////////터치 유도 추가
      const topImgEl = document.querySelectorAll(".top_img");
      const bottomImgEl = document.querySelectorAll(".bottom_img");
      let clickCount = 1;

      // 터치가이드 1
      clickTouchGuide();

      topImgEl.forEach((el, idx) => {
        el.addEventListener("click", function () {
          touchAudio.play();
          // 터치가이드 2, 3
          el.classList.add("disabled");
          clickCount++;
          clickTouchGuide();
          if (clickCount == 2) {
            clickTouchGuide();
            $(".guide__2141_1p").css({
              left: "48%",
            });
          } else if (clickCount == 3) {
            clickTouchGuide();
            $(".guide__2141_1p").css({
              left: "70%",
            });
          } else {
            $(".overlay__guide__wrap").hide();
          }

          bottomImgEl[idx].classList.add("active");
          audioPlay(conceptContData.contentsAudio[idx]);

          const activeEl = document.querySelectorAll(".bottom_img.active");
          if (activeEl.length === 3) {
            audioObj.addEventListener("ended", function () {
              if (!conData.stop) {
                nextBtnHandler();
              } else {
                stopTopContEl.innerHTML = `
                <div class="top_img">
                  <img src="${conData.stop.topImg}" alt="top_img"/>
                </div>
              `;
                showConceptPage(stopTopContEl);
              }
            });
          }
        });
      });
    },
  },

  // 2학년 4차시 1/2 2p
  "2_1_4_2": {
    render: () => {
      contentObj = `
          <div class="container">
            <div class="center__sort__box">
              <div class="number__table__p2">
                <img src='${conceptContData.img.topImg}'/>

                <div class="top_box_wrap">
                  ${conceptContData.img.bottomImg
                    .map(
                      (item, idx) => `
                    <div class="top_box"></div>
                  `
                    )
                    .join("")}
                </div>

              </div>

              <div class="p2__sort__box">
                <div class="p2__answer__box">
                  <div class="p2__top__answerbox p2_answerbox">

                  ${conceptContData.img.bottomImg
                    .map(
                      (item) => `
                    <div class="p2__top__answerbox--number">
                        <span>${item.num}</span>
                    </div>
                  `
                    )
                    .join("")}
                  </div>

                  <div class="p2__bottom__answerbox p2_answerbox">
                    <p>
                    ${conceptContData.img.bottomImg
                      .map(
                        (item, idx) => `
                      <span class="p2color${idx + 1}">${item.txt}</span>
                    `
                      )
                      .join("")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      `;
      $(".content").addClass("_2_1_4_2");
      $("._2_1_4_2").html(contentObj);
      conCur.Fn2_1_4_2();
    },
    Fn2_1_4_2: () => {
      $(".click__car__character").hide();

      const topBoxEl = document.querySelectorAll(".top_box");
      const bottomBoxEl = document.querySelectorAll(".p2__top__answerbox--number span");
      const bottomBox2El = document.querySelectorAll(".p2__bottom__answerbox span");
      let clickCount = 1;

      audioPlay(conceptContData.contentsAudio[0]);

      audioObj.addEventListener("ended", function () {
        clickTouchGuide();
        // 버튼 클릭
        topBoxEl.forEach((el, idx) => {
          el.addEventListener("click", function () {
            touchAudio.play();
            // 터치가이드 2, 3
            clickCount++;
            el.classList.add("disabled");
            clickTouchGuide();
            if (clickCount == 2) {
              clickTouchGuide();
              $(".guide__2142_2p").css({
                left: "50%",
              });
            } else if (clickCount == 3) {
              clickTouchGuide();
              $(".guide__2142_2p").css({
                left: "73%",
              });
            } else {
              $(".overlay__guide__wrap").hide();
            }

            bottomBoxEl[idx].classList.add("active");
            bottomBox2El[idx].classList.add("active");

            const activeEl = document.querySelectorAll(".p2__top__answerbox--number span.active");
            if (activeEl.length === 3) {
              audioPlay(conceptContData.contentsAudio[1]);
              const bottomBoxWrap = document.querySelector(".p2__top__answerbox");
              const bottomTxtWrap = document.querySelector(".p2__bottom__answerbox");
              bottomBoxWrap.classList.add("active");

              setTimeout(() => {
                bottomBoxWrap.classList.remove("active");
                bottomTxtWrap.classList.add("active");
              }, 1000);

              audioObj.addEventListener("ended", function () {
                bottomTxtWrap.classList.remove("active");
                if (!conData.stop) {
                  nextBtnHandler();
                } else {
                  showConceptPage();
                }
              });
            }
          });
        });
      });
    },
  },

  // 2학년 4차시 1/2 3p
  "2_1_4_3": {
    render: () => {
      contentObj = `
          <div class="container">
            <div class="center__sort__box">
              <div class="_2_1_4_3__img__box">
                <img src="${conceptContData.img.topImg}" />
              </div>

              <div class="p2__sort__box">
                <div class="p2__answer__box">
                  <div class="p2__top__answerbox p2__top__answerbox2 p2_answerbox">
                    ${conceptContData.img.bottomImg
                      .map(
                        (item) => `
                      <div class="p2__top__answerbox--number">
                          <span>${item.num}</span>
                      </div>
                    `
                      )
                      .join("")}
                  </div>

                  <div class="p2__bottom__answerbox p2_answerbox">
                    <p>
                      ${conceptContData.img.bottomImg
                        .map(
                          (item, idx) => `
                        <span class="p2color${idx + 1}">${item.txt}</span>
                      `
                        )
                        .join("")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      `;
      $(".content").addClass("_2_1_4_3");
      $("._2_1_4_3").html(contentObj);
      conCur.Fn2_1_4_3();
    },
    Fn2_1_4_3: () => {
      $(".click__car__character").hide();

      audioPlay(conceptContData.contentsAudio[0]);

      const bottomBoxEl = document.querySelectorAll(".p2__top__answerbox--number span");
      const bottomBox2El = document.querySelectorAll(".p2__bottom__answerbox span");

      audioObj.addEventListener("ended", function () {
        bottomBoxEl.forEach((el, idx) => {
          setTimeout(() => {
            el.classList.add("active");
            bottomBox2El[idx].classList.add("active");
          }, 500 * idx);
          audioPlay(conceptContData.contentsAudio[1]);

          audioObj.addEventListener("ended", function () {
            clickTouchGuide();
            $(".wrap__handbox__target").css({
              top: "67%",
              left: "48%",
            });

            document.querySelector(".p2__top__answerbox").addEventListener("click", function () {
              touchAudio.play();
              if (!conData.stop) {
                nextBtnHandler();
              } else {
                stopTopContEl.innerHTML = `
                <div class="top_img">
                  <img src="${conData.stop.topImg}" alt="top_img"/>
                </div>
              `;
                showConceptPage(stopTopContEl);
              }
            });
          });
        });
      });
    },
  },

  // 2학년 4차시 2/2 1p
  "2_1_4_5": {
    render: () => {
      const NUMBER_DATA = [
        {
          text: [
            [5, 2, 8],
            [6, 3, 1],
          ],
        },
      ];

      let idx = conData.id - 1;

      contentObj = `
          <div class="container">
            <div class="center__sort__box">
              <div class="box_2145__container">
                <div class="_2_1_4_5__img__box1">
                  ${conceptContData.img.topImg.map((item, id) => `<img src="${item}" class="topImg"/>`).join("")}
                </div>

                <div class="_2_1_4_5__img__box2">
                    <div class="txtBox">${conceptContData.img.bottomTxt}</div>
                    <div class="imgBox">
                      ${conceptContData.img.bottomImg.map((item, id) => `<img src="${item}" class="bottomImg"/>`).join("")}
                    </div>
                </div>

                <div class="answer__2145__box">
                  <div class="word__2145__wrap">
                    <span>100이</span>
                    <div class=" spacing__question__box--smallsize border__styled spacing__question__box droppable" data-val="1">?</div>
                    <span>개, 10이</span>
                    <div class=" spacing__question__box--smallsize border__styled spacing__question__box droppable" data-val="2">?</div>
                    <span>개, 1이</span>
                    <div class=" spacing__question__box--smallsize border__styled spacing__question__box droppable" data-val="3">?</div>
                    <span>개입니다.</span>
                  </div>
                </div>

                <div class="dnd__bottom__wrapper">
                  <div class="dnd__btns__bottom">
                  </div>
                </div>
              
              </div>
            </div>
          </div>
      `;
      $(".content").addClass("_2_1_4_5");
      $("._2_1_4_5").html(contentObj);
      $(".click__car__character").hide();

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.Fn2_1_4_5();
        });
      } else {
        conCur.Fn2_1_4_5();
      }
    },
    Fn2_1_4_5: () => {
      const topImgEl = document.querySelectorAll(".topImg");
      const bottomImgEl = document.querySelectorAll(".bottomImg");
      let clickCount = 1;

      audioPlay(conceptContData.startAudio);

      audioObj.addEventListener("ended", function () {
        /// 오디오 끝난 후 가이드 추가

        // 터치 가이드 1
        clickTouchGuide();
        topImgEl.forEach((el, idx) => {
          el.addEventListener("click", function () {
            touchAudio.play();
            // 터치가이드 2, 3
            el.classList.add("disabled");
            clickCount++;
            clickTouchGuide();
            if (clickCount == 2) {
              clickTouchGuide();
              $(".guide__2145__1p").css({
                left: "48%",
              });

              $(".guide__2145__2p").css({
                left: "48%",
              });
            } else if (clickCount == 3) {
              clickTouchGuide();
              $(".guide__2145__1p").css({
                left: "65%",
              });

              $(".guide__2145__2p").css({
                left: "65%",
              });
            } else {
              $(".wrap__handbox__target").addClass("dndGuide");
              $("._2_1_4_5 .guide__2145__1p").css({
                top: "82%",
                left: "47%",
              });
              $("._2_1_4_5 .guide__2145__2p").css({
                top: "82%",
                left: "47%",
              });
            }

            bottomImgEl[idx].classList.add("active");
            audioPlay(conceptContData.contentsAudio[idx]);

            const activeEl = document.querySelectorAll(".bottomImg.active");
            if (activeEl.length === 3) {
              document.querySelector(".answer__2145__box").classList.add("active");
              document.querySelector(".dnd__bottom__wrapper").classList.add("active");
            }
          });
        });
      });
      dndFn();
      $(".dnd__epilogue").addClass("_2145_answer");

      console.log(audioObj);
    },
  },

  //2학년 5차시
  "2_1_5_1": {
    render: () => {
      contentObj = `
          <div class="container">
              <div class="top-area">
                ${conceptContData.img.topImg
                  .map(
                    (item, idx) =>
                      `
                    <div class="topImg" key=${idx} >
                      <img src="${item}" alt="top 이미지"/>
                    </div>
                  `
                  )
                  .join("")}
              </div>

              <div class="bottom-area">
                  <img src="${conceptContData.img.bottomImg}" alt="bottom 이미지"/>
              </div>

              <div class="ani-area">
              ${conceptContData.img.resultImg
                .map(
                  (item, idx) =>
                    `
                  <div class="bottom-ani">
                    <img src="${item}"/>
                  </div>
                  `
                )
                .join("")}
              </div>
          </div>
      `;
      $(".content").addClass("_2_1_5_1");
      $("._2_1_5_1").html(contentObj);
      conCur.Fn2_1_5_1();
    },
    Fn2_1_5_1: () => {
      $(".click__car__character").hide();

      audio.addEventListener("ended", function () {
        clickTouchGuide();

        $(".wrap__handbox__target").css({
          top: "30%",
          left: "34%",
        });
      });

      const topImgEl = document.querySelectorAll(".topImg");
      const bottomEl = document.querySelector(".bottom-area img");
      const bottomImgEl = document.querySelectorAll(".bottom-ani");
      topImgEl.forEach((el, idx) => {
        el.addEventListener("click", function () {
          touchAudio.play();
          el.classList.add("disabled");
          el.classList.add("animated");
          bottomImgEl[idx].classList.add("active");
          bottomEl.src = conceptContData.img.bottomAniImg[idx];
          audioPlay(conceptContData.contentsAudio[idx]);

          if (idx !== 2) {
            audioObj.addEventListener("ended", function () {
              clickTouchGuide();
              if (idx === 0) {
                $(".wrap__handbox__target").css({
                  top: "30%",
                  left: "62%",
                });
              } else {
                $(".wrap__handbox__target").css({
                  top: "30%",
                  left: "77%",
                });
              }
            });
          }
          const activeEl = document.querySelectorAll(".bottom-ani.active");

          if (activeEl.length === 3) {
            nextBtnHandler();
          }
        });
      });
    },
  },

  "2_1_5_2": {
    render: () => {
      contentObj = `
          <div class="container">
              <div class="top-area">
                <img src="${conceptContData.img.topImg}" alt="top 이미지"/>

                <div class="topClick-wrap">
                  ${conceptContData.img.bottomImg
                    .map(
                      (item, idx) =>
                        `
                      <div key=${idx} class="topClick"></div>
                    `
                    )
                    .join("")}
                </div>

              </div>

              <div class="bottom-area">
                ${conceptContData.img.bottomImg
                  .map(
                    (item) =>
                      `
                    <div class="bottom-img">
                      <img src="${item}" alt="bottom 이미지"/>
                    </div>
                  `
                  )
                  .join("")}
              </div>

              <div class="ani-area">
                  <img src="${conceptContData.img.resultImg}" alt="애니메이션 이미지"/>
              </div>
             
          </div> 
      `;
      $(".content").addClass("_2_1_5_2");
      $("._2_1_5_2").html(contentObj);
      conCur.Fn2_1_5_2();
    },
    Fn2_1_5_2: () => {
      $(".click__car__character").hide();

      clickTouchGuide();

      $(".wrap__handbox__target").css({
        top: "30%",
        left: "43%",
      });

      const topImgEl = document.querySelectorAll(".topClick");
      const bottomImgEl = document.querySelectorAll(".bottom-img");
      topImgEl.forEach((el, idx) => {
        el.addEventListener("click", function () {
          touchAudio.play();
          bottomImgEl[idx].classList.add("active");
          audioPlay(conceptContData.contentsAudio[idx]);

          if (idx !== 2) {
            audioObj.addEventListener("ended", function () {
              clickTouchGuide();
              if (idx === 0) {
                $(".wrap__handbox__target").css({
                  top: "30%",
                  left: "48%",
                });
              } else {
                $(".wrap__handbox__target").css({
                  top: "30%",
                  left: "53%",
                });
              }
            });
          }

          const activeEl = document.querySelectorAll(".bottom-img.active");
          if (activeEl.length === 3) {
            audioObj.addEventListener("ended", function () {
              document.querySelector(".ani-area").classList.add("active");
              audioPlay(conceptContData.resultAudio);
              nextBtnHandler();
            });
          }
        });
      });
    },
  },

  "2_1_5_3": {
    render: () => {
      contentObj = `
          <div class="container">
              <div class="top-area">
                <img src="${conceptContData.img.topImg}" alt="top 이미지"/>

                <div class="aniWrap aniWrap2">
                ${conceptContData.img.topCont
                  .map(
                    (item, idx) =>
                      `
                    <span key=${idx}>${item}</span>
                  `
                  )
                  .join("")}
                </div>

              </div>

              <div class="drop-area">
                <ul class="txt-card txt-card1">
                  <li><span>7</span></li>
                  <li><span>4</span></li>
                  <li><span>7</span></li>
                </ul>
                <span>=</span>
                <ul class="txt-card txt-card3">
                  <li><span>7</span></li>
                  <li><span>0</span></li>
                  <li><span>0</span></li>
                </ul>
                <span>+</span>
                <ul class="txt-card txt-card2">
                  <li><span>4</span></li>
                  <li><span>0</span></li>
                </ul>
                <span>+</span>
                <div class="border__styled spacing__question__box droppable" data-val="2">?</div>
              </div>


              <div class="dnd__bottom__wrapper">
                <div class="dnd__btns__bottom"></div>
              </div>
             
          </div> 
      `;
      $(".content").addClass("_2_1_5_3");
      $("._2_1_5_3").html(contentObj);
      conCur.Fn2_1_5_3();
    },
    Fn2_1_5_3: () => {
      $(".click__car__character").hide();
      dndFn();
    },
  },

  //2-1-6 차시
  "2_1_6_1": {
    render: () => {
      contentObj = `
          <div class="container ${conceptContData.contClass}">
              <h2 class="page-tit">
                <img src="../../../COMM/IMG/CONCEPT/2_1_6/LABEL.PNG" alt="연필"/>
                ${conceptContData.aniTxt}씩 뛰어 세기
              </h2>

              <div class="contents-inner">
                <div class="topCont">
                  <div class="topImg">
                    <img src="${conceptContData.topImg}" alt="수직선 이미지"/>
                  </div>
                  <ul class="topTxt" >
                    ${conceptContData.text
                      .map(
                        (item, idx) => `
                      <li key=${idx}>${item}</li>
                    `
                      )
                      .join("")}
                  </ul>
                </div>

                <div class="bottomCont">
                  <p class="question"><span class="q-box q-box-s2">?</span>의 자리 숫자가 1씩 커집니다.</p>

                  <ul class="answerWrap">
                    <li class="answerBtn" key="1">일</li>
                    <li class="answerBtn" key="2">십</li>
                    <li class="answerBtn" key="3">백</li>
                  </ul>
                </div>
              </div>

          </div> 
      `;
      $(".content").addClass("_2_1_6_1");
      $("._2_1_6_1").html(contentObj);
      conCur.Fn2_1_6_1();
    },
    Fn2_1_6_1: () => {
      $(".click__car__character").hide();
      // audioPlay(conceptContData.audio.loadAudio);

      if (audio) {
        audio.addEventListener("ended", function () {
          clickTouchGuide(conceptContData.audio.loadAudio);
        });
      } else {
        clickTouchGuide(conceptContData.audio.loadAudio);
      }

      const topCont = document.querySelector(".topCont");
      const topImgEl = document.querySelector(".topImg");
      const topTxtAniEl = document.querySelectorAll(".topTxt li");

      const aniCont = document.createElement("div");
      aniCont.classList.add("q-ani");

      // 수직선 간격 만큼 div 추가
      const aniContLen = topTxtAniEl.length;

      for (let i = 0; i < aniContLen - 1; i++) {
        const aniBar = document.createElement("div");
        aniBar.classList.add("aniBar");
        aniBar.innerHTML = `
              <span>${conceptContData.aniTxt}</span>
          `;
        aniCont.appendChild(aniBar);
      }

      topCont.appendChild(aniCont);
      const aniBar = document.querySelectorAll(".aniBar");

      aniBar.forEach((el, index) => {
        el.style.width = `calc(100% / ${aniContLen} - 0.1vw)`;
      });

      topCont.addEventListener("click", function () {
        touchAudio.play();
        topCont.classList.add("disabled");

        topTxtAniEl.forEach((el, idx) => {
          setTimeout(() => {
            el.classList.add("animated");
          }, 1200 * idx);
        });
        aniBar.forEach((el, idx) => {
          setTimeout(() => {
            el.classList.add("animated");
          }, 1200 * idx);
        });
        audioPlay(conceptContData.audio.txtAniAudio);

        audioObj.addEventListener("ended", function () {
          aniBar.forEach((el) => el.classList.add("txtOn"));

          audioPlay(conceptContData.audio.LineAniAudio);

          audioObj.addEventListener("ended", function () {
            document.querySelector(".bottomCont").classList.add("active");

            clickTouchGuide();
            document.querySelectorAll(".overlay__guide__wrap").forEach((el) => {
              el.classList.add("guide02");
            });

            const answerBtnEl = document.querySelectorAll(".answerBtn");
            const answerBox = document.querySelector(".q-box");

            answerBtnEl.forEach((el) => {
              el.classList.add("ready");
              el.addEventListener("click", function () {
                touchAudio.play();
                answerBtnEl.forEach((el) => {
                  el.classList.remove("ready");
                  el.classList.remove("active");
                });
                el.classList.add("active");

                if (conceptContData.answerIdx.toString() === el.getAttribute("key")) {
                  answerBox.innerText = el.innerText;
                  audioPlay(answerAudio);
                  audioObj.addEventListener("ended", function () {
                    audioPlay(conceptContData.correctAudio);
                    topTxtAniEl.forEach((el) => {
                      el.classList.add("scaleAni");
                    });

                    if (conceptContData.contClass === "cont2_1_6_3") {
                      audioObj.addEventListener("ended", function () {
                        page3Event();
                      });
                    } else {
                      nextBtnHandler();
                    }
                  });
                  document.querySelector(".answerWrap").style.display = "none";
                } else {
                  audioPlay(wrongAudio);
                  audioObj.addEventListener("ended", function () {
                    audioPlay(conceptContData.wrong.audio);
                  });

                  setTimeout(() => {
                    el.classList.remove("active");
                  }, 1000);

                  const hintEl = document.createElement("div");
                  hintEl.classList.add("hint-desc");

                  hintEl.innerHTML = `
                      <img src="../../../COMM/IMG/CHARACTER_S.PNG" alt="캐릭터"/>
                      <div class="hint-bubble">
                          ${conceptContData.wrong.txt}
                      </div>
                    `;
                  document.querySelector(".container").appendChild(hintEl);
                }
              });
            });
          });
        });
      });

      function page3Event() {
        const aniBar = document.createElement("div");
        aniBar.classList.add("aniBar");
        aniBar.classList.add("txtOn");
        aniBar.innerHTML = `
            <span>${conceptContData.aniTxt}</span>
        `;
        aniCont.classList.add("ani2");
        aniCont.appendChild(aniBar);

        aniBar.style.width = `calc(100% / ${aniContLen} - 0.1vw)`;
        setTimeout(() => {
          aniBar.classList.add("animated");
        }, 1000);

        const page3Txt = document.createElement("li");
        page3Txt.classList.add("page3Txt");

        page3Txt.innerHTML = `
          1000
        `;

        document.querySelector(".topTxt").appendChild(page3Txt);

        const bottomEl = document.querySelector(".bottomCont");
        bottomEl.innerHTML = `
          ${conceptContData.resultTxt.map((item) => `<p class="resultTxt">${item}</p>`).join("")}
        `;

        audioPlay(conceptContData.audio.resultAudio);
        const resultTxtEl = document.querySelectorAll(".resultTxt");
        setTimeout(() => {
          page3Txt.classList.add("scaleAni");
          resultTxtEl[0].classList.add("scaleAni");

          setTimeout(() => {
            resultTxtEl[1].classList.add("scaleAni");
          }, 2000);
        }, 4000);

        audioObj.addEventListener("ended", function () {
          const descCont = document.querySelector(".cont2_1_6_3");
          descCont.innerHTML = `
            <div class="desc-TxtWrap">
            ${conceptContData.descTxt
              .map(
                (item) =>
                  `
                <p class="resultTxt">${item}</p>
              `
              )
              .join("")}
            </div>
          `;

          descCont.classList.add("desc");
          const descTxtEl = document.querySelectorAll(".desc-TxtWrap .resultTxt");
          audioPlay(conceptContData.descAudio[0]);

          audioObj.addEventListener("ended", function () {
            audioPlay(conceptContData.descAudio[1]);
            descTxtEl.forEach((el, idx) => {
              setTimeout(() => {
                el.classList.add("scaleAni");
              }, idx * 5500);
            });
            audioObj.addEventListener("ended", function () {
              nextBtnHandler();
            });
          });
        });
      }
    },
  },
  "2_1_6_2": {
    render: () => {
      contentObj = `
          <div class="container ${conceptContData.contClass}">
              <h2 class="page-tit">
                <img src="../../../COMM/IMG/CONCEPT/2_1_6/LABEL.PNG" alt="연필"/>
                거꾸로 뛰어 세기
              </h2>

              <div class="contents-inner">
                <div class="topCont">
                  <div class="topImg">
                    <img src="${conceptContData.topImg}" alt="수직선 이미지"/>
                  </div>
                  <ul class="topTxt" >
                    ${conceptContData.text
                      .map(
                        (item, idx) => `
                      <li key=${idx}>${item}</li>
                    `
                      )
                      .join("")}
                  </ul>
                </div>

                <div class="bottomCont">
                  <div class="question">
                    <p><span class="no-margin">백</span>의 자리 숫자가 1씩 <span>작아집니다.</span></p>
                    <p>
                    <span class="arrow"><img src="../../../COMM/IMG/CONCEPT/2_1_6/ARROW.PNG" alt="화살표"/></span>
                    <span class="q-box q-box-s no-margin">?</span>씩 거꾸로 뛰어 세었습니다.
                    </p>
                  </div>

                  <ul class="answerWrap">
                    <li class="answerBtn" key="1">1</li>
                    <li class="answerBtn" key="2">10</li>
                    <li class="answerBtn" key="3">100</li>
                  </ul>
                </div>


              </div>

          </div> 
      `;
      $(".content").addClass("_2_1_6_2");
      $("._2_1_6_2").html(contentObj);
      conCur.Fn2_1_6_2();
    },
    Fn2_1_6_2: () => {
      $(".click__car__character").hide();
      // audioPlay(conceptContData.audio.loadAudio);

      audio.addEventListener("ended", function () {
        clickTouchGuide(conceptContData.audio.loadAudio);
      });

      const topCont = document.querySelector(".topCont");
      const topImgEl = document.querySelector(".topImg");
      const topTxtAniEl = document.querySelectorAll(".topTxt li");
      const bottomTxt = document.querySelectorAll(".question p");

      const aniCont = document.createElement("div");
      aniCont.classList.add("q-ani");

      // 수직선 간격 만큼 div 추가
      const aniContLen = topTxtAniEl.length;

      for (let i = 0; i < aniContLen - 1; i++) {
        const aniBar = document.createElement("div");
        aniBar.classList.add("aniBar");
        aniBar.innerHTML = `
              <span>${conceptContData.aniTxt}</span>
          `;
        aniCont.appendChild(aniBar);
      }

      topCont.appendChild(aniCont);
      const aniBar = document.querySelectorAll(".aniBar");

      aniBar.forEach((el, index) => {
        el.style.width = `calc(100% / 4 - 0.1vw)`;
      });

      topCont.addEventListener("click", function () {
        touchAudio.play();
        topCont.classList.add("disabled");

        aniBar.forEach((el, idx) => {
          setTimeout(() => {
            el.classList.add("animated");
          }, 1700 * idx);
        });
        audioPlay(conceptContData.audio.LineAniAudio);

        audioObj.addEventListener("ended", function () {
          aniBar.forEach((el) => el.classList.add("txtOn"));

          bottomTxt[0].classList.add("active");
          const scaleAniEl = bottomTxt[0].querySelectorAll("span");

          topTxtAniEl.forEach((el, idx) => {
            setTimeout(() => {
              el.classList.add("animated");

              if (idx === 0) {
                scaleAniEl[0].classList.add("scaleAni");
              } else if (idx === 3) {
                scaleAniEl[1].classList.add("scaleAni");
              }
            }, 1000 * idx);
          });
          audioPlay(conceptContData.audio.txtAniAudio);

          audioObj.addEventListener("ended", function () {
            setTimeout(() => {
              document.querySelector(".answerWrap").classList.add("active");
              bottomTxt[1].classList.add("active");
            }, 3000);

            const answerBtnEl = document.querySelectorAll(".answerBtn");
            const answerBox = document.querySelector(".q-box");

            answerBtnEl.forEach((el) => {
              el.classList.add("ready");
              el.addEventListener("click", function () {
                touchAudio.play();
                answerBtnEl.forEach((el) => {
                  el.classList.remove("ready");
                  el.classList.remove("active");
                });
                el.classList.add("active");

                if (conceptContData.answerIdx.toString() === el.getAttribute("key")) {
                  answerBtnEl.forEach((el) => {
                    el.classList.add("off");
                  });
                  el.classList.add("active");
                  document.querySelector(".answerWrap").classList.add("disabled");
                  document.querySelector(".answerWrap").style.opacity = 0;
                  answerBox.innerText = el.innerText;
                  audioPlay(answerAudio);
                  audioObj.addEventListener("ended", function () {
                    audioPlay(conceptContData.correctAudio);
                    audioObj.addEventListener("ended", function () {
                      stopTopContEl.innerHTML = `
                            <div>
                              <img src="${conData.stop.topImg}" alt="수직선 이미지"/>
                            </div>
                    
                            <ul class="topTxt" >
                              ${conData.stop.stopCont.map((item, idx) => `<li class="topTxtAni ${idx > 2 ? "q-box q-box-s" : ""}">${item}</li>`).join("")}
                            </ul>
                    
                            <div class="q-ani">
                                <div class="aniBar"><span>10</span></div>
                                <div class="aniBar"><span>10</span></div>
                                <div class="aniBar"><span>10</span></div>
                                <div class="aniBar"><span>10</span></div>
                            </div>
                          
                          `;
                      showConceptPage(stopTopContEl);

                      const qBoxEl = document.querySelectorAll(".q-box");

                      qBoxEl.forEach((el) => {
                        el.innerText = "?";
                      });
                    });
                  });
                } else {
                  audioPlay(wrongAudio);
                  audioObj.addEventListener("ended", function () {
                    audioPlay(conceptContData.wrongAudio);
                  });
                  setTimeout(() => {
                    el.classList.remove("active");
                  }, 1000);
                }
              });
            });
          });
        });
      });
    },
  },

  // 2-1-7 차시
  "2_1_7_1": {
    render: () => {
      contentObj = `
          <div class="container ${conceptContData.contClass}">
              <div class="top-cont">
                ${conceptContData.img
                  .map(
                    (item) =>
                      `
                    <div key=${item.id}>
                        <div class="top-img">
                          <img src="${item.topImg}" alt="top 이미지" class="on1"/>
                          <img src="${item.topImg2}" alt="top 이미지" class="on2"/>
                        </div>

                        <div class="bottom-img">
                          <img src="../../../COMM/IMG/CONCEPT/2_1_7/BOTTOM_BG.PNG" alt="top 이미지"/>

                          <div class="bottom-cont">
                            ${item.bottomCont
                              .map(
                                (el, idx) =>
                                  `
                                <div class="figureCont">
                                  <img src="${el}" alt="도형 이미지" class="figure"/>

                                  ${
                                    item.bottomOn.idx === idx + 1
                                      ? `
                                    <img src="${item.bottomOn.img}" alt="도형 색망 이미지" class="bottom-ani"/>
                                  `
                                      : ``
                                  }
                                </div>
                              `
                              )
                              .join("")}
                          </div>
                        </div>
                    </div>
                  `
                  )
                  .join("")}

                <div class="q-box q-box-o">?</div>
              </div>

              <ul class="answerWrap">
                ${conceptContData.answerList
                  .map(
                    (item, idx) =>
                      `
                    <li class="answerBtn" key=${idx + 1}>
                      ${item === "작다" ? ">" : "<"}
                    </li>
                  `
                  )
                  .join("")}
              </ul>
          
          </div> 
      `;

      $(".content").addClass("_2_1_7_1");
      $("._2_1_7_1").html(contentObj);
      conCur.Fn2_1_7_1();
    },
    Fn2_1_7_1: () => {
      $(".click__car__character").hide();

      if (audio) {
        audio.addEventListener("ended", function () {
          clickTouchGuide(conceptContData.audio.loadAudio);
        });
      } else {
        clickTouchGuide(conceptContData.audio.loadAudio);
      }

      const topImgEl = document.querySelectorAll(".top-img");
      const bottomImgEl = document.querySelectorAll(".bottom-img");
      topImgEl.forEach((el, idx) => {
        el.addEventListener("click", function () {
          touchAudio.play();
          el.classList.add("disabled");
          bottomImgEl[idx].classList.add("active");

          const figureImgEl = bottomImgEl[idx].querySelectorAll(".figure");

          figureImgEl.forEach((el, idx) => {
            setTimeout(() => {
              el.classList.add("scaleAni");
            }, 2000 * (idx + 1));
          });

          audioPlay(conceptContData.img[idx].audio);

          if (idx !== 1) {
            audioObj.addEventListener("ended", function () {
              clickTouchGuide();
              $(".wrap__handbox__target").css({
                top: "24%",
                left: "68%",
              });
            });
          }

          const activeEl = document.querySelectorAll(".bottom-img.active");

          if (activeEl.length === 2) {
            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.audio.questionAudio);
              clickTouchGuide();
              $(".wrap__handbox__target").css("display", "none");

              document.querySelector(".q-box").classList.add("active");
              document.querySelector(".answerWrap").classList.add("active");
            });
          }
        });
      });

      const answerBtnEl = document.querySelectorAll(".answerBtn");
      const answerBox = document.querySelector(".q-box");

      answerBtnEl.forEach((el) => {
        el.classList.add("ready");
        el.addEventListener("click", function () {
          touchAudio.play();
          answerBtnEl.forEach((el) => {
            el.classList.remove("ready");
            el.classList.remove("active");
          });
          el.classList.add("active");

          if (conceptContData.answerIdx.toString() === el.getAttribute("key")) {
            document.querySelector(".answerWrap").classList.add("disabled");
            document.querySelector(".answerWrap").classList.remove("active");
            answerBox.innerText = el.innerText;

            audioPlay(answerAudio);
            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.correctAudio);
              topImgEl.forEach((el) => el.classList.add("on"));
              bottomImgEl.forEach((el) => el.classList.add("on"));
            });

            // 정답 시 페이지 다음으로 넘어가기 활성화
            if (!conData.stop) {
              nextBtnHandler();
            } else {
              showConceptPage();
            }
          } else {
            audioPlay(wrongAudio);

            setTimeout(() => {
              answerBtnEl.forEach((el) => {
                el.classList.remove("active");
              });
            }, 1000);
            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.wrongAudio);
            });
          }
        });
      });
    },
  },

  "2_1_7_2": {
    render: () => {
      contentObj = `
          <div class="container ${conceptContData.contClass}">
            <div class="top-cont">

              <ul class="txt-btnWrap">
                ${conceptContData.text
                  .map(
                    (item, idx) =>
                      `<li>
                    <p class="txtBtn txtBtn${idx + 1}">${item}</p>
                    <span class="arrow"><img src="../../../COMM/IMG/CONCEPT/2_1_6/ARROW.PNG" alt="화살표"/></span>
                  </li>`
                  )
                  .join("")}

                <li class="firstBtn"></li>
              </ul>

              <div class="top-table">
                <div class="t-row t-head">
                  <div class="td">백의 자리</div>
                  <div class="td">십의 자리</div>
                  <div class="td">일의 자리</div>
                </div>
                <div class="t-body">
                  ${conceptContData.txtBox
                    .map(
                      (item) =>
                        `
                    <div class="t-row">
                      ${item.txtList
                        .map(
                          (el, i) => `
                        <div class="td td${i + 1}"><span>${el}</span></div>
                      `
                        )
                        .join("")}
                    </div>
                    `
                    )
                    .join("")}
                </div>
              </div>

            </div>

            <div class="bottom-cont">
              <div class="q-area">
                  <p>가장 큰 수는 <span class="border__styled spacing__question__box--smallsize spacing__question__box droppable" data-val="2">?</span> 입니다.</p>
                  <p>가장 작은 수는 <span class="border__styled spacing__question__box--smallsize spacing__question__box droppable" data-val="1">?</span> 입니다.</p>
              </div>

              <div class="dnd__bottom__wrapper">
                <div class="dnd__btns__bottom">
                </div>
              </div>
            </div>

          </div> 
      `;
      $(".content").addClass("_2_1_7_2");
      $("._2_1_7_2").html(contentObj);
      conCur.Fn2_1_7_2();
    },
    Fn2_1_7_2: () => {
      $(".click__car__character").hide();

      audio.addEventListener("ended", function () {
        clickTouchGuide(conceptContData.audio.loadAudio);
        $(".guide__wrap__handbox").css("display", "none");
        document.querySelector(".txtBtn2").classList.add("ready");
        document.querySelector(".txtBtn3").classList.add("ready");
        audioObj.addEventListener("ended", function () {
          document.querySelector(".txtBtn2").classList.remove("ready");
          document.querySelector(".txtBtn3").classList.remove("ready");
        });
      });

      const firstBtn = document.querySelector(".firstBtn");
      const tRowEl = document.querySelectorAll(".t-body .t-row");

      firstBtn.addEventListener("click", function () {
        touchAudio.play();
        document.querySelector(".txtBtn2").classList.remove("ready");
        document.querySelector(".txtBtn3").classList.remove("ready");
        firstBtn.classList.add("disabled");
        audioPlay(conceptContData.audio.txtAniAudio);
        tRowEl[1].classList.add("active");
        tRowEl[2].classList.add("active");

        const tdAni01 = document.querySelectorAll(".active .td1");
        const tdAni02 = document.querySelectorAll(".active .td2");
        const tdAni03 = document.querySelectorAll(".active .td3");
        tdAni01.forEach((el) => {
          el.classList.add("blinkAni");
        });
        tdAni02.forEach((el) => {
          el.classList.add("blinkAni");
        });

        setTimeout(() => {
          tdAni03.forEach((el) => {
            el.classList.add("scaleAni");
          });
        }, 6000);

        audioObj.addEventListener("ended", function () {
          audioPlay(conceptContData.audio.txtAni2Audio);
          audioObj.addEventListener("ended", function () {
            clickTouchGuide();
            document.querySelectorAll(".overlay__guide__wrap").forEach((el) => {
              el.classList.add("guide02");
              document.querySelector(".txtBtn1").classList.add("ready");
            });
          });
        });
      });

      document.querySelector(".txtBtn1").addEventListener("click", function () {
        touchAudio.play();
        this.classList.add("disabled");
        this.classList.remove("ready");
        tRowEl[0].classList.add("active");
        tRowEl[0].classList.add("scaleAni");

        audioPlay(conceptContData.audio.txtAni3Audio);
        document.querySelector(".bottom-cont").classList.add("active");

        dndFn();
      });
    },
  },

  // 사용 안함 ?
  "2_1_2_61": {
    render: () => {
      contentObj = `
          <div class="container ${conceptContData.contClass}">
            <div class="top-cont">

              <ul class="txt-btnWrap">
                ${conceptContData.text
                  .map(
                    (item, idx) =>
                      `<li>
                    <p class="txtBtn txtBtn${idx + 1}">${item}</p>
                    <span class="arrow"><img src="../../../COMM/IMG/CONCEPT/2_1_6/ARROW.PNG" alt="화살표"/></span>
                  </li>`
                  )
                  .join("")}

                <li class="firstBtn"></li>
              </ul>

              <div class="top-table">
                <div class="t-row t-head">
                  <div class="td">백의 자리</div>
                  <div class="td">십의 자리</div>
                  <div class="td">일의 자리</div>
                </div>
                <div class="t-body">
                  ${conceptContData.txtBox
                    .map(
                      (item) =>
                        `
                    <div class="t-row">
                      ${item.txtList
                        .map(
                          (el, idx) => `
                        <div class="td td${idx}">${el}</div>
                      `
                        )
                        .join("")}
                    </div>
                    `
                    )
                    .join("")}
                </div>
              </div>

            </div>

            <div class="bottom-cont">
              <div class="q-area">
                  <p>가장 큰 수는 <span class="border__styled spacing__question__box--smallsize spacing__question__box droppable" data-val="2">?</span> 입니다.</p>
                  <p>가장 작은 수는 <span class="border__styled spacing__question__box--smallsize spacing__question__box droppable" data-val="1">?</span> 입니다.</p>
              </div>

              <div class="dnd__bottom__wrapper">
                <div class="dnd__btns__bottom">
                </div>
              </div>
            </div>

          </div> 
      `;
      $(".content").addClass("_2_1_7_2");
      $("._2_1_7_2").html(contentObj);
      conCur.Fn2_1_7_2();
    },
    Fn2_1_7_2: () => {
      $(".click__car__character").hide();

      audio.addEventListener("ended", function () {
        clickTouchGuide(conceptContData.audio.loadAudio);
      });

      const firstBtn = document.querySelector(".firstBtn");
      const tRowEl = document.querySelectorAll(".t-body .t-row");
      firstBtn.addEventListener("click", function () {
        touchAudio.play();
        firstBtn.classList.add("disabled");
        audioPlay(conceptContData.audio.txtAniAudio);
        tRowEl[1].classList.add("active");
        tRowEl[2].classList.add("active");

        audioObj.addEventListener("ended", function () {
          audioPlay(conceptContData.audio.txtAni2Audio);
          audioObj.addEventListener("ended", function () {
            clickTouchGuide();
            document.querySelectorAll(".overlay__guide__wrap").forEach((el) => {
              el.classList.add("guide02");
            });
          });
        });
      });

      document.querySelector(".txtBtn1").addEventListener("click", function () {
        touchAudio.play();
        this.classList.add("disabled");
        tRowEl[0].classList.add("active");
        audioPlay(conceptContData.audio.txtAni3Audio);
        document.querySelector(".bottom-cont").classList.add("active");

        dndFn();
      });
    },
  },

  // 2-2-2차시, 3차시, 4차시
  "2_2_2_1_1": {
    render: () => {
      contentObj = `
      
        <div class="canvas-container">
          <canvas id="canvas" class="canvas" ></canvas>

          <div class="canvas__bg__write active ${conceptContData.canvasClass}">
            <img src="${conceptContData.canvasGIF}" class="canvasGif"/>
            <button class="canvas__arrow__btn">
              <img src="${conceptContData.canvasArrowImg}" />
            </button>
          </div>
        </div>
      
      `;
      $(".content").addClass("cont2_2_2_1_1");
      $(".cont2_2_2_1_1").html(contentObj);

      conCur.cont2_2_2_1();
    },
    cont2_2_2_1: () => {
      if (audio) {
        audio.addEventListener("ended", function () {
          audioPlay(conceptContData.loadAudio);

          clickTouchGuide();
          document.querySelector(".overlay__guide__wrap").style.opacity = 0;
        });

        console.log("캔버스 이벤트");
        let writeChecked = true;
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        let drawImage = new Image();
        let imgUrl = conceptContData.canvasBg;

        setTimeout(() => {
          document.querySelector(".canvas__bg__write").classList.remove("active");
        }, 3000);

        drawImage.src = imgUrl;
        drawImage.onload = () => {
          // canvas.width = drawImage.width;
          // canvas.height = drawImage.height;

          canvas.setAttribute("width", drawImage.width);
          canvas.setAttribute("height", drawImage.height);
          ctx.drawImage(drawImage, 0, 0);

          ctx.globalCompositeOperation = "source-atop";
          pattern = ctx.createPattern(drawImage, "no-repeat");

          ctx.strokeStyle = "black";
          ctx.lineWidth = 30;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
        };

        let painting = false;

        function startPainting(event) {
          touchAudio.play();
          painting = true;
          document.querySelector(".canvas__arrow__btn").style.display = "none";
        }

        function stopPainting(event) {
          painting = false;
          ctx.beginPath();

          // 최초 1회만 정답 시 오디오재생
          if (writeChecked) {
            audioPlay(answerAudio);

            writeChecked = false;
            // canvas.classList.add('disabled');
          }

          // 오디오 끝나면 다음버튼, 맨마지막 페이지일 시 종류 함수실행
          audioObj.addEventListener("ended", function () {
            nextBtnHandler();
          });
        }

        function onMouseMove(event) {
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
      }
    },
  },

  "2_2_2_1_2": {
    render: () => {
      contentObj = `
        <div class="top-img">
        
          <img src="${conceptContData.topImg}" alt="도형이미지"/>
          <div class="aniCont aniCont01"><img src="${conceptContData.topAniImg01}" alt="변 강조 이미지"/></div>
          <div class="aniCont aniCont02"><img src="${conceptContData.topAniImg02}" alt="꼭지점 강조 이미지"/></div>
        </div>
      `;

      $(".content").addClass("cont2_2_2_1_2");
      $(".content").addClass(conceptContData.pageClass);
      $(".cont2_2_2_1_2").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_2_1_2();
        });
      } else {
        conCur.cont2_2_2_1_2();
      }
    },
    cont2_2_2_1_2: () => {
      clickTouchGuide();
      const contentEl = document.querySelector(".content");
      audioPlay(conceptContData.loadAudio);

      audioObj.addEventListener("ended", function () {
        audioPlay(conceptContData.answerAudio);
        const topAniImgEl = document.querySelectorAll(".aniCont");
        topAniImgEl.forEach((el, idx) => {
          setTimeout(() => {
            el.classList.add("active");
          }, 4000 * idx + 1);
        });

        audioObj.addEventListener("ended", function () {
          contentEl.innerHTML = `
            <div class="top-img02"><img src="${conceptContData.topImg02}" alt="도형이미지"/></div>
            <h2 class="txt-wrap">그림과 같은 모양의 도형을 <span>${conceptContData.txt}</span>이라고 합니다.</h2>
          `;
          audioPlay(conceptContData.loadAudio02);
          const txtWrap = document.querySelector(".txt-wrap");
          audioObj.addEventListener("ended", function () {
            txtWrap.classList.add("active");
            audioPlay(conceptContData.answerAudioList[0]);
            audioObj.addEventListener("ended", function () {
              txtWrap.querySelector("span").classList.add("active");
              audioPlay(conceptContData.answerAudioList[1]);

              audioObj.addEventListener("ended", function () {
                nextBtnHandler();
              });
            });
          });
        });
      });
    },
  },

  "2_2_2_1_3": {
    render: () => {
      contentObj = `
        <div class="cont-topWrap"></div>
        <canvas id="drawCanvas" width="1280" height="800"></canvas>
      `;

      $(".content").addClass("cont2_2_2_1_3");
      $(".content").addClass(conceptContData.pageClass);
      $(".cont2_2_2_1_3").html(contentObj);

      drawFigureEvent();
      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_2_1_3();
        });
      } else {
        conCur.cont2_2_2_1_3();
      }
    },
    cont2_2_2_1_3: () => {
      clickTouchGuide();
      audioPlay(conceptContData.loadAudio);
    },
  },

  "2_2_2_1_4": {
    render: () => {
      contentObj = `
        <div class="top-img">
          <img src="${conceptContData.topImg}" alt="도형이미지"/>
          <button class="aniBtn aniBtn01"></button>
          <button class="aniBtn aniBtn02 disabled"></button>

          <div class="topAniWrap topAniWrap01">
            <h3>곧은 선은 <span>변</span></h3>
          </div>
          <div class="topAniWrap topAniWrap02">
            <h3>곧은 선 2개가<br/>만나는 점은 <span>꼭짓점</span></h3>
          </div>
        </div>
      `;

      $(".content").addClass("cont2_2_2_1_4");
      $(".content").addClass(conceptContData.pageClass);
      $(".cont2_2_2_1_4").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_2_1_4();
        });
      } else {
        conCur.cont2_2_2_1_4();
      }
    },
    cont2_2_2_1_4: () => {
      audioPlay(conceptContData.loadAudioList[0]);

      clickTouchGuide();

      if (conceptContData.pageClass === "triangle") {
        $(".wrap__handbox__target").css({
          top: "39%",
          left: "37%",
        });
      } else if (conceptContData.pageClass === "square") {
        $(".wrap__handbox__target").css({
          top: "39%",
          left: "34%",
        });
      }

      const aniBtnEl = document.querySelectorAll(".aniBtn");
      const aniContEl = document.querySelectorAll(".topAniWrap");
      const aniTxtEl = document.querySelectorAll(".topAniWrap h3");

      aniBtnEl.forEach((el, idx) => {
        el.addEventListener("click", function () {
          touchAudio.play();
          el.classList.add("disabled");
          aniContEl[idx].classList.add("active");
          audioPlay(conceptContData.answerAudioList[idx]);

          audioObj.addEventListener("ended", function () {
            aniTxtEl[idx].classList.add("active");

            if (idx === 0) {
              audioPlay(conceptContData.loadAudioList[idx + 1]);
              aniBtnEl[idx + 1].classList.remove("disabled");
              clickTouchGuide();
              if (conceptContData.pageClass === "triangle") {
                $(".wrap__handbox__target").css({
                  top: "48%",
                  left: "55%",
                });
              } else if (conceptContData.pageClass === "square") {
                $(".wrap__handbox__target").css({
                  top: "49%",
                  left: "55%",
                });
              }
            } else {
              nextBtnHandler();
            }
          });
        });
      });
    },
  },

  "2_2_2_1_5": {
    render: () => {
      contentObj = `
        <div class="top-img"> 
          <div class="top_btn">
            <img src="${conceptContData.topImgL}" alt="도형이미지"/>
            <div class="topAni topAni01"><img src="${conceptContData.topAni01}" alt="변 설명"/></div>
          </div>
          <div class="top_btn">
            <img src="${conceptContData.topImgR}" alt="도형이미지"/>
            <div class="topAni topAni02"><img src="${conceptContData.topAni02}" alt="꼭지점 설명"/></div>
          </div>
     
        </div>
        <div>
        </div>
      `;

      $(".content").addClass("cont2_2_2_1_5");
      $(".content").addClass(conceptContData.pageClass);
      $(".cont2_2_2_1_5").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_2_1_5();
        });
      } else {
        conCur.cont2_2_2_1_5();
      }
    },
    cont2_2_2_1_5: () => {
      audioPlay(conceptContData.loadAudio);
      clickTouchGuide();
      $(".wrap__handbox__target").css({
        top: "42%",
        left: "30%",
      });

      const contentEl = document.querySelector(".content");
      const topBtnEl = document.querySelectorAll(".top_btn");
      const topAniEl = document.querySelectorAll(".topAni");

      topBtnEl.forEach((el, idx) => {
        el.addEventListener("click", function () {
          touchAudio.play();
          function playAudioSequence(audioList, idx) {
            audioPlay(audioList[0]);
            audioObj.addEventListener("ended", function () {
              audioPlay(audioList[1]);

              if (idx === 0) {
                changeImg(conceptContData.top01ImgAniList, idx);
                audioObj.addEventListener("ended", function () {
                  clickTouchGuide();
                  $(".wrap__handbox__target").css({
                    top: "42%",
                    left: "63%",
                  });
                });
              } else {
                changeImg(conceptContData.top02ImgAniList, idx);

                audioObj.addEventListener("ended", function () {
                  audioPlay(conceptContData.answerAudio);

                  audioObj.addEventListener("ended", function () {
                    console.log("다음 화면으로 전환");

                    contentEl.innerHTML = `
                      <div class="top-img02">
                        <img src="${conceptContData.topImg02}" alt="도형이미지"/>
                        <h3 class="txtWrap">${conceptContData.txt}</h3>
                      </div>
                      <div class="bottom-txt">
                      ${conceptContData.descList
                        .map(
                          (item, idx) =>
                            `
                          <h2 class="b-txt${idx + 1}">${item}</h2>
                          
                          `
                        )
                        .join("")}
                      </div>
                    `;

                    const txtBox = document.querySelector(".txtWrap");
                    const descTxt01 = document.querySelectorAll(".b-txt1 span");
                    const descTxt02 = document.querySelectorAll(".b-txt2 span");
                    audioPlay(conceptContData.descAudioList[0]);
                    setTimeout(() => {
                      descTxt01[0].classList.add("active");
                      setTimeout(() => {
                        descTxt01[1].classList.add("active");
                        txtBox.classList.add("active");
                      }, 2000);
                    }, 7000);

                    audioObj.addEventListener("ended", function () {
                      audioPlay(conceptContData.descAudioList[1]);

                      setTimeout(() => {
                        descTxt02[0].classList.add("active");
                        setTimeout(() => {
                          descTxt02[1].classList.add("active");
                          setTimeout(() => {
                            descTxt02.forEach((el) => {
                              el.classList.remove("active");
                            });
                            setTimeout(() => {
                              descTxt02.forEach((el) => {
                                el.classList.add("active");
                              });
                            }, 2500);
                          }, 2000);
                        }, 2000);
                      }, 2000);

                      audioObj.addEventListener("ended", function () {
                        nextBtnHandler();
                      });
                    });
                  });
                });
              }
            });
          }

          function changeImg(imgList, idx) {
            imgList.forEach((src, i) => {
              setTimeout(() => {
                el.querySelector("img").src = src;
                if (i === imgList.length - 1) {
                  topAniEl[idx].classList.add("active");
                }
              }, 1000 * i);
            });
          }

          if (idx === 0) {
            playAudioSequence(conceptContData.answerAudio01List, idx);
          } else {
            playAudioSequence(conceptContData.answerAudio02List, idx);
          }
        });
      });
    },
  },

  "2_2_2_2_1": {
    render: () => {
      contentObj = `
        <div class="answerWrap">
          ${conceptContData.answerList
            .map(
              (item) =>
                `
              <div class="answerBtn" data-index=${item.id} value=${item.val}>
                <img src="${item.img}" alt="보기"/>
              </div>
            `
            )
            .join("")}
        </div>
      `;

      $(".content").addClass("cont2_2_2_2_1");
      $(".cont2_2_2_2_1").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_2_2_1();
        });
      } else {
        conCur.cont2_2_2_2_1();
      }
    },
    cont2_2_2_2_1: () => {
      clickTouchGuide();
      $(".wrap__handbox__target").css("display", "none");

      audioPlay(conceptContData.loadAudio);

      const answerBtnEl = document.querySelectorAll(".answerBtn");

      answerBtnEl.forEach((el) => {
        el.classList.add("ready");
        const correctVal = el.getAttribute("value");

        el.addEventListener("click", function () {
          touchAudio.play();
          answerBtnEl.forEach((el) => {
            el.classList.remove("ready");
          });
          el.classList.add("active");

          if (correctVal === "true") {
            console.log("정답");
            audioPlay(answerAudio);
            // audioObj.addEventListener('ended', function(){
            //   audioPlay(conceptContData.answerAudio);
            // })

            el.classList.add("disabled");
            el.classList.add("correct");
          } else {
            console.log("오답");

            audioPlay(wrongAudio);
            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.wrongAudio);
            });
            setTimeout(() => {
              el.classList.remove("active");
            }, 1000);
          }

          const correctEl = document.querySelectorAll(".answerBtn.correct");

          if (correctEl.length === 2) {
            document.querySelector(".answerWrap").classList.add("disabled");
            audioObj.addEventListener("ended", function () {
              nextBtnHandler();
            });
          }
        });
      });
    },
  },

  "2_2_2_2_2": {
    render: () => {
      contentObj = `
        <div class="cont-topWrap">
          ${conceptContData.answerList
            .map(
              (item) =>
                `
              <div class="answerBtn" data-index=${item.id} value=${item.val}>
                <img src="${item.img}" alt="보기"/>
              </div>
            `
            )
            .join("")}
        </div>
      `;

      $(".content").addClass("cont2_2_2_2_2");
      $(".cont2_2_2_2_2").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_2_2_2();
        });
      } else {
        conCur.cont2_2_2_2_2();
      }
    },
    cont2_2_2_2_2: () => {
      clickTouchGuide();

      audioPlay(conceptContData.loadAudio);

      const contImgEl = document.querySelectorAll(".answerBtn");

      function changeImgNAudio(index) {
        audioPlay(conceptContData.answerAudioList[index]);
        contImgEl[index].querySelector("img").src = conceptContData.answerList[index].onImg;

        audioObj.addEventListener("ended", function () {
          if (index !== 3) {
            changeImgNAudio(index + 1);
          } else {
            nextBtnHandler();

            if (isStopElement) {
              stopTopContEl.innerHTML = `
                  <div class="stop_img ${conceptContData.pageClass}">
                    <img src="${conData.stop.topImg}" alt="top_img"/>

                    ${conData.stop.topAniImgList
                      .map(
                        (item) =>
                          `<div class="aniWrap aniWrap${item.id}">
                         <img src="${item.aniImg}" class="top_aniImg"/>
                         <img src="${item.txtImg}" class="top_txt_aniImg"/>
                      </div>`
                      )
                      .join("")}
                  </div>
                `;

              showConceptPage(stopTopContEl);
            }
          }
        });
      }

      audioObj.addEventListener("ended", function () {
        changeImgNAudio(0);
      });
    },
  },

  // 2-2-4차시
  "2_2_4_1_3": {
    render: () => {
      contentObj = `
        <div class="content-container">
          ${conceptContData.imgList
            .map(
              (item) =>
                `
              <div class="contentWrap">
                <div class="topBtn disabled"><img src="${item.topImg}" alt="상단 이미지"/></div>

                <div class="arrow"><img src="../../../COMM/IMG/CONCEPT/2_2_4/ARROW.PNG"/></div>

                <div class="bottomCont"><img src="${item.bottomImg}" alt="하단 이미지"/></div>
              </div>
          
            `
            )
            .join("")}
        </div>
      `;

      $(".content").addClass("cont2_2_2_4_3");
      $(".cont2_2_2_4_3").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_4_3();
        });
      } else {
        conCur.cont2_2_4_3();
      }
    },
    cont2_2_4_3: () => {
      clickTouchGuide();

      $(".wrap__handbox__target").css({
        top: "35%",
        left: "34%",
      });

      audioPlay(conceptContData.loadAudio);

      const contentEl = document.querySelectorAll(".contentWrap");
      const topBtnEl = document.querySelectorAll(".topBtn");

      topBtnEl[0].classList.remove("disabled");
      topBtnEl.forEach((el, idx) => {
        el.addEventListener("click", function () {
          touchAudio.play();
          el.classList.add("disabled");

          contentEl[idx].classList.add("active");
          audioPlay(conceptContData.answerAudioList[idx]);

          audioObj.addEventListener("ended", function () {
            if (idx === 1) {
              audioPlay(conceptContData.correctAudio);

              audioObj.addEventListener("ended", function () {
                nextBtnHandler();
              });
            } else {
              topBtnEl[idx + 1].classList.remove("disabled");
              clickTouchGuide();

              $(".wrap__handbox__target").css({
                top: "35%",
                left: "62%",
              });
            }
          });
        });
      });
    },
  },

  "2_2_4_1_4": {
    render: () => {
      contentObj = `
        <div class="content-container">
          <img src="${conceptContData.topImg}" alt="top 이미지"/>

          ${conceptContData.topAniImgList
            .map(
              (item, idx) =>
                `
              <div class="topAni topAni0${idx + 1}"><img src="${item}" alt="애니메이션 이미지"/></div>
              `
            )
            .join("")}
        </div>
      `;

      $(".content").addClass("cont2_2_2_4_4");
      $(".cont2_2_2_4_4").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_4_4();
        });
      } else {
        conCur.cont2_2_4_4();
      }
    },
    cont2_2_4_4: () => {
      clickTouchGuide();

      $(".wrap__handbox__target").css({
        top: "40%",
        left: "48%",
      });

      audioPlay(conceptContData.loadAudio);

      const topImgEl = document.querySelector(".content-container img");
      const topAniEl = document.querySelectorAll(".topAni");

      topImgEl.addEventListener("click", function () {
        touchAudio.play();
        audioPlay(conceptContData.answerAudioList[0]);
        topAniEl[0].classList.add("animated");
        setTimeout(() => {
          topAniEl[1].classList.add("animated");
        }, 3000);

        audioObj.addEventListener("ended", function () {
          audioPlay(conceptContData.answerAudioList[1]);
          topAniEl[2].classList.add("animated");

          audioObj.addEventListener("ended", function () {
            nextBtnHandler();
          });
        });
      });
    },
  },

  // 2-2-5차시
  "2_2_5_1_1": {
    render: () => {
      contentObj = `
        <div class="top-contWrap">
          <img src="${conceptContData.topImg}" alt="상단 이미지"/>

          ${conceptContData.topAniList
            .map(
              (item, idx) =>
                `
              <div class="num num${idx + 1}"><img src="${item}" alt="숫자 이미지"/></div>
            `
            )
            .join("")}
        </div>
      `;

      $(".content").addClass("cont2_2_5_1");
      $(".cont2_2_5_1").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_5_1();
        });
      } else {
        conCur.cont2_2_5_1();
      }
    },
    cont2_2_5_1: () => {
      clickTouchGuide();
      audioPlay(conceptContData.loadAudio);
      const topImgEl = document.querySelector(".top-contWrap");
      const numImgEl = document.querySelectorAll(".num");
      topImgEl.addEventListener("click", function () {
        touchAudio.play();
        topImgEl.classList.add("disabled");
        addAnimationHandler(numImgEl);
        audioPlay(conceptContData.answerAudio);

        audioObj.addEventListener("ended", function () {
          nextBtnHandler();
        });
      });
    },
  },

  "2_2_5_1_2": {
    render: () => {
      contentObj = `
        <div class="top-contWrap">
          <img src="${conceptContData.topImg}" alt="상단 이미지"/>
        </div>
        <div class="bottom-contWrap">
          ${conceptContData.bottomImgList
            .map(
              (item, idx) =>
                `
              <div class="bottomCont bottomCont0${idx + 1}">
                <div class="arrow"><img src="../../../COMM/IMG/CONCEPT/2_2_5/ARROW0${idx + 1}.PNG" alt="arrow"/></div>
                <div class="bottomBtn disabled">
                    ${item.imgList
                      .map(
                        (el, i) =>
                          `
                        <div class="piece piece${i + 1}"><img src="${el}" alt="칠교판 조각"/></div>
                      `
                      )
                      .join("")}
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      `;

      $(".content").addClass("cont2_2_5_2");
      $(".cont2_2_5_2").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_5_2();
        });
      } else {
        conCur.cont2_2_5_2();
      }
    },
    cont2_2_5_2: () => {
      const contentEl = document.querySelector(".content");
      const topContEl = document.querySelector(".top-contWrap img");
      const bottomContWrap = document.querySelector(".bottom-contWrap");
      const bottomBtnEl = document.querySelectorAll(".bottomBtn");

      audioPlay(conceptContData.loadAudio);
      audioObj.addEventListener("ended", function () {
        bottomContWrap.classList.add("active");
        bottomBtnEl[0].classList.remove("disabled");
        clickTouchGuide();
        $(".wrap__handbox__target").css({
          top: "68%",
          left: "30%",
        });

        bottomBtnEl.forEach((el, idx) => {
          el.addEventListener("click", function () {
            touchAudio.play();
            el.classList.add("disabled");
            addAnimationHandler(el.querySelectorAll(".piece"));

            const imgAniLen = conceptContData.bottomImgList[idx].length;
            conceptContData.bottomImgList[idx].topAniImg.forEach((aniImg, i) => {
              setTimeout(() => {
                topContEl.src = aniImg;
              }, 500 * i);
            });

            audioPlay(conceptContData.answerAudioList[idx]);

            audioObj.addEventListener("ended", function () {
              if (idx === 0) {
                bottomBtnEl[idx + 1].classList.remove("disabled");
                clickTouchGuide();
                $(".wrap__handbox__target").css({
                  top: "68%",
                  left: "62%",
                });
              } else {
                console.log("다음 화면으로 전환");

                contentEl.innerHTML = `
                  <div class="top-img02">
                    <img src="${conceptContData.topImg02}" alt="도형이미지"/>
                  </div>
                  <div class="bottom-txt">
                  ${conceptContData.descList
                    .map(
                      (item) =>
                        `
                      <h2>${item}</h2>
                      
                      `
                    )
                    .join("")}
                
                `;
                const descTxt = document.querySelectorAll(".bottom-txt h2");
                audioPlay(conceptContData.descAudioList[0]);

                audioObj.addEventListener("ended", function () {
                  descTxt[0].classList.add("active");
                  audioPlay(conceptContData.descAudioList[1]);

                  audioObj.addEventListener("ended", function () {
                    descTxt[1].classList.add("active");
                    nextBtnHandler();
                  });
                });
              }
            });
          });
        });
      });
    },
  },

  "2_2_5_2_1": {
    render: () => {
      contentObj = `
        <div class="cont-topWrap dnd__bottom__wrapper">
          <div class="dnd__btns__bottom">
          </div>
        </div>
        <div class="cont-bottomWrap dnd__btns__box">
        </div>
      `;
      $(".content").addClass("cont2_2_5_2_1");
      $(".cont2_2_5_2_1").html(contentObj);

      conCur.cont2_2_5_2_1();
    },
    cont2_2_5_2_1: () => {
      dndFn();

      if (audio) {
        audio.addEventListener("ended", function () {
          audioPlay(conceptContData.loadAudio);
          clickTouchGuide();
          document.querySelector(".cont-bottomWrap").classList.add("active");

          audioObj.addEventListener("ended", function () {
            audioPlay(conceptContData.loadAudio02);
          });
        });
      }
    },
  },
  "2_2_5_2_2": {
    render: () => {
      contentObj = `
        <div class="top-contWrap">
          <img src="${conceptContData.topImg}" alt="상단 이미지"/>
        </div>
        <div class="bottom-contWrap">
          ${conceptContData.bottomContList
            .map(
              (item, idx) =>
                `<div class="bottomCont">
              ${
                idx === 0
                  ? `
                <img src="${item.img}" alt="디폴트 이미지" class="defaultImg"/>
                <button class="videoPlay"></button>
              `
                  : `
                <img  src="${item.src}" class="answerImg"/>
              `
              }
            </div>`
            )
            .join("")}
        </div>

        <video 
            muted
          class="videoCont"
        >
          <source src="${conceptContData.video}" type="video/mp4" />
          </video>  
      `;
      $(".content").addClass("cont2_2_5_2_2");
      $(".cont2_2_5_2_2").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_5_2_2();
        });
      } else {
        conCur.cont2_2_5_2_2();
      }
    },
    cont2_2_5_2_2: () => {
      const bottomContEl = document.querySelectorAll(".bottomCont");
      const videoContEl = document.querySelector(".videoCont");
      const playBtn = document.querySelector(".videoPlay");

      if (conceptContData.pageNum === 2) {
        audioPlay(conceptContData.loadAudio);

        audioObj.addEventListener("ended", function () {
          document.querySelector(".bottom-contWrap").classList.add("active");
          audioPlay(conceptContData.loadAudio02);

          audioObj.addEventListener("ended", function () {
            clickTouchGuide();
            $(".wrap__handbox__target").css({
              top: "65%",
              left: "32%",
            });

            playBtn.addEventListener("click", function () {
              touchAudio.play();
              videoContEl.classList.add("active");
              videoContEl.play();
              videoContEl.muted = false;

              videoContEl.addEventListener("ended", function () {
                videoContEl.muted = true;
                videoContEl.classList.remove("active");
                bottomContEl[1].classList.add("active");
                playBtn.style.display = "none";
                audioPlay(conceptContData.answerAudio);
                audioObj.addEventListener("ended", function () {
                  nextBtnHandler();
                });
              });
            });
          });
        });
      } else {
        audioPlay(conceptContData.loadAudio);
        document.querySelector(".bottom-contWrap").classList.add("active");
        audioObj.addEventListener("ended", function () {
          clickTouchGuide();
          $(".wrap__handbox__target").css({
            top: "65%",
            left: "32%",
          });
          playBtn.addEventListener("click", function () {
            touchAudio.play();
            videoContEl.classList.add("active");
            videoContEl.play();
            videoContEl.muted = false;

            videoContEl.addEventListener("ended", function () {
              videoContEl.muted = true;
              audioPlay(conceptContData.answerAudio);
              videoContEl.classList.remove("active");
              bottomContEl[1].classList.add("active");
              playBtn.style.display = "none";
              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.answerAudio02);

                audioObj.addEventListener("ended", function () {
                  if (isStopElement) {
                    stopTopContEl.innerHTML = `
                    <div class="top_img">
                      <img src="${conData.stop.topImg}" alt="top_img"/>
                      <img src="${conData.stop.topAniImg}" alt="top_img" class="top_img02"/>
                      <div class="top_blink">
                        ${conData.stop.blinkImgList
                          .map(
                            (item, idx) =>
                              `
                            <img src="${item}" alt="강조" class="blink${idx + 1}"/>
                          `
                          )
                          .join("")}
                      </div>
                    </div>
                    <div class="stop_ani_wrap"></div>
                  `;
                    showConceptPage(stopTopContEl);
                  }
                });
              });
            });
          });
        });
      }
    },
  },

  //2-2-6차시
  "2_2_6_1": {
    render: () => {
      contentObj = `
        <div class="content-container">
          <img src="${conceptContData.topImg}" alt="top 이미지"/>
        </div>
      `;
      $(".content").addClass("cont2_2_6_1");
      $(".cont2_2_6_1 ").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_6_1();
        });
      } else {
        conCur.cont2_2_6_1();
      }
    },
    cont2_2_6_1: () => {
      const character = document.querySelector(".click__car__character");
      const charDesc = document.createElement("div");
      charDesc.classList.add("guide-desc");

      charDesc.innerText = `이건  쌓기나무라고 해. 쌓기나무는 상자 모양이야.`;

      character.appendChild(charDesc);
      character.style.display = "block";
      setTimeout(() => {
        charDesc.style.opacity = 1;
      }, 1000);
      audioPlay(conceptContData.loadAudio);

      audioObj.addEventListener("ended", function () {
        character.style.display = "none";
        audioPlay(conceptContData.loadAudio02);

        const contentWrap = document.querySelector(".content");
        const maskImg = document.createElement("img");

        maskImg.classList.add("maskImg");
        maskImg.src = conceptContData.maskImg;

        contentWrap.innerHTML = `
        <video 
        muted
        class="videoCont"
      > 
          <source src="${conceptContData.video}" type="video/mp4" />
        </video>

        <div class="content-container">
          ${conceptContData.topImg02List
            .map(
              (item) =>
                `
              <div class="imgWrap">
                <img src="${item.src}" alt="top 이미지" class="topImg2"/>
                <img src="${item.onImg}" alt="top 이미지 강조효과" class="topImg-deco"/>
              </div>
            `
            )
            .join("")}
            <button class="videoPlay"></button>
        </div>
    
      `;
        clickTouchGuide();
        $(".wrap__handbox__target").css({
          top: "45%",
          left: "48%",
        });

        const videoBtn = document.querySelector(".videoPlay");
        const videoEl = document.querySelector(".videoCont");
        const imgWrapEl = document.querySelectorAll(".imgWrap");
        videoBtn.addEventListener("click", function () {
          touchAudio.play();
          videoBtn.style.display = "none";
          videoEl.classList.add("active");
          videoEl.play();
          videoEl.muted = false;

          videoEl.addEventListener("ended", function () {
            videoEl.muted = true;
            // const figureImg = document.querySelectorAll('.topImg-deco')
            videoEl.classList.remove("active");

            audioPlay(conceptContData.answerAudioList[0]);
            // figureImg[0].classList.add('animated');
            maskImg.classList.add("mask1");
            imgWrapEl[0].appendChild(maskImg);

            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.answerAudioList[1]);
              // figureImg[1].classList.add('animated');
              maskImg.classList.add("mask2");
              imgWrapEl[1].appendChild(maskImg);

              audioObj.addEventListener("ended", function () {
                nextBtnHandler();
              });
            });
          });
        });
      });
    },
  },

  "2_2_6_1_2": {
    render: () => {
      contentObj = `
        <div class="content-container">
          <div class="imgWrap">
            <img src="${conceptContData.topImg}" alt="top 이미지" class="topImg"/>

            ${conceptContData.topAniList
              .map(
                (item) =>
                  `
                <div class="topAniCont topAniCont${item.id}">
                  <p>${item.txt}</p>
                  <img src="${item.arrow}" alt="arrow" class="arrow"/>
                   ${item.desc ? `<h6 class="desc-txt">${item.desc}</h6>` : ``}
                </div>
              `
              )
              .join("")}
          </div>
        </div>
      `;
      $(".content").addClass("cont2_2_6_1_2");
      $(".cont2_2_6_1_2 ").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_6_1_2();
        });
      } else {
        conCur.cont2_2_6_1_2();
      }
    },
    cont2_2_6_1_2: () => {
      clickTouchGuide();

      const topImgEl = document.querySelector(".imgWrap");
      const topAniContEl = document.querySelectorAll(".topAniCont");
      const maskImg = document.createElement("img");

      maskImg.classList.add("maskImg");
      maskImg.src = conceptContData.maskImg;

      audioPlay(conceptContData.answerAudioList[0]);
      topAniContEl.forEach((el, idx) => {
        if (idx > 1) {
          setTimeout(() => {
            el.classList.add("on");

            setTimeout(() => {
              el.classList.add("on2");
            }, 1500);
          }, 1000);
        } else {
          audioObj.addEventListener("ended", function () {
            audioPlay(conceptContData.answerAudioList[1]);

            setTimeout(() => {
              el.classList.add("on");
              // topImgEl.src = conceptContData.topOnImg;
              topImgEl.appendChild(maskImg);
            }, 1500);

            audioObj.addEventListener("ended", function () {
              nextBtnHandler();
            });
          });
        }
      });
    },
  },

  "2_2_6_1_3": {
    render: () => {
      contentObj = `
        <div class="content-container">
          ${conceptContData.topContList
            .map(
              (item) =>
                `
              <div class="contWrap contWrap${item.id} disabled">
                <div class="cont-txtWrap">
                  <p class="contTxt">${item.txt}</p>
                </div>
                <div class="cont-imgWrap">
                  <div class="imgWrap">
                    <img src="${item.img}" alt="쌓기나무 이미지" class="figureImg"/>
                  </div>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      `;
      $(".content").addClass("cont2_2_6_1_3");
      $(".cont2_2_6_1_3").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_6_1_3();
        });
      } else {
        conCur.cont2_2_6_1_3();
      }
    },
    cont2_2_6_1_3: () => {
      const contentEl = document.querySelectorAll(".contWrap");
      const contImgEl = document.querySelectorAll(".figureImg");
      audioPlay(conceptContData.loadAudio);
      audioObj.addEventListener("ended", function () {
        audioPlay(conceptContData.contentsAudioList[0]);
        contentEl[0].classList.remove("disabled");
        clickTouchGuide();
        $(".wrap__handbox__target").css({
          top: "65%",
          left: "18%",
        });

        contentEl.forEach((el, idx) => {
          el.addEventListener("click", function () {
            touchAudio.play();
            el.classList.add("active");
            el.classList.add("disabled");

            if (idx < 2) {
              contentEl[idx + 1].classList.add("active");
              contentEl[idx + 1].classList.remove("disabled");
            }

            if (idx > 0) {
              contImgEl[idx].src = conceptContData.topContList[idx].img2;
            }

            // audioPlay(answerAudio);

            // audioObj.addEventListener('ended', function(){
            if (idx === 0) {
              clickTouchGuide();
              $(".wrap__handbox__target").css({
                top: "65%",
                left: "45%",
              });
              audioPlay(conceptContData.contentsAudioList[idx + 1]);
            } else if (idx === 1) {
              clickTouchGuide();
              $(".wrap__handbox__target").css({
                top: "65%",
                left: "74%",
              });
              audioPlay(conceptContData.contentsAudioList[idx + 1]);
            } else {
              audioPlay(conceptContData.answerAudio);
              audioObj.addEventListener("ended", function () {
                nextBtnHandler();
              });
            }

            // })
          });
        });
      });
    },
  },

  "2_2_6_1_4": {
    render: () => {
      contentObj = `
        <div class="content-container dnd__bottom__wrapper">
          <img src="${conceptContData.topImg}" alt="top 이미지"/>


          <p class="txt-Wrap">
            빨간색 쌓기나무 1개가 있고, 빨간색 쌓기나무의 <br/>
            위쪽과 오른쪽에 쌓기나무가
            <span class="border__styled spacing__question__box--smallsize spacing__question__box droppable" data-val="1">?</span>개씩 있습니다.
          </p>
        </div>
        <div class="dnd__bottom__wrapper">
          <div class="dnd__btns__bottom"></div>
        </div>
      `;
      $(".content").addClass("cont2_2_6_1_4");
      $(".cont2_2_6_1_4").html(contentObj);

      conCur.cont2_2_6_1_4();
    },
    cont2_2_6_1_4: () => {
      audioPlay(conceptContData.loadAudio);
      audioObj.addEventListener("ended", function () {
        audioPlay(conceptContData.loadAudio02);
      });
      dndFn();
    },
  },

  "2_2_6_2_1": {
    render: () => {
      contentObj = `
      <div class="content-container">
        ${conceptContData.topImgList
          .map(
            (item, idx) =>
              `
            <div class="contWrap contWrap${idx + 1}">
              <img src="${item}" alt="도형이미지"/>
            </div>
          `
          )
          .join("")}
      </div>
      `;
      $(".content").addClass("cont2_2_6_2_1");
      $(".cont2_2_6_2_1").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_6_2_1();
        });
      } else {
        conCur.cont2_2_6_2_1();
      }
    },
    cont2_2_6_2_1: () => {
      audioPlay(conceptContData.loadAudio);

      audioObj.addEventListener("ended", function () {
        clickTouchGuide();
        $(".wrap__handbox__target").css({
          top: "45%",
          left: "61%",
        });
      });

      const contEl = document.querySelector(".contWrap2");
      contEl.addEventListener("click", function () {
        touchAudio.play();
        contEl.classList.add("active");
        audioPlay(conceptContData.answerAudio);

        audioObj.addEventListener("ended", function () {
          nextBtnHandler();
        });
      });
    },
  },
  "2_2_6_2_2": {
    render: () => {
      contentObj = `
      <div class="content-container">
        ${conceptContData.topImgList
          .map(
            (item, idx) =>
              `
            <div class="contWrap contWrap${idx + 1}">
            ${
              idx !== 2
                ? `
              <img src="${item}" alt="도형이미지"/>
            `
                : `
            <span class="border__styled spacing__question__box droppable" data-val="3"></span>
            `
            }
            </div>
          `
          )
          .join("")}
      </div>
      <div class="dnd__bottom__wrapper">
        <div class="dnd__btns__bottom"></div>
      </div>
    `;
      $(".content").addClass("cont2_2_6_2_2");
      $(".cont2_2_6_2_2").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_6_2_2();
        });
      } else {
        conCur.cont2_2_6_2_2();
      }
    },
    cont2_2_6_2_2: () => {
      audioPlay(conceptContData.loadAudio);

      audioObj.addEventListener("ended", function () {
        audioPlay(conceptContData.loadAudio02);
        dndFn();
      });
    },
  },

  "2_2_6_2_3": {
    render: () => {
      contentObj = `
      <div class="content-container">
        ${conceptContData.topContList
          .map(
            (item, idx) =>
              `
           <div class="contWrap-container">
            <div class="cont-top disabled"><img src="${item.topImg}"/></div>
            <div class="cont-bottom"><img src="${item.bottomImg}"/></div>
           </div>
          `
          )
          .join("")}
      </div>
   
    `;
      $(".content").addClass("cont2_2_6_2_3");
      $(".cont2_2_6_2_3").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont2_2_6_2_3();
        });
      } else {
        conCur.cont2_2_6_2_3();
      }
    },
    cont2_2_6_2_3: () => {
      audioPlay(conceptContData.loadAudio);
      clickTouchGuide();
      $(".wrap__handbox__target").css({
        top: "30%",
        left: "19%",
      });

      const contTopEl = document.querySelectorAll(".cont-top");
      const contBottomEl = document.querySelectorAll(".cont-bottom");

      contTopEl[0].classList.remove("disabled");
      contTopEl.forEach((el, idx) => {
        el.addEventListener("click", function () {
          touchAudio.play();
          el.classList.add("disabled");
          contBottomEl[idx].classList.add("active");

          audioPlay(conceptContData.answerAudioList[idx]);

          audioObj.addEventListener("ended", function () {
            if (idx < 2) {
              contTopEl[idx + 1].classList.remove("disabled");
            }

            if (idx === 0) {
              clickTouchGuide();
              $(".wrap__handbox__target").css({
                top: "30%",
                left: "45%",
              });
            } else if (idx === 1) {
              clickTouchGuide();
              $(".wrap__handbox__target").css({
                top: "30%",
                left: "74%",
              });
            } else {
              if (isStopElement) {
                stopTopContEl.innerHTML = `
                <div class="top_img">
                ${conData.stop.topImg
                  .map(
                    (item, idx) =>
                      `
                  <div class="imgWrap imgWrap${idx + 1}">
                    <img src="${item.top}" alt="topImg"/>
                    ${idx === 0 ? `<img src="${conData.stop.topDecoImg}" class="decoImg"/>` : ``}
                    <img src="${item.bottom}" alt="bottomImg" class="bottomImg"/>
                  </div>
                  `
                  )
                  .join("")}
                </div>
              `;
                showConceptPage(stopTopContEl);
              }
            }
          });
        });
      });
    },
  },

  // 랜덤페이지 stop타입
  stop: {
    render: () => {
      contentObj = `
          <div class="randomQuestion__wrapper">
            
          </div>
        `;
      $(".content").html(contentObj);
      conCur.randomQuestionFn();
      conCur.aniStart();
      audioPlay(conceptContData.sound);
      // conCur.audioPlay();
    },
    randomQuestionFn: () => {
      // 초기값
      $(".header").css("display", "none");
      $(".click__car__character").css("display", "none");
      $(".content-inner").css("overflow", "hidden");
      $(".pagination").css("display", "none");

      // 페이지 이전, 다음버튼 활성화
      if (!conData.stop) {
        nextBtnHandler();
      }

      $(".prevBtn").addClass("on");
      $(".nextBtn").addClass("on");
    },
    // animation start
    aniStart: () => {
      $(".commentary__wrapper").css("bottom", "-600px");
      setTimeout(() => {
        $(".commentary__wrapper").animate({
          bottom: "0px",
        });
      }, 200);
    },
    // randomQuestion 페이지 자동 오디오 재생 ::
    // audioPlay: () => {
    //   let soundSrc = conceptContData.sound;
    //   let sound = new Audio(soundSrc);
    //   console.log(sound);
    //   sound.play();
    // },

    pageing: () => {},
  },
};

/**
 * Common function
 */

// concept 페이지 렌더링
function conUiRender() {
  if (!conData) return;
  conceptContData = conData.contents;
  console.log("conData.desc ::: ", conData.type);
  console.log("conceptContData.type ::: ", conceptContData.type);
  console.log("%c----------------------------", "color:red");
  conCur = conTypeInfo[conceptContData.type];
  commInit();
  try {
    conCur.render();
  } catch (e) {
    console.log(e);
  }
}

function audioPlay(soundPath = null) {
  if (audioObj) {
    audioObj.pause();
    audioObj.currentTime = 0;
  }
  if (soundPath) {
    audioObj = new Audio(soundPath);
    audioObj.play();
  }
}

// 셔플 함수
function shufflee(arr) {
  arr.sort(() => Math.random() - 0.5);
  return arr;
}

// 초기셋팅
function commInit() {
  audioPlay();

  // btn
  if (conCurrentPage === 1) {
    //$(".prevBtn").css("display", "none");
  } else if (conCurrentPage === conTotalPage) {
    //$(".nextBtn").css("display", "none");
  } else {
    $(".prevBtn").css("display", "flex");
    $(".nextBtn").css("display", "flex");
  }

  // stop 일때
  if (conData.stop) {
    isStopElement = true;
  } else {
    isStopElement = false;
  }
}

// dndFn
function dndFn() {
  let dragRandomCard = shufflee(conceptContData.dragCardData);
  // drag 박스 셔플
  let dropRandomCard = conceptContData.dropCardData;

  if (audio) {
    audio.addEventListener("ended", function () {
      if (conceptContData.type !== "2_2_5_2_1") {
        clickTouchGuide();
      }
    });

    if (conceptContData.type === "2_1_7_2") {
      clickTouchGuide();
      $(".wrap__handbox__target").addClass("dndGuide");
    }
  } else if (audioObj) {
    audioObj.addEventListener("ended", function () {
      clickTouchGuide();
    });
  } else {
    clickTouchGuide();
  }

  // drag, drop 박스 요소추가
  for (i = 0; i < dragRandomCard.length; i++) {
    const dragItem = `
      <div data-val=${dragRandomCard[i].val} class="draggable">
      ${
        conceptContData.type !== "2_2_5_2_1" && conceptContData.type !== "2_2_6_2_2"
          ? `
        ${dragRandomCard[i].txt}
      `
          : `
        <img src="${dragRandomCard[i].img}"/>
      `
      }
      </div>
      `;
    $(".dnd__btns__bottom").append(dragItem);
  }

  if (dropRandomCard) {
    for (i = 0; i < dropRandomCard.length; i++) {
      const dropItem = `
          <div data-val=${dropRandomCard[i].val} class="dnd__epilogue ${dropRandomCard[i].droppable ? "droppable border__styled" : ""}">
          ${
            conceptContData.type !== "2_2_5_2_1"
              ? `
            ${dropRandomCard[i].droppable ? "?" : dropRandomCard[i].txt}
          `
              : ``
          }
          </div>
        `;

      $(".dnd__btns__box").append(dropItem);
    }
  }

  $(".draggable")
    .draggable()
    .on("draggable:start", function (dropp, drag) {
      touchAudio.play();

      $(".draggable").removeClass("dragging");
      $(this).addClass("dragging");
      $(".draggable:not(.dragging)").css("pointer-events", "").css("transform", "");
    })
    .on("draggable:stop", function (dropp, drag) {
      $(this).removeClass("dragging");
    });

  //DnD drag, drop 값이 동일하면 빈칸 채워짐
  $(".droppable")
    .droppable({
      hoverClass: "active",
    })
    .on("droppable:drop", function (dropp, drag) {
      let dragVal = drag.item[0].dataset.val;
      let dropVal = dropp.currentTarget.dataset.val;

      if (dragVal == dropVal) {
        dropp.target.className = "dnd__epilogue";
        dropp.target.textContent = "";
        drag.item.addClass("eventNone");
        audioPlay(answerAudio);
      } else {
        audioPlay(wrongAudio);

        if (conceptContData.wrongAudioList) {
          audioObj.addEventListener("ended", function () {
            if (conceptContData.type !== "2_2_6_2_2") {
              audioPlay(conceptContData.wrongAudioList[dropVal - 1]);
            } else {
              audioPlay(conceptContData.wrongAudioList[dragVal - 1]);
            }
          });
        }

        if (conceptContData.wrongAudio) {
          audioObj.addEventListener("ended", function () {
            audioPlay(conceptContData.wrongAudio);
          });
        }

        return false;
      }

      // 빈칸채우기 완료되면 다음버튼 색변경
      // if ($(".dnd__btns__bottom > *").length - 1 == 0) {
      //   $(".nextBtn").addClass("on");
      //   $(".prevBtn").addClass("on");
      // }

      // 정답 시 오디오재생
      audioObj.addEventListener("ended", function () {
        if ($(".border__styled").length === 0) {
          if (conceptContData.type === "2_2_6_1_4" || conceptContData.type === "2_2_6_2_2") {
            const bottomCont = document.querySelector(".dnd__btns__bottom");
            bottomCont.style.opacity = 0;
            bottomCont.classList.add("disabled");
          }

          if (conceptContData.correctAudioList) {
            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.correctAudioList[dropVal - 1]);
            });
          }

          if (conceptContData.normalAnswerAudio) {
            audioPlay(conceptContData.normalAnswerAudio);
          }

          if (conceptContData.answerAudioList) {
            audioPlay(conceptContData.answerAudioList[0]);
            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.answerAudioList[1]);
            });
          }

          if (conceptContData.correctAudio && conData.stop.stopClass !== "stop_2_1_7") {
            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.correctAudio);
            });
          }

          if (isStopElement) {
            if (conData.stop.stopClass === "stop_2_1_5") {
              stopTopContEl.innerHTML = `
                <div class="top_img">
                  <img src="${conData.stop.topImg}" alt="top_img"/>
                </div>
                <div class="stop_ani_wrap">
                  ${conData.stop.stopAni
                    .map(
                      (item, idx) =>
                        `
                        <div class="aniWrap">
                          <span key=${idx}>${item}</span>
                          <div class="maskImg maskImg${idx + 1}"><img src="${conData.stop.maskImg}"/></div>
                        </div>
                    `
                    )
                    .join("")}
                </div>
              `;

              if (document.querySelectorAll(".dnd__epilogue").length === 1) {
                const bottomCont = document.querySelector(".dnd__btns__bottom");
                bottomCont.classList.add("disabled");
                bottomCont.style.opacity = 0;
                audioPlay(conceptContData.correctAudioList[1]);
                audioObj.addEventListener("ended", function () {
                  audioPlay(conceptContData.resultAudio);
                  const aniWrap2El = document.querySelector(".aniWrap2");

                  aniWrap2El.classList.add("active");
                  setTimeout(() => {
                    aniWrap2El.classList.remove("active");
                  }, 5000);

                  audioObj.addEventListener("ended", function () {
                    showConceptPage(stopTopContEl);
                  });
                });
              }
            } else if (conData.stop.stopClass === "stop_2_1_7") {
              if (document.querySelectorAll(".dnd__epilogue").length === 2) {
                const bottomCont = document.querySelector(".dnd__btns__bottom");
                bottomCont.classList.add("disabled");
                bottomCont.style.opacity = 0;

                console.log(audioObj);
                audioPlay(conceptContData.correctAudio);

                audioObj.addEventListener("ended", function () {
                  stopTopContEl.innerHTML = `
                    <h2>
                      <img src="${conData.stop.topTitImg}" alt="타이틀"/>
                    </h2>
                
                    <ul>
                      ${conData.stop.topImgList
                        .map(
                          (item) =>
                            `
                          <li class="aniBox">
                          ${
                            item.hintImg
                              ? `
                            <div class="hintBox">
                              <img src="${item.hintImg}" alt="힌트 이미지"/>
                            </div>
                            <img src="../../../COMM/IMG/CONCEPT/2_1_7/ARROW.PNG" alt="화살표" class="arrow"/>
                          `
                              : ``
                          }
                            <div class="txtBox">
                              <img src="${item.topImg}" alt="텍스트 이미지"/>
                            </div>
                          </li>
                        `
                        )
                        .join("")}
                    </ul>
                  `;
                  showConceptPage(stopTopContEl);
                  document.querySelectorAll(".aniBox").forEach((el, index) => {
                    setTimeout(function () {
                      el.classList.add("animated");
                    }, index * 5000);
                  });
                });
              }
            }
          } else if (conCurrentActivity === 2 && conCurrentPage === conTotalPage) {
            conceptFinished();
          } else {
            console.log();
            nextBtnHandler();
          }
        }
      });
    });
}

/**
 * drawFigure 도형 그리기 이벤트
 */
function drawFigureEvent() {
  console.log("도형그리기 이벤트!!!!!!!!!");
  const canvas = document.getElementById("drawCanvas");
  const ctx = canvas.getContext("2d");
  const drawLineAudio = new Audio("../../../COMM/SOUND/GAME/LINE.MP3");

  // let dots = conceptContData.dotList;
  let dots = JSON.parse(JSON.stringify(conceptContData.dotList));

  let selectedDot = null;
  let isDrawing = false;
  let lineStartX = 0;
  let lineStartY = 0;
  let drawnLines = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // dots 배열에 있는 상대적인 위치를 px 값으로 변환하여 업데이트
    for (const dot of dots) {
      dot.x = dot.x * canvas.width;
      dot.y = dot.y * canvas.height;
    }
    drawGame();
  }

  window.addEventListener("resize", resizeCanvas);

  canvas.addEventListener("mousedown", handleCanvasMouseDown);
  canvas.addEventListener("mousemove", handleCanvasMouseMove);
  canvas.addEventListener("mouseup", handleCanvasMouseUp);
  canvas.addEventListener("touchstart", handleCanvasTouchStart);
  canvas.addEventListener("touchmove", handleCanvasTouchMove);
  canvas.addEventListener("touchend", handleCanvasTouchEnd);

  function drawDot(x, y, id, color) {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawLine(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "#FF64DC";
    ctx.lineWidth = 10;
    ctx.stroke();
  }

  // 중앙 부 계산
  function isPointInsideCircle(pointX, pointY, circleX, circleY, radius) {
    const distance = Math.sqrt((pointX - circleX) ** 2 + (pointY - circleY) ** 2);
    return distance <= radius;
  }

  function handleCanvasMouseDown(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    startDrawing(mouseX, mouseY);
  }

  function handleCanvasMouseMove(event) {
    if (isDrawing) {
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - canvas.getBoundingClientRect().top;
      drawLineTo(mouseX, mouseY);
    }
  }

  function handleCanvasMouseUp(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    endDrawing(mouseX, mouseY);
  }

  function handleCanvasTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const touchX = touch.pageX - canvas.getBoundingClientRect().left;
    const touchY = touch.pageY - canvas.getBoundingClientRect().top;
    startDrawing(touchX, touchY);
  }

  function handleCanvasTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const touchX = touch.pageX - canvas.getBoundingClientRect().left;
    const touchY = touch.pageY - canvas.getBoundingClientRect().top;
    drawLineTo(touchX, touchY);
  }

  function handleCanvasTouchEnd(event) {
    event.preventDefault();
    const touch = event.changedTouches[0];
    const touchX = touch.pageX - canvas.getBoundingClientRect().left;
    const touchY = touch.pageY - canvas.getBoundingClientRect().top;
    endDrawing(touchX, touchY);
  }

  function startDrawing(x, y) {
    drawLineAudio.play();
    for (const dot of dots) {
      if (isPointInsideCircle(x, y, dot.x, dot.y, 30)) {
        selectedDot = dot;
        isDrawing = true;
        lineStartX = dot.x;
        lineStartY = dot.y;
        break;
      }
    }
  }

  function drawLineTo(x, y) {
    if (isDrawing) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const line of drawnLines) {
        drawLine(line.startX, line.startY, line.endX, line.endY);
      }
      drawLine(selectedDot.x, selectedDot.y, x, y);
      drawGame();
    }
  }

  function endDrawing(x, y) {
    if (isDrawing) {
      //정답이랑 연결했는지
      let connectedToCorrectDot = false;
      // 오답이랑 연결했는지
      let connectedToInCorrectDot = false;

      let resultX, resultY;
      for (const dot of dots) {
        let dotAnswerState = false;
        selectedDot.answer.forEach((el) => {
          if (dot.id === el) {
            dotAnswerState = true;
          }
        });

        if (isPointInsideCircle(x, y, dot.x, dot.y, 30) && selectedDot !== dot && dotAnswerState) {
          resultX = dot.x + 10 / 2;
          resultY = dot.y + 10 / 2;
          if (dot.correct) {
            connectedToCorrectDot = true;
          } else {
            connectedToInCorrectDot = true;
          }
        } else if (!selectedDot.correct) {
          connectedToInCorrectDot = true;
        }
      }

      if (connectedToCorrectDot && selectedDot.correct) {
        drawnLines.push({ startX: selectedDot.x, startY: selectedDot.y, endX: resultX, endY: resultY });
        console.log("정답");
        audioPlay(answerAudio);

        //// 전부 다 그린 후 음성
        if (drawnLines.length === conceptContData.answerLineCount) {
          console.log("정답 끝");
          canvas.classList.add("disabled");

          audioObj.addEventListener("ended", function () {
            audioPlay(conceptContData.answerAudio);
            audioObj.addEventListener("ended", function () {
              nextBtnHandler();
            });
          });
        }
      } else {
        // 오답 점이랑 연결해야 정답체크
        if (connectedToInCorrectDot) {
          console.log("오답");
        }
      }

      isDrawing = false;
      selectedDot = null;
      lineStartX = 0;
      lineStartY = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const line of drawnLines) {
        drawLine(line.startX, line.startY, line.endX, line.endY);
      }
      drawGame();
    }
  }

  function drawGame() {
    for (const dot of dots) {
      drawDot(dot.x, dot.y, dot.id, "#000");
    }
  }

  resizeCanvas();
  // drawGame();
}

/**
 * 순서대로 애니메이션 추가
 * @param element 애니메이션 컨텐츠
 */
function addAnimationHandler(element) {
  element.forEach((el, index) => {
    setTimeout(function () {
      el.classList.add("animated");
    }, index * 500);
  });
}

// 다음버튼 활성화
function nextBtnHandler() {
  const nextBtn = document.querySelector(".concept .nextBtn");

  conCompletePageState = true;

  if (conCompletePageState) {
    nextBtn.classList.add("on");
    nextBtn.classList.add("active");
  }

  if (conCurrentActivity === 2 && conCurrentPage === conTotalPage) {
    nextBtn.classList.remove("active");
  }
}

// 개념 종료 함수 호출
// 마지막 페이지 현재 페이지 번호 == 총 페이지 수 일 경우 완료 처리
function conceptFinished() {
  if (conCurrentPage === conTotalPage) {
    callFinish();
  }
}

/**
 * 개념 설명 페이지 보이기
 * @param topCont top 컨텐츠
 * */
function showConceptPage(topCont) {
  console.log("개념설명 있음!!!!!!!!!!!!!!");

  const contentWrapEl = document.querySelector(".content-wrap");
  const contentInnerEl = document.querySelector(".content-inner");

  contentWrapEl.classList.add("show");

  let conceptPageEl = document.createElement("div");

  conceptPageEl.classList.add("conceptPage");
  conceptPageEl.innerHTML = `
    <div class="randomQuestion__wrapper ${conData.stop.stopClass}">
      <div class="randomQ__epilogue__imgbox"></div>

      <div class="commentary__wrapper">

        <div class="comm_left">
          ${
            conData.stop.bubbleImg
              ? `
            <div class="comm_bubble">
              <img src="${conData.stop.bubbleImg}"/>
            </div>
          `
              : ``
          }
          <img src="${conData.stop.bottomImg}" />
        </div>

        <div class="comm_right">

          <div class="reaction_s">
            <div class="re-head">
            </div>
            <div class="re-body">
              <img src="../../../COMM/IMG/CONCEPT/CAHR_B.PNG" alt="몸통"/>
            </div>
          </div>

        </div>
        
      </div>

    </div>
  
  `;

  contentInnerEl.appendChild(conceptPageEl);
  document.querySelector(".randomQ__epilogue__imgbox").appendChild(topCont);

  if (conData.stop.sound) {
    audioPlay(conData.stop.sound);
  } else if (conData.stop.soundList) {
    audioPlay(conData.stop.soundList[0]);

    audioObj.addEventListener("ended", function () {
      audioPlay(conData.stop.soundList[1]);
    });
  }

  if (conData.stop.stopClass === "stop_2_1_2") {
    //2-1-2차시
    const topAniBar = document.querySelectorAll(".stop_2_1_2 .aniBar1");

    // 애니메이션 리셋 시키기
    topAniBar[1].classList.remove("active");
    document.querySelector(".stop_top_content").classList.remove("active");
    document.querySelector(".aniBar2").classList.remove("active");
    topAniBar.forEach((el, idx) => {
      el.classList.remove("active");
    });

    topAniBar[1].classList.add("active");
    audioPlay(conData.stop.topSoundList[0]);

    setTimeout(() => {
      topAniBar[1].classList.remove("active");
      topAniBar.forEach((el, idx) => {
        setTimeout(() => {
          el.classList.add("active");
        }, idx * 1000);

        setTimeout(() => {
          if (idx === 1) {
            document.querySelector(".stop_top_content").classList.add("active");
          }
        }, 3000);
      });
    }, 800);

    audioObj.addEventListener("ended", function () {
      audioPlay(conData.stop.topSoundList[1]);
      document.querySelector(".aniBar2").classList.add("active");
      audioObj.addEventListener("ended", function () {
        audioPlay(conData.stop.bottomSound);
      });
    });
  } else if (conData.stop.stopClass === "stop_2_1_5") {
    //2학년 1-5차시
    const maskImg = document.querySelectorAll(".maskImg");

    audioObj.addEventListener("ended", function () {
      maskImg.forEach((el) => {
        el.classList.add("active");
      });
    });
  } else if (conData.stop.stopClass === "stop_2_1_6") {
    audioPlay(conData.stop.topSoundList[0]);
    setTimeout(() => {
      document.querySelectorAll(".aniBar").forEach((el) => el.classList.add("animated"));

      audioObj.addEventListener("ended", function () {
        const qBoxEl = document.querySelectorAll(".q-box");
        audioPlay(conData.stop.topSoundList[1]);
        qBoxEl.forEach((el, idx) => {
          el.innerHTML = conData.stop.stopCont[idx + 2];
        });

        document.querySelectorAll(".topTxtAni").forEach((el, idx) => {
          setTimeout(() => {
            el.classList.add("animated");
          }, 1000 * idx);
        });
        audioObj.addEventListener("ended", function () {
          audioPlay(conData.stop.bottomSound);
        });
      });
    }, 4000);
  } else if (conData.stop.stopClass === "stop_2_2_2") {
    const topAniImgEl = document.querySelectorAll(".aniWrap");
    audioPlay(conData.stop.topSound);

    function stopAniEvent(index) {
      audioPlay(conData.stop.topAniSoundList[index]);
      topAniImgEl[index].classList.add("animated");

      audioObj.addEventListener("ended", function () {
        if (index !== 2) {
          stopAniEvent(index + 1);
        } else {
          audioPlay(conData.stop.bottomSound);
        }
      });
    }

    audioObj.addEventListener("ended", function () {
      stopAniEvent(0);
    });
  } else if (conData.stop.stopClass === "stop_2_2_5") {
    const topAniImg = document.querySelector(".top_img02");
    const blinkImg = document.querySelector(".top_blink");
    audioPlay(conData.stop.topSound);
    setTimeout(() => {
      topAniImg.classList.add("active");
    }, 2000);

    audioObj.addEventListener("ended", function () {
      audioPlay(conData.stop.bottomSoundList[0]);
      blinkImg.classList.add("active");

      audioObj.addEventListener("ended", function () {
        audioPlay(conData.stop.bottomSoundList[1]);
      });
    });
  } else if (conData.stop.stopClass === "stop_2_2_6") {
    const bottomImgEl = document.querySelectorAll(".bottomImg");
    const decoImgEl = document.querySelector(".decoImg");
    const maskImg = document.createElement("img");

    maskImg.classList.add("maskImg");
    maskImg.src = conceptContData.maskImg;

    bottomImgEl[0].classList.add("active");
    audioPlay(conData.stop.topSoundList[0]);

    audioObj.addEventListener("ended", function () {
      bottomImgEl[1].classList.add("active");
      audioPlay(conData.stop.topSoundList[1]);

      audioObj.addEventListener("ended", function () {
        decoImgEl.classList.add("active");
        document.querySelector(".imgWrap1").appendChild(maskImg);
        audioPlay(conData.stop.bottomSoundList[0]);

        audioObj.addEventListener("ended", function () {
          document.querySelector(".imgWrap1").removeChild(maskImg);
          audioPlay(conData.stop.bottomSoundList[1]);
        });
      });
    });
  }

  const commBottom = document.querySelector(".commentary__wrapper");

  setTimeout(() => {
    commBottom.classList.add("active");
  }, 300);
  document.querySelector(".reaction_s").classList.add("active");

  audioObj.addEventListener("ended", function () {
    if (conCurrentActivity === 2 && conCurrentPage === conTotalPage) {
      conceptFinished();
    } else {
      nextBtnHandler();
    }
  });
}
