let conCompletePageState = ""; // 현재 페이지 완료 상태
let conActivityData = ""; // 활동 데이터
let conCurrentPage = ""; // 현재 페이지 수
let conTotalPage = ""; // 총 페이지 수
let conTotalPageData = ""; // 전체 페이지 데이터
let conData = ""; // 현재 페이지 데이터
let conceptContData = "";
let conCur = ""; // 현재 타입 정보
let audioObj = ""; // 오디오 Element
let conCurrentActivity = ""; // 현재 활동데이터

// 개념익히기 설명 있는지
let isStopElement = false;

// 정/오답 사운드
let answerAudio = "../../../COMM/SOUND/GAME/ANSWER.MP3";
let wrongAudio = "../../../COMM/SOUND/GAME/ANSWERWRO.MP3";

let stopTopContEl = document.createElement("div");
stopTopContEl.classList.add("stop_top_content");

let conTypeInfo = {
  /**
   *
   * 학년, 학기, 차시, 순서
   */

  // 1_1_2_1, click타입 2,3차시 적용중
  click: {
    render: () => {
      contentObj = `
        <div class="content__container">
          <div class="click__car__top">
            <img src="${conceptContData.topImg}"/>
          </div>
          <div class="click__car__bottom">
            <div class="bottom_left_box">
              <img src="../../../COMM/IMG/CONCEPT/CIRCLE_BOX.PNG" alt="동그라미 판 이미지"/>
              <div class="circle_aniWrap"></div>
            </div>
            <div class="bottom_center_box">
              <img src="${conceptContData.bottomGif}" alt="숫자 gif"/>
            </div>
            <div class="bottom_right_box">
              ${conceptContData.bottomTxt
                .map(
                  (item, idx) =>
                    `<div class="text_box text_box${idx + 1}">${item}</div>`
                )
                .join("")}
            </div>
           
          </div>
        </div>`;
      $(".content").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.clickTypeFn();
        });
      } else {
        conCur.clickTypeFn();
        $(".click__car__character").hide();
      }
    },
    clickTypeFn: () => {
      const clickCarImg = document.querySelector(".click__car__top");
      const epilogue1 = document.querySelector(".bottom_left_box");
      const epilogue2 = document.querySelector(".bottom_center_box");
      const epilogue3 = document.querySelector(".bottom_right_box");

      clickTouchGuide(conceptContData.loadAudio);
      showCharacterHandler();

      // 오디오가 끝나면 터치유도 가이드 가림
      // hdwadEnds(conceptContData.loadAudio);
      if (audioObj) {
        audioObj.addEventListener("ended", function () {
          $(".click __car__character").hide();
        });
      }

      clickCarImg.addEventListener("click", function () {
        touchAudio.play();
        clickCarImg.classList.add("disabled");

        let circleLenValue = conceptContData.circleLen;

        for (var i = 0; i < circleLenValue; i++) {
          const aniWrap = document.querySelector(".circle_aniWrap");
          const aniDiv = document.createElement("div");
          aniDiv.classList.add("ani_circle");

          setTimeout(() => {
            aniWrap.appendChild(aniDiv);
          }, 500 * i);
        }

        // 첫 번째 오디오 파일 재생
        audioPlay(conceptContData.contentsAudio);

        // 첫 번째 오디오 파일 재생이 끝나면 두 번째 오디오 파일 재생
        audioObj.addEventListener("ended", function () {
          epilogue2.classList.add("active");
          audioPlay(conceptContData.answerAudio);

          // 오디오 중간에 나오기
          setTimeout(() => {
            epilogue3.classList.add("active");
          }, 1000);

          audioObj.addEventListener("ended", function () {
            if (isStopElement) {
              //1-1-2차시
              if (conData.stop.stopClass === "stop_1_1_2") {
                stopTopContEl.innerHTML = `
                        <div class="top_img">
                          <img src="${conData.stop.topImg}" alt="top_img"/>
                        </div>
                        <div class="stop_ani_wrap"></div>
                      `;
                for (var i = 0; i < conData.stop.topAni; i++) {
                  const stopAni = document.createElement("div");
                  stopAni.classList.add("stop_ani_num");
                  stopAni.classList.add(`stop_ani_num${i + 1}`);

                  stopAni.innerHTML = `
                            ${i + 1}
                          `;

                  setTimeout(() => {
                    document
                      .querySelector(".stop_ani_wrap")
                      .appendChild(stopAni);
                  }, 1000 * i);
                }

                setTimeout(() => {
                  document.querySelector(".stop_ani_num5").classList.add("on");
                }, 17000);
              } else {
                //1-1-3차시
                stopTopContEl.innerHTML = `
                          <div class="top_img">
                            <img src="${conData.stop.topImg}" alt="top_img"/>
                          </div>
                          <div class="stop_ani_wrap">
                          </div>
                        `;

                const aniCont1 = document.createElement("div");
                const aniCont2 = document.createElement("div");

                aniCont1.classList.add("stop_ani_inner");
                aniCont2.classList.add("stop_ani_inner");

                for (var i = 0; i < conData.stop.topAni; i++) {
                  const stopAni = document.createElement("div");
                  stopAni.classList.add("stop_ani_num");

                  stopAni.innerHTML = `
                              ${i + 1}
                            `;
                  aniCont1.appendChild(stopAni);
                }

                for (var j = conData.stop.topAni - 1; j >= 0; j--) {
                  const stopAni = document.createElement("div");
                  stopAni.classList.add("stop_ani_num");

                  stopAni.innerHTML = `
                                ${j + 1}
                            `;

                  aniCont2.appendChild(stopAni);
                }

                setTimeout(() => {
                  document
                    .querySelector(".stop_ani_wrap")
                    .appendChild(aniCont1);
                  addAnimationHandler(
                    aniCont1.querySelectorAll(".stop_ani_num")
                  );

                  setTimeout(() => {
                    document
                      .querySelector(".stop_ani_wrap")
                      .appendChild(aniCont2);
                    addReverseAnimationHandler(
                      aniCont2.querySelectorAll(".stop_ani_num")
                    );
                  }, 3000);
                }, 500);
              }

              showConceptPage(stopTopContEl);
            } else {
              nextBtnHandler();
            }
          });
        });
      });
    },
  },

  // 1-1 2, 3차시 캔버스 타입
  canvas: {
    render: () => {
      contentObj = `
          <div class="write__contents">
            <div class="write__wrapper">
              <div class="write__container">
                <img src="${conceptContData.leftImg}" />

                <div class="write__right__box">
                  <div class="canvas__container__box">

                    <canvas id="canvas" class="canvas" ></canvas>
                    <div class="canvas__bg__write active ${conceptContData.canvasClass}">
                      <img src="${conceptContData.canvasGIF}" class="canvasGif"/>
                      <button class="canvas__arrow__btn ${conceptContData.arrowClass}">
                        <img src="${conceptContData.canvasArrowImg}" />
                      </button>
                    </div>

                  
                  </div>

                  <div class="write__problem__box">
                    <div class="problem__box__one">${conceptContData.text[0]}</div>
                    <div class="problem__box__one">${conceptContData.text[1]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      $(".content").html(contentObj);
      $(".click__car__character").hide();

      conCur.canvasFn();
    },
    canvasFn: () => {
      if (audio) {
        audio.addEventListener("ended", function () {
          if (conceptContData.loadAudio) {
            audioPlay(conceptContData.loadAudio);
          }

          clickTouchGuide();
          document.querySelector(".overlay__guide__wrap").style.opacity = 0;
        });
      } else {
        clickTouchGuide();
        document.querySelector(".overlay__guide__wrap").style.opacity = 0;
      }

      console.log("캔버스 이벤트");
      let writeChecked = true;
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      let drawImage = new Image();
      let imgUrl = conceptContData.canvasBg;

      setTimeout(() => {
        document.querySelector(".canvas__bg__write").classList.remove("active");
      }, 2000);

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

        // 최초 1회만 정답 시 오디오재생
        if (writeChecked) {
          audioPlay(conceptContData.answerAudio);

          writeChecked = false;
        }

        // 오디오 끝나면 다음버튼, 맨마지막 페이지일 시 종류 함수실행
        audioObj.addEventListener("ended", function () {
          if (!conData.stop) {
            nextBtnHandler();
          }
          conceptFinished();
        });
      }

      function stopPainting(event) {
        painting = false;
        ctx.beginPath();
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
    },
  },

  // 100, 10, 1씩 뛰어쓰기부분 spacing타입/// 안쓰는듯...?
  spacing: {
    render: () => {
      contentObj = `
          <div class="spacing__container">
            <div class="spacing__top">
              <div class="spacing__top__title">
                <img src="${conceptContData.titleIcon}" />
                <span>${conceptContData.cardData[0].subject}</span>
              </div>
              <img src="${conceptContData.topImg}">
            </div>

            <div class="spacing__bottom">
              <div class="spacing__bottom__top">
                <div class="spacing__question__box border__styled">?</div>
                <span>의 자리 숫자가 1씩 커집니다.</span>
              </div>

              <div class="spacing__bottom__viewbox"></div>
            </div>
          </div>
        `;
      $(".content").html(contentObj);
      conCur.spacingFn();
      audioPlay(conceptContData.contentsAudio);
    },
    spacingFn: () => {
      conCur.spacingInit();
      // 정답 맞추면 물음표 빈칸 정답으로 채워짐
      for (i = 0; i < conceptContData.cardData.length; i++) {
        if (
          $(".spacing__question__box").val() == conceptContData.cardData[i].val
        ) {
          // 정답에 따라서 타이틀 변경
          $(".spacing__top__title > span").text(
            `${conceptContData.cardData[i].subject}`
          );

          $(".spacing__click__box").on("click", function () {
            if ($(this)[0].dataset.val == $(".spacing__question__box").val()) {
              $(".spacing__question__box").html(this.innerHTML);
              $(".spacing__question__box").removeClass("border__styled");
            }
          });
        }
      }
    },
    spacingInit: () => {
      // 빈칸 정답 초기세팅
      $(".spacing__question__box").val(conceptContData.cardAnswer);

      // 답안 클릭박스 요소추가
      for (i = 0; i < conceptContData.cardData.length; i++) {
        $(".spacing__bottom__viewbox").append(
          `<button class="spacing__click__box" data-val=${conceptContData.cardData[i].val}>${conceptContData.cardData[i].title}</button>`
        );
      }
    },
  },
  // 1-1단원 4차시 DND타입 ///////////안쓰는듯 ? 확인 필요
  dnd: {
    render: () => {
      contentObj = `
            <div class="dnd__container">
              <div class="dnd__top__wrapper">
                <img src="${conceptContData.topImg}"/>
                <div class="dnd__btns__box"></div>

                <div class="dnd__bottom__wrapper">
                  <div class="dnd__btns__bottom">
                  </div>
                </div>
              </div>
            </div>
          `;
      $(".content").html(contentObj);

      dndFn();
      audioPlay(conceptContData.loadAudio);
    },
  },

  // 1-1단원 6차시 comparison타입
  "1_1_6_1": {
    render: () => {
      contentObj = `
                <div class="comparison__container">
                  <div class="comparsion__wrapper">
                    <div class="comparsion__condition__box">
                      <div class="condition__left__box">

                        <div class="condition__row__container">
                          <div class="condition__box__btn">하나 더 적어지면?</div>
                          <div class="apple__img__box">
                            <img src="${conceptContData.img.appleImg}" />
                            <img src="${conceptContData.img.appleImg}" class="aniImg" />
                          </div>

                          <div class="apple__one__box">
                            <div class="one__box oneColor1"></div>
                            <div class="one__box oneColor1 ani_one_box"></div>
                          </div>
                        </div>

                      </div>

                      <div class="condition__center__box">
                        <div class="condition__row__container">
                          <div class="condition__box__btn">⠀</div>
                          <div class="apple__img__box">
                            <img src="${conceptContData.img.appleImg}" />
                            <img src="${conceptContData.img.appleImg}" />
                          </div>

                          <div class="apple__one__box">
                            <div class="one__box oneColor2"></div>
                            <div class="one__box oneColor2"></div>
                          </div>
                        </div>
                        
                      </div>

                      <div class="condition__right__box">

                        <div class="condition__row__container">
                          <div class="condition__box__btn">하나 더 많아지면?</div>

                            <div class="apple__img__box">
                              <img src="${conceptContData.img.appleImg}" />
                              <img src="${conceptContData.img.appleImg}" />
                            </div>

                            <div class="apple__one__box">
                              <div class="one__box oneColor1"></div>
                              <div class="one__box oneColor1"></div>
                              <div class="one__box oneColor1 ani_one_box"></div>
                            </div>
                        
                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              `;
      $(".content").addClass("comparison__type__1161");
      $(".comparison__type__1161").html(contentObj);

      conCur.comparison1_1_6_1Fn();
    },
    comparison1_1_6_1Fn: () => {
      // 초기값 세팅
      // conCur.comparisonInit();
      $(".click__car__character").css("display", "none");

      audio.addEventListener("ended", function () {
        clickTouchGuide(conceptContData.audio.loadAudio);
      });

      const clickTopBoxEl = document.querySelectorAll(
        ".condition__row__container"
      );
      const aniAppleCont = document.querySelectorAll(".apple__img__box");
      const aniCircleEl = document.querySelectorAll(".apple__one__box");

      clickTopBoxEl.forEach((el, idx) => {
        el.addEventListener("click", function () {
          touchAudio.play();
          el.classList.add("disabled");

          if (idx === 0) {
            const appleEl = document.querySelector(".aniImg");
            aniCircleEl[idx].querySelector(".ani_one_box").style.opacity = 0;
            aniAppleCont[idx].removeChild(appleEl);

            nextBtnHandler();
          } else if (idx === 1) {
            addAnimationHandler(aniCircleEl[idx].querySelectorAll(".one__box"));

            setTimeout(() => {
              audioPlay(conceptContData.audio.answerOne);
              clickTopBoxEl[2].classList.add("active");
              clickTouchGuide();
              $(".appleTouchGudio").css({
                top: "24%",
                left: "78%",
              });
            }, 1000);
          } else {
            const appleEl = document.createElement("img");
            appleEl.src = conceptContData.img.appleImg;

            aniAppleCont[idx].appendChild(appleEl);

            aniCircleEl[idx].querySelector(".ani_one_box").style.opacity = 1;

            setTimeout(() => {
              audioPlay(conceptContData.audio.answerTwo);
              clickTopBoxEl[0].classList.add("active");
              clickTouchGuide();
              $(".appleTouchGudio").css({
                top: "24%",
                left: "20%",
              });
            }, 2000);
          }
        });
      });
    },
    comparisonInit: () => {
      $(".condition__epilogue__box").hide();
      $(".condition__step__box").hide();
      $(".comparsion__wrapper>.line").hide();

      $(".apple__one__box > .one__box ").css("opacity", 0);
      $(".apple__one__box > .one__box ").css("transition", "0.5s");
    },
  },

  // 1-6차시 2p
  comparison: {
    render: () => {
      contentObj = `
          <div class="comparison__container">
            <div class="top_cont">
              <img src="${conceptContData.topImg}" alt="비교하기 top 이미지"/>
            </div>

            <ul class="bottom_cont">
              <li>
                <button class="step__box__one step--pink"><span>1</span></button>
                <p class="epilogue__box__cndtnbox step--pink">2보다 1만큼 더 작은 수</p>
              </li>
              <li>
                <button class="step__box__one step--purple disabled"><span>2</span></button>
                <p class="epilogue__box__cndtnbox"></p>
              </li>
              <li>
                <button class="step__box__one step--skyblue"><span>3</span></button>
                <p class="epilogue__box__cndtnbox step--skyblue">2보다 1만큼 더 큰 수</p>
              </li>
            </ul>
          </div>
        `;
      $(".content").addClass("comparison__type");
      $(".comparison__type").html(contentObj);

      conCur.comparisonTypeFn();
    },
    comparisonTypeFn: () => {
      let count = 0;

      // 초기값
      $(".click__car__character").css("display", "none");

      // 첫 가이드, 오디오 재생
      audioPlay(conceptContData.audio.loadAudio);
      $(audioObj).on("ended", function () {
        clickTouchGuide();
        $(".wrap__handbox__target").css({
          top: "62%",
          left: "75%",
        });
      });

      const aniBoxEl = document.querySelectorAll(".epilogue__box__cndtnbox");
      const clickBtnEl = document.querySelectorAll(".step__box__one");

      clickBtnEl.forEach((el, idx) => {
        el.addEventListener("click", function () {
          touchAudio.play();
          el.classList.add("disabled");
          el.classList.add("active");
          setTimeout(() => {
            aniBoxEl[idx].classList.add("active");
          }, 1000);

          if (idx === 2) {
            audioPlay(conceptContData.audio.answerOne);
            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.audio.answerOne02);
              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.audio.loadAudio02);
                clickTouchGuide();
                $(".wrap__handbox__target").css({
                  top: "62%",
                  left: "23%",
                });
              });
            });
          } else {
            audioPlay(conceptContData.audio.answerTwo);
            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.audio.answerTwo02);

              audioObj.addEventListener("ended", function () {
                nextBtnHandler();
              });
            });
          }
        });
      });
    },
  },

  // 1-1단원 6차시 3p comparison타입
  "1_1_6_3": {
    render: () => {
      contentObj = `
                <div class="container__1163">
                  <div class="container__1163__wrap">
                    <div class="top_img">
                      <img src="${conceptContData.topImg}"/>

                      <div class="aniWrap">
                        ${conceptContData.aniImgList
                          .map(
                            (item, idx) =>
                              `<div class="aniCont aniCont${idx + 1}">
                            <img src="${item}"/>
                          </div>`
                          )
                          .join("")}
                      </div>
                    </div>
                    <div class="touch__box__one">

                      <div class="touch__number__box">
                        <div class="standard__word__box">
                          <p>1만큼 더 <span class="word__bundle--color2">큰</span> 수</p>
                          <div class="word__bundle__wrap"></div>
                        </div>

                        <div class="number__title__box" data-val="4">
                          <span class="answer__text__box">?</span>
                        </div>
                      </div>

                      <p class="standard__title__box">3</p>

                      <div class="touch__number__box">
                        <div class="standard__word__box">
                          <p>1만큼 더 <span class="word__bundle--color1">작은</span> 수</p>
                          <div class="word__bundle__wrap"></div>
                        </div>

                        <div class="number__title__box  " data-val="2">
                          <span class="answer__text__box">?</span>
                        </div>
                      </div>
                   
                    </div>

                    <div class="touch__box__one touch__box--two">

                      <div class="touch__number__box">
                        <div class="standard__word__box">
                          <p>1만큼 더 <span class="word__bundle--color2">큰</span> 수</p>
                          <div class="word__bundle__wrap">
                          </div>
                        </div>

                        <div class="number__title__box" data-val="9">
                          <span class="answer__text__box">?</span>
                        </div>
                      </div>

                      <p class="standard__title__box">8</p>

                      <div class="touch__number__box">
                        <div class="standard__word__box">
                          <p>1만큼 더 <span class="word__bundle--color1">작은</span> 수</p>
                          <div class="word__bundle__wrap">
                          </div>
                        </div>

                        <div class="number__title__box" data-val="7">
                          <span class="answer__text__box">?</span>
                        </div>
                      </div>

                    </div>
                    
                  </div>
                  
                </div>
              `;
      $(".content").addClass("_1_1_6_3");
      $("._1_1_6_3").html(contentObj);
      conCur.comparison1_1_6_3Fn();
    },
    comparison1_1_6_3Fn: () => {
      $(".click__car__character").hide();
      // 오디오재생
      audioPlay(conceptContData.audio.loadAudio);
      $(".number__title__box").addClass("eventNone");

      $(audioObj).on("ended", function () {
        $(".number__title__box").eq(0).removeClass("eventNone");
        clickTouchGuide();
        $(".wrap__handbox__target").css({
          top: "51%",
          left: "41%",
        });
      });

      for (let i = 0; i < $(".number__title__box").length; i++) {
        $(".number__title__box")
          .eq(i)
          .on("click", function () {
            touchAudio.play();
            this.innerText = this.dataset.val;

            if (this.innerText == this.dataset.val) {
              if (this.innerText == 4) {
                audioPlay(conceptContData.audio.answer4);
                $(".aniCont2").addClass("active");

                $(audioObj).on("ended", function () {
                  $(".aniCont2").removeClass("active");
                  clickTouchGuide();
                  $(".wrap__handbox__target").css({
                    top: "67%",
                    left: "34%",
                  });
                  $(".number__title__box").eq(1).removeClass("eventNone");
                });
                $(".number__title__box").eq(0).addClass("eventNone");
              }

              if (this.innerText == 2) {
                audioPlay(conceptContData.audio.answer2);
                $(".aniCont1").addClass("active");

                $(".number__title__box").eq(0).addClass("eventNone");
                $(audioObj).on("ended", function () {
                  $(".aniCont1").removeClass("active");
                  clickTouchGuide();
                  $(".wrap__handbox__target").css({
                    top: "18%",
                    left: "60%",
                  });
                  $(".number__title__box").eq(2).removeClass("eventNone");
                });
                $(".number__title__box").eq(0).addClass("eventNone");
              }

              if (this.innerText == 9) {
                audioPlay(conceptContData.audio.answer9);
                $(".aniCont4").addClass("active");

                $(".number__title__box").eq(3).addClass("eventNone");
                $(audioObj).on("ended", function () {
                  $(".aniCont4").removeClass("active");
                  clickTouchGuide();
                  $(".wrap__handbox__target").css({
                    top: "32%",
                    left: "53%",
                  });
                  $(".number__title__box").eq(3).removeClass("eventNone");
                });
                $(".number__title__box").eq(2).addClass("eventNone");
              }

              if (this.innerText == 7) {
                audioPlay(conceptContData.audio.answer7);
                $(".aniCont3").addClass("active");

                $(".number__title__box").eq(2).addClass("eventNone");
                $(audioObj).on("ended", function () {
                  $(".aniCont3").removeClass("active");
                  if (!conData.stop) {
                    nextBtnHandler();
                  } else {
                    stopTopContEl.innerHTML = `
                      <ul>
                        <li class="aniCont">
                          <button class="step__box__one step--pink"><span>7</span></button>
                          <p class="epilogue__box__cndtnbox step--pink">8보다 1만큼 더 작은 수</p>
                          <span class="aniTxt">8 바로 앞의 수</span>
                        </li>
                        <li>
                          <button class="step__box__one step--purple disabled"><span>8</span></button>
                          <p class="epilogue__box__cndtnbox"></p>
                        </li>
                        <li class="aniCont">
                          <button class="step__box__one step--skyblue"><span>9</span></button>
                          <p class="epilogue__box__cndtnbox step--skyblue">8보다 1만큼 더 큰 수</p>
                          <span class="aniTxt">8 바로 뒤의 수</span>
                        </li>
                      </ul>
                    `;

                    showConceptPage(stopTopContEl);
                  }
                });
                $(".number__title__box").eq(2).addClass("eventNone");
              }
            }
          });
      }
    },
  },

  // 1-1 단원 6차시 4p
  "1_1_6_4-1": {
    render: () => {
      contentObj = `
          <ul class="cont-inner">
            ${conceptContData.contList
              .map(
                (item, idx) =>
                  `
                <li class="contWrap">
                  <div class="topImg">
                    <img src="${item.topImg}" alt="top 이미지"/>
                  </div>

                  <div class="apple__one__box"></div>

                  ${
                    idx !== 2
                      ? `<div class="step__box__one step--pink"><span>${item.contTxt}</span></div>`
                      : ``
                  }
                  ${
                    idx === 2
                      ? `
                    <div class="last_q">
                      <div class="q-box">?</div>
                      <p class="descTxt">${conceptContData.aniTxt}</p>
                    </div>
                  `
                      : ``
                  }
                  
                </li>
              `
              )
              .join("")}
          </ul>
          `;
      $(".content").addClass("_1_1_6_4-1");
      $("._1_1_6_4-1").html(contentObj);
      conCur.comparison1_1_6_41Fn();
    },
    comparison1_1_6_41Fn: () => {
      $(".click__car__character").hide();
      const circleAniEl = document.querySelectorAll(".apple__one__box");
      let circleAniCont;

      circleAniEl.forEach((el, idx) => {
        const aniLen = conceptContData.contList[idx].contTxt;
        for (i = 0; i < aniLen; i++) {
          const circleEl = document.createElement("div");
          circleEl.classList.add("one__box");
          circleEl.classList.add("oneColor1");

          el.appendChild(circleEl);
        }
      });

      const contEl = document.querySelectorAll(".contWrap");
      contEl.forEach((el, idx) => {
        if (idx !== 0) {
          el.style.display = "none";
        }
      });

      audio.addEventListener("ended", function () {
        audioPlay(conceptContData.audioList[0]);

        contEl[0].classList.add("active");
        circleAniCont = circleAniEl[0].querySelectorAll(".one__box");
        addAnimationHandler(circleAniCont);

        audioObj.addEventListener("ended", function () {
          audioPlay(conceptContData.audioList[1]);

          contEl[1].style.display = "flex";
          clickTouchGuide();
          $(".wrap__handbox__target").css({
            top: "50%",
            left: "60%",
          });

          circleAniEl[1].addEventListener("click", function () {
            audioPlay(conceptContData.audioList[2]);
            contEl[1].classList.add("active");

            circleAniCont = circleAniEl[1].querySelectorAll(".one__box");
            addAnimationHandler(circleAniCont);

            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.audioList[3]);

              contEl[2].style.display = "flex";

              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.audioList[4]);
                contEl[2].classList.add("on");

                //앞 두개 딤처리
                audioObj.addEventListener("ended", function () {
                  audioPlay(conceptContData.audioList[5]);

                  document.querySelector(".last_q").style.opacity = 1;

                  audioObj.addEventListener("ended", function () {
                    audioPlay(conceptContData.audioList[6]);
                    clickTouchGuide();
                    $(".wrap__handbox__target").css({
                      top: "66%",
                      left: "74%",
                    });

                    document
                      .querySelector(".q-box")
                      .addEventListener("click", function () {
                        this.innerText = "0";
                        audioPlay(conceptContData.audioList[7]);

                        audioObj.addEventListener("ended", function () {
                          stopTopContEl.innerHTML = `
                              <div class="topImg">
                                <img src="${conData.stop.topImg}" alt=" top-img"/>

                                <img src="../../../COMM/IMG/CONCEPT/1_1_6/NUM0.GIF" alt="0 gif" class="gif_img"/>
                              </div>
                            `;

                          showConceptPage(stopTopContEl);
                        });
                      });
                  });
                });
              });
            });
          });
        });
      });

      // // 첫번째 터치유도가이드
      // clickTouchGuide();
      // $(".wrap__handbox__target").css({
      //   top: "57%",
      //   left: "50%",
      // });
      // // 누르면 수판 동그라미 1초 단위로 페이드인
      // $(".apple__one__box").on("click", function () {
      //   audioPlay(conceptContData.audio.answerAudio);

      //   $(".apple__one__box").addClass("eventNone");

      //   for (let i = 0; i < $(".one__box").length; i++) {
      //     setTimeout(() => {
      //       setTimeout(() => {
      //         $(".one__box").eq(i).fadeIn();

      //         setTimeout(() => {
      //           $(".condition__step__box").css("opacity", 1);
      //         }, 2000);
      //       }, i * 1000);
      //     }, 2000);
      //   }

      //   $(audioObj).on("ended", function () {
      //     if (!conData.stop) {
      //       nextBtnHandler();
      //     } else {
      //       showConceptPage();
      //     }
      // });
      // });
    },
  },

  // 1-1 단원 6차시 5p
  "1_1_6_4": {
    render: () => {
      contentObj = `
                <div class="container__1163">
                  <div class="apple__container__box--5p">
                    <div class="apple__bundle__box">

                    <div class="condition__row__container">
                      <div class="apple__img__box">
                      <img src="${conceptContData.img.topImg[2]}" />
                      </div>

                        <div class="apple__one__box">
                          <div class="one__box oneColor1"></div>
                          <div class="one__box oneColor1"></div>
                        </div>

                      <div class="condition__step__box">
                        <div class="step__box__one step--pink">2</div>
                      </div>
                    </div>

                    <div class="condition__row__container">
                      <div class="apple__img__box">
                      <img src="${conceptContData.img.topImg[1]}" />
                      </div>

                      <div class="apple__one__box apple__sel">
                        <div class="one__box oneColor1"></div>
                      </div>
                      
                      <div class="condition__step__box apple__sel">
                        <div class="step__box__one step--pink">1</div>
                      </div>
                    </div>

                    </div>
                  </div>
                </div>
              `;
      $(".content").addClass("_1_1_6_4");
      $("._1_1_6_4").html(contentObj);
      conCur.comparison1_1_6_4Fn();
    },
    comparison1_1_6_4Fn: () => {
      $(".click__car__character").hide();

      // 첫페이지 진입 시 오디오 재생
      clickTouchGuide(conceptContData.audio.loadAudio);
      $(".wrap__handbox__target").css({
        top: "57%",
        left: "55%",
      });

      // 클릭 시 박스안에 원 페이드인
      $(".apple__sel").on("click", function () {
        touchAudio.play();
        $(".apple__sel .one__box").css("opacity", 1);
        $(".apple__sel>.step__box__one").css("opacity", 1);

        // 정답 오디오 재생 후 오디오 끝나면 다음버튼 활성화.
        audioPlay(conceptContData.audio.answerAudio);
        $(audioObj).on("ended", function () {
          if (!conData.stop) {
            nextBtnHandler();
          } else {
            showConceptPage();
          }
        });
      });
    },
  },

  // 1-1 단원 6차시 6p
  "1_1_6_5": {
    render: () => {
      contentObj = `
                <div class="container__1163">
                  <div class="apple__container__box--5p">
                    <div class="apple__bundle__box">

                    <div class="condition__row__container">
                      <div class="apple__img__box">
                        <img src="${conceptContData.img.topImg[2]}" />
                      </div>

                        <div class="apple__one__box">
                          <div class="one__box oneColor1"></div>
                          <div class="one__box oneColor1"></div>
                        </div>

                      <div class="condition__step__box">
                        <div class="step__box__one step--pink">2</div>
                      </div>
                    </div>

                    <div class="condition__row__container">
                      <div class="apple__img__box">
                        <img src="${conceptContData.img.topImg[1]}" />
                      </div>

                        <div class="apple__one__box">
                          <div class="one__box oneColor1"></div>
                        </div>

                      <div class="condition__step__box">
                        <div class="step__box__one step--pink">1</div>
                      </div>
                    </div>

                    <div class="condition__row__container">
                      <div class="apple__img__box">
                        <img src="${conceptContData.img.topImg[0]}" />
                      </div>

                        <div class="apple__one__box apple__sel">
                          <div class="one__box oneColor1"></div>
                        </div>

                      <div class="condition__step__box">
                        <div class="step__box__one step"></div>
                      </div>
                    </div>

                    </div>
                  </div>
                </div>
              `;
      $(".content").addClass("_1_1_6_5");
      $("._1_1_6_5").html(contentObj);
      conCur.comparison1_1_6_5Fn();
    },
    comparison1_1_6_5Fn: () => {
      $(".click__car__character").hide();
      // 첫 페이지 진입 시 오디오재생
      clickTouchGuide(conceptContData.audio.loadAudio);
      $(".wrap__handbox__target").css({
        top: "57%",
        left: "73%",
      });

      $(".apple__sel").on("click", function () {
        touchAudio.play();
        audioPlay(conceptContData.audio.answerAudio);

        $(".apple__sel").addClass("active");
        $(audioObj).on("ended", function () {
          $(".apple__sel").removeClass("active");

          if (!conData.stop) {
            nextBtnHandler();
          } else {
            showConceptPage();
          }
        });
      });
    },
  },

  // 1-1 단원 6차시 7p
  "1_1_6_6": {
    render: () => {
      contentObj = `
                <div class="container__1163">
                  <div class="apple__container__box--5p">
                    <div class="apple__bundle__box">

                    <div class="condition__row__container">
                      <div class="apple__img__box">
                        <img src="${conceptContData.img.topImg[2]}" />
                      </div>

                        <div class="apple__one__box">
                          <div class="one__box oneColor1"></div>
                          <div class="one__box oneColor1"></div>
                        </div>

                      <div class="condition__step__box">
                        <div class="step__box__one step--pink">2</div>
                      </div>
                    </div>

                    <div class="condition__row__container">
                      <div class="apple__img__box">
                        <img src="${conceptContData.img.topImg[1]}" />
                      </div>

                        <div class="apple__one__box">
                          <div class="one__box oneColor1"></div>
                        </div>

                      <div class="condition__step__box">
                        <div class="step__box__one step--pink">1</div>
                      </div>
                    </div>

                    <div class="condition__row__container">
                      <div class="apple__img__box">
                        <img src="${conceptContData.img.topImg[0]}" />
                      </div>

                        <div class="apple__one__box _gap"></div>

                      <div class="condition__step__box">
                      </div>

                      <div class="nothing__step__box">
                        <div class="nothing__answer__box">
                          <span data-val="0">?</span>
                        </div>

                        <p>아무 것도 없는 것</p>
                      </div>
                    </div>

                    </div>
                  </div>
                </div>
              `;
      $(".content").addClass("_1_1_6_6");
      $("._1_1_6_6").html(contentObj);
      conCur.comparison1_1_6_6Fn();
    },
    comparison1_1_6_6Fn: () => {
      // 초기값
      $(".nothing__step__box > p").hide();
      $(".click__car__character").hide();

      // 첫 페이지 진입 시 사운드재생
      clickTouchGuide(conceptContData.audio.loadAudio);
      $(".wrap__handbox__target").css({
        top: "66%",
        left: "73%",
      });
      // 오디오 대사에 맞춰서 페이드인 시킴
      setTimeout(() => {
        $(".nothing__step__box > p").fadeIn();
      }, 6000);

      // 클릭 시 답안 텍스트 ? -> 0으로 변경, 강조 애니메이션
      $(".nothing__answer__box").on("click", function () {
        touchAudio.play();
        audioPlay(conceptContData.audio.answerAudio);

        $(this)[0].children[0].classList.add("active");

        $(".nothing__answer__box span")[0].innerText =
          $(this)[0].children[0].dataset.val;

        // 오디오 끝나면 다음버튼 활성화 or 랜덤페이지 존재하면 활성화
        $(audioObj).on("ended", function () {
          setTimeout(() => {
            if (!conData.stop) {
              nextBtnHandler();
            } else {
              showConceptPage();
            }
            // 랜덤페이지 오디오가 끝난 후 함수종료.
            $(audioObj).on("ended", function () {
              conceptFinished();
            });
          }, 2000);
        });
      });
    },
  },

  // 1-1 단원 7차시 1p
  "1_1_7_1": {
    render: () => {
      contentObj = `
                <div class="container__1171">
                  <div class="container__icon__wrap">
                    <div class="icon__wrap__imgbox">
                      <div class="wrap__imgbox__contents">
                        <div class="aniWrap">
                          <div class="aniLine"></div>
                          <div class="aniLine"></div>
                          <div class="aniLine"></div>
                        </div>
                        <img src="${conceptContData.img.topImg}">

                        <div class="activeWrap"></div>

                        <div class="answer__box__bundle">
                          <div class="spacing__question__box border__styled box__1114__size spacing__question__box1" data-val="4"></div>
                          <div class="spacing__question__box border__styled box__1114__size spacing__question__box2 disabled" data-val="3"></div>
                        </div>
                      </div>
                    </div>

                    <div class="answer__select__wrap">
                      <div class="select__wrap__top">
                        <div class="select__left__imgbox">
                          <img src="${conceptContData.img.dount}" />
                          <span>은</span>
                          <img src="${conceptContData.img.plate}" class="plate" />
                          <span>보다</span>
                        </div>

                        <div class="select__right__box">
                          <div class="select__btn__wrap">
                            <div class="card__box__wrap">많습니다.</div>
                            <div class="card__box__wrap">적습니다.</div>
                          </div>
                        </div>
                      </div>

                      <div class="select__wrap__top">
                        <div class="select__left__imgbox">
                          <img src="${conceptContData.img.arrowRight}" class="arrowRight" />
                          <span>4는 3보다</span>
                        </div>

                        <div class="select__right__box">
                          <div class="select__btn__wrap">
                            <div class="card__box__wrap">큽니다.</div>
                            <div class="card__box__wrap">작습니다.</div>
                          </div>
                        </div>
                      </div>
                    </div>



                  </div>


                  <div class="calculator__box calc__location">
                    <div class="calculator__number__btns">
                      <button data-val="1">1</button>
                      <button data-val="2">2</button>
                      <button data-val="3">3</button>
                      <button data-val="4">4</button>
                      <button data-val="5">5</button>
                      <button data-val="6">6</button>
                      <button data-val="7">7</button>
                      <button data-val="8">8</button>
                      <button data-val="9">9</button>
                      <button data-val="0">0</button>
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
                </div>
              `;
      $(".content").addClass("_1_1_7_1");
      $("._1_1_7_1").html(contentObj);
      conCur.comparison1_1_7_1Fn();
    },
    comparison1_1_7_1Fn: () => {
      $(".click__car__character").hide();

      if (audio) {
        audio.addEventListener("ended", function () {
          // 첫번쩨 가이드
          clickTouchGuide(conceptContData.audio.loadAudio);
          $(".wrap__handbox__target").css({
            top: "30%",
            left: "72%",
          });
        });
      }

      // 빈칸 클릭 시
      $(".spacing__question__box").on("click", function () {
        $(this).addClass("on");
        touchAudio.play();
        // 첫번째 빈칸 계산기나옴
        if (this == $(".spacing__question__box")[0]) {
          $(".calculator__box.calc__location").css("display", "flex");
          $(".calculator__box.calc__location").addClass("question01");

          // 계산기 각 버튼 클릭 시 빈칸에 버튼 dataset값을 텍스트로 변경
          $(".calculator__number__btns > button")
            .off("click")
            .on("click", function () {
              touchAudio.play();
              $(".spacing__question__box")[0].innerText = $(this).data("val");
            });

          // 체크버튼으로 현재 값과 답안의 값을 비교.
          $("#checkBtn")
            .off("click")
            .on("click", function () {
              touchAudio.play();
              // 답이 맞으면 스타일변경, 마우스이벤트방지
              if (
                $(".spacing__question__box").eq(0).text() ==
                $(".spacing__question__box").eq(0).data("val")
              ) {
                $(".spacing__question__box")
                  .eq(0)
                  .removeClass("border__styled");
                $(".spacing__question__box")
                  .eq(0)
                  .addClass("eventNone")
                  .removeClass("on");

                audioPlay(answerAudio);
                audioObj.addEventListener("ended", function () {
                  audioPlay(conceptContData.audio.answerAudio[0]);
                  $(".spacing__question__box2")
                    .addClass("active")
                    .removeClass("disabled");
                });

                $(audioObj).on("ended", function () {
                  clickTouchGuide();
                  $(".wrap__handbox__target").css({
                    top: "44%",
                    left: "72%",
                  });
                });

                $("#checkBtn").off("click");
              } else {
                audioPlay(wrongAudio);
                $(".spacing__question__box")[0].innerText = "";
              }
              $(".calculator__box.calc__location").css("display", "none");
              $(".calculator__box.calc__location").removeClass("question01");
            });

          // 두번째 빈칸 클릭 시 위와 같은 기능.
        } else {
          $(".calculator__box.calc__location").css("display", "flex");
          $(".calculator__box.calc__location").addClass("question02");

          $(".calculator__number__btns > button")
            .off("click")
            .on("click", function () {
              touchAudio.play();
              $(".spacing__question__box")[1].innerText = $(this).data("val");
            });

          $("#checkBtn")
            .off("click")
            .on("click", function () {
              touchAudio.play();
              if (
                $(".spacing__question__box").eq(1).text() ==
                $(".spacing__question__box").eq(1).data("val")
              ) {
                $(".spacing__question__box")
                  .eq(1)
                  .removeClass("border__styled");
                $(".spacing__question__box")
                  .eq(1)
                  .addClass("eventNone")
                  .removeClass("on");
                audioPlay(answerAudio);

                audioObj.addEventListener("ended", function () {
                  audioPlay(conceptContData.audio.answerAudio[1]);
                  setTimeout(() => {
                    setTimeout(() => {
                      addAnimationHandler(
                        document.querySelectorAll(".aniLine")
                      );
                    }, 1000);
                  }, 5000);

                  audioObj.addEventListener("ended", function () {
                    audioPlay(conceptContData.audio.answerAudio[2]);
                    document
                      .querySelector(".activeWrap")
                      .classList.add("active");

                    audioObj.addEventListener("ended", function () {
                      nextBtnHandler();
                    });
                  });
                });

                $("#checkBtn").off("click");
              } else {
                audioPlay(wrongAudio);
                $(".spacing__question__box")[1].innerText = "";
              }

              $(".calculator__box.calc__location").css("display", "none");
              $(".calculator__box.calc__location").removeClass("question02");
            });
        }

        $("#backBtn").on("click", function () {
          touchAudio.play();
          if ($(".calc__location").hasClass("question01")) {
            $(".spacing__question__box1")[0].innerText = "";
          } else {
            $(".spacing__question__box2")[0].innerText = "";
          }
        });

        // 키패드 닫기 기능 추가 (0605)
        $(".calculator__box .closeBtn").on("click", function (e) {
          e.stopPropagation();
          $(".calculator__box").css("display", "none");
          $("#checkBtn").off("click");
          $(".spacing__question__box").removeClass("on");
        });
      });

      // 키패드 외부 영역 클릭 닫기 기능 추가 (0605)
      document.addEventListener("click", function (e) {
        let keypad = document.querySelector(".calculator__box");
        let selectedAnswerBox = document.querySelector(
          ".spacing__question__box.on"
        );

        // 클릭된 요소가 키패드 자신이거나 키패드 내부 요소인 경우 무시
        if (
          e.target.closest(".keypad") === keypad ||
          keypad.contains(e.target) ||
          e.target === selectedAnswerBox
        ) {
          return;
        }

        console.log("키패드 외부 영역 클릭");
        $(".calculator__box #checkBtn").click();
      });
    },
    /**
     * 계산기
     */
    // 뒤로가기
    calcBack: () => {},
    // 완료
    calcComplete: () => {},
    // 키보드 버튼
  },

  // 1-1 단원 7차시 2p
  "1_1_7_2": {
    render: () => {
      contentObj = `
                <div class="container__1171">
                  <div class="container__icon__wrap">
                    <div class="icon__wrap__imgbox">
                      <div class="wrap__imgbox__contents">
                        <div class="aniWrap">
                          <div class="aniLine"></div>
                          <div class="aniLine"></div>
                          <div class="aniLine"></div>
                        </div>
                        <img src="${conceptContData.img.topImg}">

                        <div class="answer__box__bundle">
                          <div class="spacing__question__box  box__1114__size" data-val="4">4</div>
                          <div class="spacing__question__box  box__1114__size" data-val="3">3</div>
                        </div>
                      </div>
                    </div>

                    <div class="answer__select__wrap">
                      <div class="select__wrap__top">
                        <div class="select__left__imgbox">
                          <img src="${conceptContData.img.dount}" />
                          <span>은</span>
                          <img src="${conceptContData.img.plate}" class="plate" />
                          <span>보다</span>
                        </div>

                        <div class="select__right__box">
                          <div class="select__btn__wrap">
                            <div class="card__box__wrap" data-answer=true>많습니다.</div>
                            <div class="card__box__wrap">적습니다.</div>
                          </div>
                        </div>
                      </div>

                      <div class="select__wrap__top">
                        <div class="select__left__imgbox">
                          <img src="${conceptContData.img.arrowRight}" class="arrowRight" />
                          <span>4는 3보다</span>
                        </div>

                        <div class="select__right__box">
                          <div class="select__btn__wrap">
                            <div class="card__box__wrap" data-answer=true>큽니다.</div>
                            <div class="card__box__wrap">작습니다.</div>
                          </div>
                        </div>
                      </div>
                    </div>



                  </div>
                </div>
              `;
      $(".content").addClass("_1_1_7_2");
      $("._1_1_7_2").html(contentObj);
      conCur.comparison1_1_7_2Fn();
    },
    comparison1_1_7_2Fn: () => {
      $(".click__car__character").hide();

      // 첫번째 오디오재생
      audioPlay(conceptContData.audio.loadAudio);
      $(audioObj).on("ended", function () {
        // 오디오 끝나면 터치유도가이드
        clickTouchGuide();
        $(".select__btn__wrap").eq(0).addClass("ready");
      });

      $(".select__btn__wrap")
        .eq(0)
        .children()
        .on("click", function () {
          touchAudio.play();
          $(".select__btn__wrap").eq(0).removeClass("ready");
          $(this).addClass("active").siblings().removeClass("active");
          if (this.dataset.answer === "true") {
            $(".select__btn__wrap").eq(0).addClass("disabled");
            $(this).siblings().addClass("off");
            audioPlay(answerAudio);
            $(audioObj).on("ended", function () {
              audioPlay(conceptContData.audio.answerAudio[0]);
              $(audioObj).on("ended", function () {
                // 오디오 끝나면 터치유도가이드
                clickTouchGuide();
                $(".select__btn__wrap").eq(1).addClass("ready");
              });
            });
          } else {
            audioPlay(wrongAudio);
            setTimeout(() => {
              $(this).removeClass("active");
            }, 1000);
          }
        });

      $(".select__btn__wrap")
        .eq(1)
        .children()
        .on("click", function () {
          touchAudio.play();
          $(".select__btn__wrap").eq(1).removeClass("ready");
          $(this).addClass("active").siblings().removeClass("active");
          if (this.dataset.answer === "true") {
            $(".select__btn__wrap").eq(1).addClass("disabled");
            $(this).siblings().addClass("off");
            audioPlay(answerAudio);
            $(audioObj).on("ended", function () {
              audioPlay(conceptContData.audio.answerAudio[1]);
              nextBtnHandler();
            });
          } else {
            audioPlay(wrongAudio);
            setTimeout(() => {
              $(this).removeClass("active");
            }, 1000);
          }
        });
    },
  },

  // 1-1 단원 7차시 3p
  "1_1_7_3": {
    render: () => {
      contentObj = `
                <div class="container__1171">
                  <div class="container__icon__wrap">
                    <div class="icon__wrap__imgbox">
                      <div class="wrap__imgbox__contents">
                        <div class="aniWrap">
                          <div class="aniLine"></div>
                          <div class="aniLine"></div>
                          <div class="aniLine"></div>
                        </div>
                        <img src="${conceptContData.img.topImg}">

                        <div class="answer__box__bundle">
                          <div class="spacing__question__box  box__1114__size" data-val="4">4</div>
                          <div class="spacing__question__box  box__1114__size" data-val="3">3</div>
                        </div>
                      </div>
                    </div>

                    <div class="answer__select__wrap">
                      <div class="select__wrap__top">
                        <div class="select__left__imgbox">
                          <img src="${conceptContData.img.plate}" class="icon-marin"/>
                          <span>는</span>
                          <img src="${conceptContData.img.dount}" class="plate" />
                          <span>보다</span>
                        </div>

                        <div class="select__right__box">
                          <div class="select__btn__wrap">
                            <div class="card__box__wrap" >많습니다.</div>
                            <div class="card__box__wrap" data-answer=true>적습니다.</div>
                          </div>
                        </div>
                      </div>

                      <div class="select__wrap__top">
                        <div class="select__left__imgbox">
                          <img src="${conceptContData.img.arrowRight}" class="arrowRight" />
                          <span>3은 4보다</span>
                        </div>

                        <div class="select__right__box">
                          <div class="select__btn__wrap">
                            <div class="card__box__wrap">큽니다.</div>
                            <div class="card__box__wrap" data-answer=true>작습니다.</div>
                          </div>
                        </div>
                      </div>
                    </div>



                  </div>
                  
                </div>
              `;
      $(".content").addClass("_1_1_7_2");
      $("._1_1_7_2").html(contentObj);
      conCur.comparison1_1_7_2Fn();
    },
    comparison1_1_7_2Fn: () => {
      $(".click__car__character").hide();

      // 첫번째 오디오재생
      audioPlay(conceptContData.audio.loadAudio);
      $(audioObj).on("ended", function () {
        // 오디오 끝나면 터치유도가이드
        clickTouchGuide();
        $(".select__btn__wrap").eq(0).addClass("ready");
      });

      $(".select__btn__wrap")
        .eq(0)
        .children()
        .on("click", function () {
          touchAudio.play();
          $(".select__btn__wrap").eq(0).removeClass("ready");
          $(this).addClass("active").siblings().removeClass("active");
          if (this.dataset.answer === "true") {
            $(".select__btn__wrap").eq(0).addClass("disabled");
            $(this).siblings().addClass("off");
            audioPlay(answerAudio);
            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.audio.answerAudio[0]);

              $(audioObj).on("ended", function () {
                // 오디오 끝나면 터치유도가이드
                clickTouchGuide();
                $(".select__btn__wrap").eq(1).addClass("ready");
              });
            });
          } else {
            setTimeout(() => {
              $(this).removeClass("active");
            }, 1000);
            audioPlay(wrongAudio);
          }
        });

      $(".select__btn__wrap")
        .eq(1)
        .children()
        .on("click", function () {
          touchAudio.play();
          $(".select__btn__wrap").eq(1).removeClass("ready");
          $(this).addClass("active").siblings().removeClass("active");
          if (this.dataset.answer === "true") {
            $(".select__btn__wrap").eq(1).addClass("disabled");
            $(this).siblings().addClass("off");
            audioPlay(answerAudio);
            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.audio.answerAudio[1]);

              audioObj.addEventListener("ended", function () {
                stopTopContEl.innerHTML = `
                  <div class="top_container">
                    <div class="top_left">
                      <img src="${conData.stop.topImg}"/>
                    </div>
                    <div class="top_right">
                    ${conData.stop.topTxtImg
                      .map(
                        (item) =>
                          `
                      <div class="aniBox">
                        <img src="${item}"/>
                      </div>
                    `
                      )
                      .join("")}
                    </div>
                  </div>
                `;
                showConceptPage(stopTopContEl);

                setTimeout(() => {
                  document.querySelectorAll(".aniBox").forEach((el, idx) => {
                    setTimeout(function () {
                      el.classList.add("active");
                    }, idx * 8000);
                  });
                }, 5000);
              });
            });
          } else {
            setTimeout(() => {
              $(this).removeClass("active");
            }, 1000);
            audioPlay(wrongAudio);
          }
        });
    },
  },

  // 1-1 단원 7차시 2/2 1p
  "1_1_7_21": {
    render: () => {
      contentObj = `
                <div class="container__11721">
                  <div class="content11721__top__imgbox">
                    <img src="${conceptContData.img.lamp}" class="lamp1" />
                    <img src="${conceptContData.img.lamp}" class="lamp2" />
                    <img src="${conceptContData.img.lamp}" class="lamp3" />
                    <img src="${conceptContData.img.lamp}" class="lamp4" />
                    <img src="${conceptContData.img.diamond}" class="diamond1" />
                    <img src="${conceptContData.img.diamond}" class="diamond2" />
                    <img src="${conceptContData.img.diamond}" class="diamond3" />
                    <img src="${conceptContData.img.diamond}" class="diamond4" />
                    <img src="${conceptContData.img.diamond}" class="diamond5" />
                    <img src="${conceptContData.img.diamond}" class="diamond6" />
                  </div>

                  <div class="contents11721__bottom__box">
                    <div class="number__state__box">
                      <img src="${conceptContData.img.lamp}" />

                      <div class="state__box__one">
                        <div>
                          <div class="state__box__one--color1"></div>
                          <div class="state__box__one--color1"></div>
                          <div class="state__box__one--color1"></div>
                          <div class="state__box__one--color1"></div>
                        </div>
                        <div style="opacity: 0">
                          <div class="state__box__one--color1"></div>
                          <div class="state__box__one--color1"></div>
                          <div class="state__box__one--color1"></div>
                          <div class="state__box__one--color1"></div>
                          <div class="state__box__one--color1"></div>
                        </div>
                      </div>
                    </div>

                    <div class="number__state__box">
                      <img src="${conceptContData.img.diamond}" />

                      <div class="state__box__one">
                        <div>
                          <div class="state__box__one--color1"></div>
                          <div class="state__box__one--color1"></div>
                          <div class="state__box__one--color1"></div>
                          <div class="state__box__one--color1"></div>
                          <div class="state__box__one--color1"></div>
                        </div>

                        <div>
                          <div class="state__box__one--color1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              `;
      $(".content").addClass("_1_1_7_21");
      $("._1_1_7_21").html(contentObj);
      conCur.comparison1_1_7_2Fn();
    },
    comparison1_1_7_2Fn: () => {
      // 초기값
      conCur.fn117721__init();

      audio.addEventListener("ended", function () {
        // 첫번째 오디오재생
        audioPlay(conceptContData.audio.loadAudio[0]);
        clickTouchGuide();
        $(".wrap__handbox__target").css({
          top: "61%",
          left: "20%",
        });

        // 첫번째 오디오 끝난 후 터치유도가이드
        $(audioObj).on("ended", function () {
          $(".number__state__box").eq(0).removeClass("eventNone");
        });
      });

      $(".number__state__box").on("click", function () {
        touchAudio.play();
        if (this == $(".number__state__box")[0]) {
          $(".state__box__one").eq(0).children().eq(0).css("opacity", 1);
          // 두번째 오디오재생
          audioPlay(conceptContData.audio.loadAudio[1]);
          clickTouchGuide();
          $(".wrap__handbox__target").css({
            top: "61%",
            left: "62%",
          });

          $(".number__state__box").eq(0).addClass("eventNone");

          $(audioObj).on("ended", function () {
            $(".number__state__box").eq(1).removeClass("eventNone");
          });
        } else {
          $(".state__box__one").eq(1).children().eq(0).css("opacity", 1);
          $(".state__box__one").eq(1).children().eq(1).css("opacity", 1);
          // 세번째 정답 오디오재생
          audioPlay(conceptContData.audio.answerAudio);
          $(".number__state__box").eq(1).addClass("eventNone");

          $(audioObj).on("ended", function () {
            if (!conData.stop) {
              nextBtnHandler();
            } else {
              showConceptPage();
            }
          });
        }
      });
    },
    fn117721__init: () => {
      $(".click__car__character").hide();
      $(".state__box__one").eq(0).children().eq(0).css("opacity", 0);
      $(".state__box__one").eq(0).children().eq(0).css("transition", "0.5s");
      $(".state__box__one").eq(1).children().eq(0).css("opacity", 0);
      $(".state__box__one").eq(1).children().eq(0).css("transition", "0.5s");
      $(".state__box__one").eq(1).children().eq(1).css("opacity", 0);
      $(".state__box__one").eq(1).children().eq(1).css("transition", "0.5s");

      $(".number__state__box").addClass("eventNone");
    },
  },

  // 1-1 단원 7차시 2/2 2p
  "1_1_7_22": {
    render: () => {
      contentObj = `
                <div class="container__11722">
                  <div class="view__top__box">
                    <div class="number__state__box">
                      <img src="${conceptContData.img.lamp}" />

                      <div class="state__box__one">
                        <img src="${conceptContData.img.star[0]}" />
                      </div>
                    </div>

                    <div class="number__state__box">
                      <img src="${conceptContData.img.diamond}" />

                      <div class="state__box__one">
                          <img src="${conceptContData.img.star[1]}" />
                      </div>
                    </div>
                  </div>

                  <div class="view__bottom__box">
                  <div class="answer__select__wrap">
                      <div class="select__wrap__top">
                        <div class="select__left__imgbox">
                          <div class="word_dot"></div>
                          <span>4는 6보다</span>
                        </div>

                        <div class="select__right__box">
                          <div class="select__btn__wrap">
                            <div class="card__box__wrap">큽니다.</div>
                            <div class="card__box__wrap" data-answer=true>작습니다.</div>
                          </div>
                        </div>
                      </div>

                      <div class="select__wrap__top">
                        <div class="select__left__imgbox">
                          <div class="word_dot"></div>
                          <span>6은 4보다</span>
                        </div>

                        <div class="select__right__box">
                          <div class="select__btn__wrap">
                            <div class="card__box__wrap" data-answer=true>큽니다.</div>
                            <div class="card__box__wrap">작습니다.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              `;
      $(".content").addClass("_1_1_7_22");
      $("._1_1_7_22").html(contentObj);
      conCur.comparison1_1_7_22Fn();
    },
    comparison1_1_7_22Fn: () => {
      $(".click__car__character").hide();
      $(".select__btn__wrap").addClass("eventNone");

      // 첫번째 터치유도가이드
      clickTouchGuide();
      $(".select__btn__wrap").eq(0).addClass("ready");
      $(".select__btn__wrap").eq(0).removeClass("eventNone");

      $(".select__btn__wrap")
        .eq(0)
        .children()
        .on("click", function (e) {
          touchAudio.play();
          $(".select__btn__wrap").eq(0).removeClass("ready");
          $(this).addClass("active").siblings().removeClass("active");
          if (e.target.dataset.answer === "true") {
            $(".select__btn__wrap").eq(0).addClass("eventNone");
            $(".select__btn__wrap").eq(0).addClass("disabled");
            $(this).siblings().addClass("off");
            audioPlay(answerAudio);
            $(audioObj).on("ended", function () {
              // 정답 1번 오디오재생
              audioPlay(conceptContData.audio.answerAudio[0]);
              $(audioObj).on("ended", function () {
                // 두번째 터치유도가이드
                clickTouchGuide();
                $(".select__btn__wrap").eq(1).addClass("ready");
                $(".select__btn__wrap").eq(1).removeClass("eventNone");
              });
            });
          } else {
            audioPlay(wrongAudio);
            setTimeout(() => {
              $(this).removeClass("active");
            }, 1000);
          }
        });

      $(".select__btn__wrap")
        .eq(1)
        .children()
        .on("click", function (e) {
          touchAudio.play();
          $(".select__btn__wrap").eq(1).removeClass("ready");
          $(this).addClass("active").siblings().removeClass("active");
          if (e.target.dataset.answer === "true") {
            $(".select__btn__wrap").eq(1).addClass("eventNone");
            $(".select__btn__wrap").eq(0).addClass("disabled");
            $(this).siblings().addClass("off");

            audioPlay(answerAudio);
            // 정답 2번 오디오재생
            $(audioObj).on("ended", function () {
              audioPlay(conceptContData.audio.answerAudio[1]);
              $(audioObj).on("ended", function () {
                stopTopContEl.innerHTML = `
                <div class="top_container">
                  <div class="top01">
                    <span class="top_ani top_ani1"></span>
                    <img src="${conData.stop.topImg01}"/>
                    <span class="top_ani top_ani2"></span>
                  </div>
                  <div class="top02">
                    <img src="${conData.stop.topImg02}"/>
                  </div>
        
                  <div class="txtBox">
                    ${conData.stop.txtImgList
                      .map(
                        (item) =>
                          `
                        <div class="aniBox">
                          <img src="${item}"/>
                        </div>
                      `
                      )
                      .join("")}
                  </div>
        
                </div>
              `;
                showConceptPage(stopTopContEl);

                setTimeout(() => {
                  document.querySelectorAll(".top_ani").forEach((el, idx) => {
                    setTimeout(function () {
                      el.classList.add("active");
                    }, idx * 5000);
                  });
                }, 7000);

                setTimeout(() => {
                  document.querySelectorAll(".aniBox").forEach((el, idx) => {
                    setTimeout(function () {
                      el.classList.add("animated");
                    }, idx * 1500);
                  });
                }, 14000);
              });
            });
          } else {
            audioPlay(wrongAudio);
            setTimeout(() => {
              $(this).removeClass("active");
            }, 1000);
          }
        });
    },
  },

  // 1-2-2차시
  "1_2_2_1": {
    render: () => {
      contentObj = `
        <div class="cont-topWrap cont-topWrap${conceptContData.pageNum}">
            <img src="${
              conceptContData.topImg
            }" alt="상단 이미지" class="topImg"/>
            <img src="${
              conceptContData.topAniImg
            }" alt="상단 이미지 강조" class="top-deco"/>
        </div>
        <div class="cont-bottomWrap">
          ${conceptContData.answerList
            .map(
              (item) =>
                `
              <div class="answerBtn" value=${item.val}>

                <div class="hintEl"><img src="${item.hintImg}"/></div>
                <img src="${item.img}" class="btnImg"/>
              </div>         
            `
            )
            .join("")}
        </div>
      `;
      $(".content").addClass("cont1_2_2_1");
      $(".cont1_2_2_1").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont1_2_2_1();
        });
      } else {
        conCur.cont1_2_2_1();
      }
    },
    cont1_2_2_1: () => {
      const topImgEl = document.querySelector(".cont-topWrap img");
      const topDecoEl = document.querySelector(".top-deco");

      topDecoEl.classList.add("active");
      clickTouchGuide(conceptContData.loadAudio);
      $(".wrap__handbox__target").css({
        top: "70%",
        left: "17%",
      });

      audioObj.addEventListener("ended", function () {
        topDecoEl.classList.remove("active");
      });

      const answerBtnEl = document.querySelectorAll(".answerBtn");

      answerBtnEl.forEach((el, idx) => {
        const correctVal = el.getAttribute("value");

        el.addEventListener("click", function () {
          touchAudio.play();
          topDecoEl.classList.remove("active");

          if (correctVal === "true") {
            console.log("정답");
            audioPlay(answerAudio);
            el.classList.add("disabled");
            el.classList.add("correct");

            el.querySelector(".btnImg").src =
              conceptContData.answerList[idx].onImg;
          } else {
            console.log("오답");
            audioPlay(wrongAudio);

            el.classList.add("active");
            // setTimeout(()=>{
            //   el.classList.remove('active');
            // }, 1000)
          }

          const correctEl = document.querySelectorAll(".answerBtn.correct");

          if (conceptContData.pageNum < 3 && correctEl.length === 3) {
            console.log("정답 세개");
            allCorrect();
          } else if (conceptContData.pageNum === 3 && correctEl.length === 2) {
            console.log("정답 두개 완료");
            allCorrect();
          }

          // 정답 완료
          function allCorrect() {
            document
              .querySelector(".cont-bottomWrap")
              .classList.add("disabled");
            audioObj.addEventListener("ended", function () {
              answerBtnEl.forEach((el, idx) => {
                el.querySelector(".btnImg").src =
                  conceptContData.answerList[idx].img;
              });
              audioPlay(conceptContData.answerAudio);
              setTimeout(() => {
                answerBtnEl.forEach((el, idx) => {
                  if (el.classList.contains("correct")) {
                    el.querySelector(".btnImg").src =
                      conceptContData.answerList[idx].onImg;
                  }
                });

                setTimeout(() => {
                  topDecoEl.classList.add("active");
                }, 2000);
              }, 1000);
              audioObj.addEventListener("ended", function () {
                nextBtnHandler();
              });
            });
          }
        });
      });
    },
  },

  "1_2_2_2": {
    render: () => {
      contentObj = `
        <div class="cont-topWrap dnd__bottom__wrapper">
          <div class="dnd__btns__bottom">
          </div>
        </div>
        <div class="cont-bottomWrap dnd__btns__box">
        </div>
      `;
      $(".content").addClass("cont1_2_2_2");
      $(".cont1_2_2_2").html(contentObj);

      conCur.cont1_2_2_2();
    },
    cont1_2_2_2: () => {
      dndFn();

      if (audio) {
        audio.addEventListener("ended", function () {
          audioPlay(conceptContData.loadAudio);
          const dragItemEl = document.querySelectorAll(
            ".dnd__btns__bottom > div"
          );
          dragItemEl.forEach((el, idx) => {
            el.classList.add("active");

            setTimeout(() => {
              el.classList.remove("active");
            }, 6000);
          });
        });
      }
    },
  },

  // 1-2-3차시
  "1_2_3_1": {
    render: () => {
      contentObj = `
          <div class="cont-left">
            <img src="${conceptContData.topImg}" alt="이미지"/>
          </div>
          <div class="cont-right answerBtn-wrap">
            ${conceptContData.answerList
              .map(
                (item) =>
                  `<p class="answerBtn" data-index=${item.id} value=${item.val}>${item.txt}</p>`
              )
              .join("")}
          </div>
        `;
      $(".content").addClass("cont1_2_3_1");
      $(".cont1_2_3_1").html(contentObj);
      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont1_2_3_1();
        });
      } else {
        conCur.cont1_2_3_1();
      }
    },
    cont1_2_3_1: () => {
      const contImg = document.querySelector(".cont-left");
      const maskImg = document.createElement("img");

      maskImg.classList.add("maskImg");
      maskImg.classList.add(`maskImg${conceptContData.pageNum}`);
      maskImg.src = conceptContData.maskImg;

      contImg.appendChild(maskImg);

      setTimeout(() => {
        contImg.removeChild(maskImg);
      }, 3000);

      clickTouchGuide(conceptContData.loadAudio);

      const answerBtnEl = document.querySelectorAll(".answerBtn");

      answerBtnEl.forEach((el, idx) => {
        const correctVal = el.getAttribute("value");

        el.classList.add("ready");

        el.addEventListener("click", function () {
          touchAudio.play();
          answerBtnEl.forEach((el) => {
            el.classList.remove("ready");
          });
          el.classList.add("active");

          if (correctVal === "true") {
            console.log("정답");
            audioPlay(answerAudio);
            el.classList.add("disabled");
            el.classList.add("correct");
          } else {
            console.log("오답");
            audioPlay(wrongAudio);

            setTimeout(() => {
              el.classList.remove("active");
            }, 1000);
          }

          const correctEl = document.querySelectorAll(".answerBtn.correct");

          if (conceptContData.pageNum !== 3 && correctEl.length === 2) {
            console.log("정답 두개");
            allCorrect();
          } else if (conceptContData.pageNum === 3 && correctEl.length === 1) {
            console.log("정답 한개 완료");
            allCorrect();
          }

          // 정답 완료
          function allCorrect() {
            document.querySelector(".answerBtn-wrap").classList.add("disabled");

            answerBtnEl.forEach((el) => {
              if (!el.classList.contains("correct")) {
                el.classList.add("d-none");
              } else {
                el.classList.add("ready01");
              }
            });

            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.answerAudio);
              contImg.appendChild(maskImg);

              audioObj.addEventListener("ended", function () {
                if (isStopElement) {
                  stopTopContEl.innerHTML = `
                        <div class="top_img">
                        ${conData.stop.topImgList
                          .map(
                            (item, idx) =>
                              `
                          <img src="${item}" class="top_box top_img${idx + 1}"/>
                          `
                          )
                          .join("")}
                        </div>
                      `;
                  showConceptPage(stopTopContEl);
                } else {
                  nextBtnHandler();
                }
              });
            });
          }
        });
      });
    },
  },

  "1_2_3_2": {
    render: () => {
      contentObj = `
          <div class="cont-topWrap">
            ${conceptContData.topImgList
              .map(
                (item, idx) =>
                  `
                <div class="topBox disabled" data-index=${idx + 1}>
                  <img src="${item.img}" alt="topBox${idx + 1}" class="topImg"/>
                  <img src="${
                    item.aniImg
                  }" alt="클릭 강조 효과" class="topAniImg"/>
                </div>
              `
              )
              .join("")}
          </div>

          <div class="cont-bottomWrap cont-bottomWrap${
            conceptContData.pageNum
          }">
              <div class="bottom-table">
                <div class="t-row thead">
                  ${conceptContData.topImgList
                    .map(
                      (item) =>
                        `
                      <div class="td"><img src="${item.img}"/></div>
                    `
                    )
                    .join("")}
                </div>

                <div class="t-row">
                  ${conceptContData.bottomImgList
                    .map(
                      (item, index) =>
                        `
                    <div class="td">
                      <img src="${item.img}" class="thumbImg thumbImg${index}"/>
                      <img src="${item.src}?${new Date().getTime()}" class="videoCont videoCont${index} d-none"/>
                      <button class="videoPlay"></button>
                    </div>
                  `
                    )
                    .join("")}
                </div>

                <div class="t-row">
                  ${conceptContData.bottomImgList
                    .map(
                      (item) =>
                        `<div class="td">
                      ${item.txt}
                    </div>`
                    )
                    .join("")}
                </div>

             
              </div>
          </div>
        `;
      $(".content").addClass("cont1_2_3_2");
      $(".cont1_2_3_2").html(contentObj);

      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont1_2_3_2();
        });
      } else {
        conCur.cont1_2_3_2();
      }
    },
    cont1_2_3_2: () => {
      const topBoxEl = document.querySelectorAll(".topBox");
      const topAniImgEl = document.querySelectorAll(".topAniImg");
      const videoContEl = document.querySelectorAll(".videoCont");
      const thumbImgEl = document.querySelectorAll(".thumbImg");
      const playVideoBtn = document.querySelectorAll(".videoPlay");

      if (conceptContData.pageNum === 1) {
        // 쌓기 부분
        clickTouchGuide();
        topAniImgEl.forEach((el) => {
          el.classList.add("on");
        });
        audioPlay(conceptContData.loadAudioList[0]);
        audioObj.addEventListener("ended", function () {
          audioPlay(conceptContData.loadAudioList[1]);
        });

        topBoxEl.forEach((el, idx) => {
          el.classList.remove("disabled");
          const matchingData = el.getAttribute("data-index");

          el.addEventListener("click", function () {
            touchAudio.play();
            topAniImgEl.forEach((el) => {
              el.classList.remove("on");
            });
            el.querySelector("img").src = conceptContData.topImgList[idx].onImg;
            if (matchingData === "1" || matchingData === "2") {
              console.log("정답");
              audioPlay(answerAudio);
              el.classList.add("disabled");
              el.classList.add("correct");

              const correctEl = document.querySelectorAll(".topBox.correct");

              if (correctEl.length === 2) {
                audioObj.addEventListener("ended", function () {
                  audioPlay(conceptContData.answerAudio);
                });
                document
                  .querySelector(".cont-topWrap")
                  .classList.add("disabled");
                document
                  .querySelector(".cont-bottomWrap")
                  .classList.add("active");
              }
            } else {
              console.log("오답");
              audioPlay(wrongAudio);
              audioObj.addEventListener("ended", function () {
                el.querySelector("img").src =
                  conceptContData.topImgList[idx].img;
                audioPlay(conceptContData.wrongAudio);
              });
            }
          });
        });

        let timeoutId;

        playVideoBtn.forEach((el, idx) => {
          el.addEventListener("click", function () {
            touchAudio.play();

            playVideoBtn.forEach((el) => {
              el.style.display = "block";
            });
            el.style.display = "none";
            videoContEl[idx].classList.add("done");
            $('.cont1_2_3_2 .videoCont').addClass('d-none');
            $('.cont1_2_3_2 .thumbImg').removeClass('d-none');
            
            // 소스 업데이트
            const videoContSelector = `.cont1_2_3_2 .videoCont${idx}`;
            const thumbImgSelector = `.cont1_2_3_2 .thumbImg${idx}`;
            const gifSrc = `../../../COMM/IMG/CONCEPT/1_2_3/BOX02_1_${idx + 1}.GIF?${new Date().getTime()}`;
            
            $(videoContSelector).attr("src", gifSrc).removeClass('d-none');
            $(thumbImgSelector).addClass('d-none');

            // 종료 시
            if (timeoutId) {
              clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
              el.style.display = "block";
              $(videoContSelector).attr("src", gifSrc).addClass('d-none');
              $(thumbImgSelector).removeClass('d-none');
            }, 8000);

            audioPlay(conceptContData.answerAudioList[idx]);

            const donePlayVideo = document.querySelectorAll(".videoCont.done");
            if (donePlayVideo.length === 3) {
              audioObj.addEventListener("ended", function () {
                nextBtnHandler();
              });
            }
          });
        });
      } else {
        // 굴리기 부분
        clickTouchGuide(conceptContData.loadAudio);
        topAniImgEl[0].classList.add("on");
        topBoxEl[0].classList.remove("disabled");

        topBoxEl.forEach((el, idx) => {
          el.addEventListener("click", function () {
            touchAudio.play();
            el.classList.add("disabled");
            topAniImgEl.forEach((el) => {
              el.classList.remove("on");
            });
            el.querySelector("img").src = conceptContData.topImgList[idx].onImg;

            thumbImgEl[idx].classList.add("d-none");
            videoContEl[idx].classList.remove("d-none");
            videoContEl[idx].classList.add("done");
            
            if (idx === 0) {
              videoContEl[0].setAttribute("src", "../../../COMM/IMG/CONCEPT/1_2_3/BOX02_2_1.GIF" + "?" + new Date().getTime());
              setTimeout(() => {
                $('.videoCont').addClass('d-none');
                $('.thumbImg').removeClass('d-none');
                updateImageAndHandleState();
              }, 4000);
            } else if (idx === 1) {
              videoContEl[1].setAttribute("src", "../../../COMM/IMG/CONCEPT/1_2_3/BOX02_2_2.GIF" + "?" + new Date().getTime());
              setTimeout(() => {
                $('.videoCont').addClass('d-none');
                $('.thumbImg').removeClass('d-none');
                updateImageAndHandleState();
              }, 10000);
            } else if (idx === 2) {
              videoContEl[2].setAttribute("src", "../../../COMM/IMG/CONCEPT/1_2_3/BOX02_2_3.GIF" + "?" + new Date().getTime());
              setTimeout(() => {
                $('.videoCont').addClass('d-none');
                $('.thumbImg').removeClass('d-none');
                updateImageAndHandleState();
              }, 6000);
            }

            audioPlay(conceptContData.answerAudioList[idx]);

            function updateImageAndHandleState() {
              el.querySelector("img").src = conceptContData.topImgList[idx].img;

              if (idx < 2) {
                topAniImgEl[idx + 1].classList.add("on");
                topBoxEl[idx + 1].classList.remove("disabled");
              } else {
                const donePlayVideo =
                  document.querySelectorAll(".videoCont.done");
                if (donePlayVideo.length === 3) {
                  // conceptFinished();

                  if (isStopElement) {
                    stopTopContEl.innerHTML = `
                      <div class="top-table">
                        ${conData.stop.topContList
                          .map(
                            (item) =>
                              `
                            <div class="t-row ${
                              item.id === 1
                                ? "thead"
                                : `ani-trow ani-trow${item.id}`
                            }">
                            ${item.innerCont
                              .map(
                                (el) =>
                                  `
                                <div class="td ">
                                  ${
                                    item.id === 1
                                      ? `
                                    <img src="${el}" alt="도형 이미지"/>
                                  `
                                      : `
                                  ${el}
                                  `
                                  }
                                </div>
                              `
                              )
                              .join("")}
                            
                            </div>
                          `
                          )
                          .join("")}
                      </div>
                      `;
                    showConceptPage(stopTopContEl);
                  }
                }
              }
            };
          });
        });
      }
    },
  },

  // 1-2-4차시
  "1_2_4_1": {
    render: () => {
      contentObj = `
          <div class="cont-topWrap">
          ${
            conceptContData.pageNum === 1
              ? `
              <img src="${conceptContData.topImg}" alt="이미지" class="top-img"/>
            `
              : `
              <h2>${conceptContData.topTxt}</h2>
            `
          }
          </div>
          <div class="cont-bottomWrap answerBtn-wrap">
            ${conceptContData.answerList
              .map(
                (item) =>
                  `<p class="answerBtn" data-index=${item.id} value=${item.val}><img src="${item.img}"/></p>`
              )
              .join("")}
          </div>
        `;
      $(".content").addClass("cont1_2_4_1");
      $(".content").addClass(`cont1_2_4_1_${conceptContData.pageNum}`);
      $(".cont1_2_4_1").html(contentObj);
      if (audio) {
        audio.addEventListener("ended", function () {
          conCur.cont1_2_4_1();
        });
      } else {
        conCur.cont1_2_4_1();
      }
    },
    cont1_2_4_1: () => {
      const topImgEl = document.querySelector(".cont-topWrap .top-img");
      audioPlay(conceptContData.loadAudioList[0]);
      audioObj.addEventListener("ended", function () {
        clickTouchGuide();
        topImgEl.src = conceptContData.topAniImg;
        audioPlay(conceptContData.loadAudioList[1]);

        setTimeout(() => {
          topImgEl.src = conceptContData.topImg;
        }, 3000);

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
              el.classList.add("disabled");
              el.classList.add("correct");
            } else {
              console.log("오답");

              audioPlay(wrongAudio);
              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.wrongAudio);

                if (conceptContData.pageNum === 2) {
                  topImgEl.src = conceptContData.topAniImg;

                  audioObj.addEventListener("ended", function () {
                    topImgEl.src = conceptContData.topImg;
                  });
                }
              });
              setTimeout(() => {
                el.classList.remove("active");
              }, 1000);
            }

            const correctEl = document.querySelectorAll(".answerBtn.correct");

            if (conceptContData.pageNum === 1 && correctEl.length === 2) {
              console.log("정답 두개 완료");

              document
                .querySelector(".answerBtn-wrap")
                .classList.add("disabled");

              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.answerAudio);
                audioObj.addEventListener("ended", function () {
                  nextBtnHandler();
                });
              });

              answerBtnEl.forEach((el) => {
                if (!el.classList.contains("correct")) {
                  el.classList.add("off");
                }
              });
            } else if (
              conceptContData.pageNum === 2 &&
              correctEl.length === 1
            ) {
              console.log("정답 한개 완료");
              document
                .querySelector(".answerBtn-wrap")
                .classList.add("disabled");

              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.answerAudio);
                audioObj.addEventListener("ended", function () {
                  audioPlay(conceptContData.answerAudio2);
                  audioObj.addEventListener("ended", function () {
                    nextBtnHandler();
                  });
                });
              });

              answerBtnEl.forEach((el) => {
                if (!el.classList.contains("correct")) {
                  el.classList.add("off");
                }
              });
            }
          });
        });
      });
    },
  },

  "1_2_4_2": {
    render: () => {
      contentObj = `
          <div class="cont-left">
            <img src="${conceptContData.topImg}" alt="이미지"/>
          </div>
          <div class="cont-right">
            <div class="figure-table">

              ${conceptContData.answerList
                .map(
                  (item) =>
                    `
                  <div class="t-row">
                    <div class="th"><img src="${item.img}"/></div>
                    <div class="td" value=${item.val}>
                      <span class="q-box q-box-s2 disabled">?</span>개
                    </div>
                  </div>
                `
                )
                .join("")}
            </div>
          </div>
        `;

      $(".content").addClass("cont1_2_4_2");
      $(".cont1_2_4_2").html(contentObj);
      audio.addEventListener("ended", function () {
        conCur.cont1_2_4_2();
      });
    },
    cont1_2_4_2: () => {
      const answerBox = document.querySelectorAll(".q-box");

      keypadEvent(answerBox);
    },
  },

  // 1-1단원 2,3 차시 랜덤 퀴즈페이지 타입
  stop: {
    render: () => {
      contentObj = `
          <div class="randomQuestion__wrapper">
            <div class="randomQ__epilogue__imgbox">
              <img class="randomQ__top__img" src="${conceptContData.topImg}"/>
            </div>

            <div class="commentary__wrapper">
              <img src="${conceptContData.bottomImg}" />
            </div>
          </div>
        `;
      $(".content").html(contentObj);
      conCur.randomQuestionFn();
      conCur.aniStart();
      audioPlay(conceptContData.sound);
    },
    randomQuestionFn: () => {
      // 초기값
      $(".header").css("display", "none");
      $(".click__car__character").css("display", "none");
      $(".content-inner").css("overflow", "hidden");
      $(".pagination").css("display", "none");
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
  },
  // 1-1단원 5차시 DND :: 순서대로 수를 놓아 봅시다.
  numberDnD: {
    render: () => {
      contentObj = `
      <div class="dnd__container ${conceptContData.contentClass}">
        <div class="dnd__top__wrapper">
          <div class="dnd__btns__box"></div>

          <div class="dnd__bottom__wrapper">
            <div class="dnd__btns__bottom">
            </div>
          </div>
        </div>
      </div>
      `;
      $(".content").addClass("numberDnD");
      $(".numberDnD").html(contentObj);

      conCur.numberDnDFn();
    },
    numberDnDFn: () => {
      if (audio) {
        audio.addEventListener("ended", function () {
          audioPlay(conceptContData.loadAudio);

          showCharacterHandler();
          const charDesc = document.createElement("div");
          charDesc.classList.add("guide-desc");

          if (conceptContData.contentClass === "cont_1_1_5_2") {
            charDesc.innerText = `9부터 1까지 거꾸로 세어 보려고 해.`;
          } else {
            charDesc.innerText = `1부터 9까지 수를 순서대로 놓아 보자.`;
          }

          document
            .querySelector(".click__car__character")
            .appendChild(charDesc);

          setTimeout(() => {
            charDesc.style.opacity = 1;
          }, 1000);
        });
      }

      dndFn();
    },
  },

  // 1-1단원 4차시 DND :: 수로 순서를 나타내 봅시다.
  orderDnD: {
    render: () => {
      contentObj = `
      <div class="dnd__container">
        <div class="dnd__top__wrapper">
          <img src="${conceptContData.topImg}"/>
          <div class="dnd__btns__box"></div>

          <div class="dnd__bottom__wrapper">
            <div class="dnd__btns__bottom">
            </div>
          </div>
        </div>
      </div>
      `;
      $(".content").addClass("orderDnD");
      $(".orderDnD").html(contentObj);
      $(".click__car__character").hide();
      conCur.orderDnDFn();
    },
    orderDnDFn: () => {
      if (audio) {
        audio.addEventListener("ended", function () {
          audioPlay(conceptContData.loadAudio);
        });
      } else {
        audioPlay(conceptContData.loadAudio);
      }

      dndFn();
      // hdwadEnds(conceptContData.)

      // 페이지 로드 시 사운드 자동플레이
      // if (conceptContData.loadAudio) {
      //   playAudio(conceptContData.loadAudio);
      // }
    },
  },

  // 1-1단원 4차시 IMG reverse DND 타입 :: 수로 순서를 나타내 봅시다.
  reverseDnD: {
    render: () => {
      contentObj = `
      <div class="dnd__container">
        <div class="dnd__top__wrapper">
          <div class="dnd__top__reverse">
            <img src="${conceptContData.topImg}"/>
            <div class="dnd__btns__box"></div>
          </div>

          <div class="dnd__bottom__wrapper">
            <div class="dnd__btns__bottom">
            </div>
          </div>
        </div>
      </div>
      `;
      $(".content").addClass("reverseDnD");
      $(".reverseDnD").html(contentObj);
      $(".click__car__character").hide();
      conCur.reverseDnDFn();
    },
    reverseDnDFn: () => {
      audioPlay(conceptContData.loadAudio[0]);
      dndFn();

      const dropItem = document.querySelectorAll(".dnd__epilogue");

      dropItem.forEach((el, idx) => {
        if (idx < 3) {
          el.classList.add("aniBox");
        }
      });

      const aniBoxEl = document.querySelectorAll(".dnd__epilogue.aniBox");

      aniBoxEl.forEach((el, idx) => {
        // setTimeout(()=>{
        el.classList.add("on");
        // }, idx * 1000)
      });

      audioObj.addEventListener("ended", function () {
        audioPlay(conceptContData.loadAudio[1]);
      });

      // playAudio(conceptContData.loadAudio);
    },
  },

  // 1-1단원 :: 4차시 기준을 넣어 순서대로 말해봅시다.
  selectOrder: {
    render: () => {
      contentObj = `
        <div class="selectOrder__wrapper">
          <img class="selectOrder__top__img" src="${conceptContData.topImg}" />

          <div class="anibox__container">
            <div class="selectOrder__number__anibox">
              <div class="number__anibox_cont number__anibox__top"></div>

              <div class="number__anibox_cont number__anibox__bottom"></div>
            </div>
          </div>

          <div class="selectOrder__epilogue__box">
            <div class="epilogue__box__answer">
              <div class="answer__text__wrap">
                <div class="text__dot__one"></div>
                <div class="text__span__word">
                  <span>${conceptContData.fruits.mandarin}은 왼쪽에서 셋째에 있습니다.</span>
                </div>
              </div>

              <div class="answer__text__wrap">
                <div class="text__dot__one"></div>
                <div class="text__span__word">
                  <span>${conceptContData.fruits.mandarin}은 오른쪽에서 여섯째에 있습니다.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      $(".content").addClass("selectOrder");
      $(".selectOrder").html(contentObj);
      conCur.selectOrderFn();
    },
    selectOrderFn: () => {
      $(".click__car__character").css("display", "none");

      for (i = 0; i < conceptContData.leftOne.length; i++) {
        let cont = conceptContData.leftOne[i];
        $(".number__anibox__top").append(
          `<div class="anibox__top__one">${cont}</div>`
        );
      }

      for (j = 0; j < conceptContData.rightOne.length; j++) {
        let cont = conceptContData.rightOne[j];
        $(".number__anibox__bottom").append(
          `<div class="anibox__top__one">${cont}</div>`
        );

        if (audio) {
          audio.addEventListener("ended", function () {
            selectIntro();
          });
        } else {
          selectIntro();
        }
      }
    },
  },

  // 1-1단원 :: 4차시 기준을 넣어 순서대로 말해봅시다2page.
  selectOrderDnD: {
    render: () => {
      contentObj = `
      <div class="selectOrder__wrapper">
      <img class="selectOrder__top__img" src="${conceptContData.topImg}" />

      <div class="anibox__container">
        <div class="selectOrder__number__anibox">
          <div class="number__anibox_cont number__anibox__top"></div>

          <div class="number__anibox_cont number__anibox__bottom"></div>
        </div>
      </div>

      <div class="selectOrder__epilogue__box">
        <div class="epilogue__box__answer">
          <div class="answer__text__wrap">
            <div class="text__dot__one"></div>
            <div class="text__span__word">
                <span class="fruits__box">${conceptContData.fruits.watermelon}</span>
                  <span>은 왼쪽에서</span>
                  <div class="droppable spacing__question__box--smallsize border__styled spacing__question__box box__1114__size" data-val="5">?</div>
                  <span>에 있습니다.</span>
            </div>
          </div>

          <div class="answer__text__wrap">
            <div class="text__dot__one"></div>
            <div class="text__span__word">
                <span class="fruits__box">${conceptContData.fruits.watermelon}</span>
                <span>은 오른쪽에서</span>
                <div class="droppable spacing__question__box--smallsize border__styled spacing__question__box box__1114__size" data-val="4">?</div>
                <span>에 있습니다.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="epilogue__box__dragbox">
        <div class="dragbox__answer__box draggable" data-val="4">넷째</div>
        <div class="dragbox__answer__box draggable" data-val="5">다섯째</div>
        <div class="dragbox__answer__box draggable" data-val="6">여섯째</div>
      </div>
    </div>
      `;
      $(".content").addClass("selectOrderDnD");
      $(".selectOrderDnD").html(contentObj);
      conCur.selectOrderDnDFn();
    },
    selectOrderDnDFn: () => {
      let answerCount = 0;

      $(".click__car__character").css("display", "none");
      clickTouchGuide();

      // oneBox 요소추가
      for (i = 0; i < conceptContData.leftOne.length; i++) {
        let cont = conceptContData.leftOne[i];
        $(".number__anibox__top").append(
          `<div class="anibox__top__one">${cont}</div>`
        );
      }

      for (j = 0; j < conceptContData.rightOne.length; j++) {
        let cont = conceptContData.rightOne[j];
        $(".number__anibox__bottom").append(
          `<div class="anibox__top__one">${cont}</div>`
        );
      }

      // 정답 시 1~n 원 박스 애니메이션
      function onBoxAni() {
        for (let i = 0; i < $(".anibox__top__one").length; i++) {
          setTimeout(() => {
            $(".anibox__top__one").eq(i).css("opacity", 1);
          }, i * 500);
        }
      }
      audioPlay(conceptContData.loadAudio);

      // 드래그기능
      $(".draggable")
        .draggable()
        .on("draggable:start", function (drop, drag) {
          touchAudio.play();

          $(".draggable").removeClass("dragging");
          $(this).addClass("dragging");
          $(".draggable:not(.dragging)")
            .css("pointer-events", "")
            .css("transform", "");
        })
        .on("draggable:stop", function (drop, drag) {
          $(this).removeClass("dragging");
        });

      // 드롭 기능
      $(".droppable")
        .droppable({
          hoverClass: "active",
        })
        .on("droppable:drop", function (drop, drag) {
          let dragVal = drag.item[0].dataset.val;
          let dropVal = drop.target.dataset.val;

          // 드래그드롭 값이 동일하면 빈칸 정답 채워짐
          if (dragVal == dropVal) {
            this.innerText = "";
            drop.target.textContent = drag.item[0].innerText;
            drag.item[0].style.display = "none";
            drop.target.className = "answer__style__1114";

            answerCount++;

            audioPlay(answerAudio);

            // 정답을 다 맞추면 dnd보기영역 감추고, 정답 오디오 재생
            if (answerCount === 2) {
              $(".epilogue__box__dragbox").hide();

              onBoxAni();
              audioPlay(conceptContData.answerAudio);

              if (!conData.stop) {
                nextBtnHandler();
              } else {
                showConceptPage();
              }

              conceptFinished();
            }
          } else {
            audioPlay(wrongAudio);
            return false;
          }
        });
    },
  },

  keypadCompare: {
    render: () => {
      contentObj = `

      `;
      $(".content").addClass("keypadCompare");
      $(".keypadCompare").html(contentObj);
      conCur.keypadCompareFn();
      audioPlay();
    },
    keypadCompareFn: () => {},
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
    // conceptContData = conData.stop;
    // conCur = conTypeInfo["stop"];
    isStopElement = true;
  } else {
    isStopElement = false;
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

  if (conData.stop.stopClass === "stop_1_1_6") {
    const aniContEl = document.querySelectorAll(".aniCont");

    audioPlay(conData.stop.topSoundList[0]);
    aniContEl[1].classList.add("active");
    audioObj.addEventListener("ended", function () {
      audioPlay(conData.stop.topSoundList[1]);
      aniContEl[0].classList.add("active");

      // 위쪽 애니메이션 완료 후
      audioObj.addEventListener("ended", function () {
        audioPlay(conData.stop.bottomSoundList[0]);
        audioObj.addEventListener("ended", function () {
          audioPlay(conData.stop.bottomSoundList[1]);
        });
      });
    });
  } else if (conData.stop.stopClass === "stop_1_1_6_2") {
    audioPlay(conData.stop.topSoundList[0]);
    audioObj.addEventListener("ended", function () {
      audioPlay(conData.stop.topSoundList[1]);

      audioObj.addEventListener("ended", function () {
        audioPlay(conData.stop.bottomSound);
      });
    });
  } else if (conData.stop.stopClass === "stop_1_2_2") {
    // 1-2-2차시
    console.log("2단원 2차시");
    const boxEl = document.querySelectorAll(".boxWrap");
    const boxTxtEl = document.querySelectorAll(".boxWrap h3");
    const figureImgEl = document.querySelectorAll(".figureImg img");

    //이미지 변경
    function playAudioAndChangeImages(soundList, imgList, boxElement, index) {
      audioPlay(soundList[index].sound01);

      setTimeout(() => {
        boxElement.querySelectorAll(".changeAni").forEach((el, idx) => {
          el.src = imgList[index].onImgList[idx];
        });
        figureImgEl[index].src = imgList[index].figureOn;
      }, 1000);

      if (index === 2) {
        setTimeout(() => {
          boxTxtEl[index].classList.add("active");
        }, 4000);
      }

      audioObj.addEventListener("ended", function () {
        if (soundList[index].sound02) {
          audioPlay(soundList[index].sound02);
          setTimeout(() => {
            boxTxtEl[index].classList.add("active");
          }, 4000);

          audioObj.addEventListener("ended", function () {
            playNextSound(soundList, index + 1);
          });
        } else {
          playNextSound(soundList, index + 1);
        }
      });
    }

    // 다음 음성
    function playNextSound(soundList, currentIndex) {
      removeOnImg(currentIndex - 1);
      if (currentIndex < soundList.length) {
        playAudioAndChangeImages(
          conData.stop.topSoundList,
          conData.stop.topImgList,
          boxEl[currentIndex],
          currentIndex
        );
      } else {
        audioPlay(conData.stop.bottomSound);
      }

      function removeOnImg(index) {
        figureImgEl[index].src = conData.stop.topImgList[index].figure;
        boxEl[index].querySelectorAll(".changeAni").forEach((el, idx) => {
          el.src = conData.stop.topImgList[index].imgList[idx];
        });
      }
    }

    playAudioAndChangeImages(
      conData.stop.topSoundList,
      conData.stop.topImgList,
      boxEl[0],
      0
    );
  } else if (conData.stop.stopClass === "stop_1_2_3") {
    // 1-2-3차시
    console.log("2단원 3차시");
    const topBoxEl = document.querySelectorAll(".top_box");

    function playAudioAndSetImages(index) {
      if (index < 3) {
        audioPlay(conData.stop.bottomSoundList[index]);
        topBoxEl[index].src = conData.stop.topAniImgList[index].aniImg1;
      }

      if (index > 0) {
        topBoxEl[index - 1].src = conData.stop.topImgList[index - 1];
      }

      if (index < 2) {
        setTimeout(() => {
          topBoxEl[index].src = conData.stop.topAniImgList[index].aniImg2;
        }, 3000);
      }
    }

    audioPlay(conData.stop.topSound);
    audioObj.addEventListener("ended", function () {
      playAudioAndSetImages(0);
      audioObj.addEventListener("ended", function () {
        playAudioAndSetImages(1);
        audioObj.addEventListener("ended", function () {
          playAudioAndSetImages(2);
          audioObj.addEventListener("ended", function () {
            playAudioAndSetImages(3);
          });
        });
      });
    });
  } else if (conData.stop.stopClass === "stop_1_2_3_2") {
    // 1-2-3차시 2번 개념
    const trowEl = document.querySelectorAll(".ani-trow");

    audioPlay(conData.stop.bottomSoundList[0]);
    trowEl[0].classList.add("active");

    audioObj.addEventListener("ended", function () {
      audioPlay(conData.stop.bottomSoundList[1]);
      trowEl[1].classList.add("active");
    });
  } else if (conData.stop.stopClass === "stop_1_2_4") {
    // 1-2-4차시
    console.log("2단원 4차시");
    const theadEl = document.querySelectorAll(".aniImg");

    const answerBoxEl = document.querySelectorAll(".q-box-ani");

    function animateImg(index, imgDelayTime, txtDelayTime) {
      theadEl[index].src = conData.stop.tableOnImgList[index];

      setTimeout(() => {
        addAnimationHandler(
          document.querySelectorAll(`.top-aniBox0${index + 1} img`)
        );
        setTimeout(() => {
          answerBoxEl[index].innerText =
            answerBoxEl[index].getAttribute("value");
          theadEl[index].src = conData.stop.answerList[index].img;
        }, txtDelayTime);
      }, imgDelayTime);
    }

    audioPlay(conData.stop.topSoundList[0]);
    audioObj.addEventListener("ended", function () {
      audioPlay(conData.stop.topSoundList[1]);
      animateImg(0, 3000, 1000);

      audioObj.addEventListener("ended", function () {
        audioPlay(conData.stop.topSoundList[2]);
        animateImg(1, 3000, 1500);

        audioObj.addEventListener("ended", function () {
          audioPlay(conData.stop.topSoundList[2]);
          animateImg(2, 3000, 1500);

          audioObj.addEventListener("ended", function () {
            audioPlay(conData.stop.bottomSound);
          });
        });
      });
    });
  }

  if (conData.stop.sound) {
    audioPlay(conData.stop.sound);
  } else if (conData.stop.soundList) {
    audioPlay(conData.stop.soundList[0]);
    audioObj.addEventListener("ended", function () {
      audioPlay(conData.stop.soundList[1]);
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
function addReverseAnimationHandler(element) {
  const elementArray = Array.from(element);

  elementArray.reverse().forEach((el, index) => {
    setTimeout(function () {
      el.classList.add("animated");
    }, index * 500);
  });
}

// dndFn
function dndFn() {
  let dragRandomCard = shufflee(conceptContData.dragCardData);
  // drag 박스 셔플
  let dropRandomCard = conceptContData.dropCardData;

  if (audio) {
    audio.addEventListener("ended", function () {
      clickTouchGuide();
    });
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
          conceptContData.type !== "1_2_2_2"
            ? `
          ${dragRandomCard[i].txt}
        `
            : `
          <img src="${dragRandomCard[i].img}"/>
          <img src="${dragRandomCard[i].onImg}" class="aniImg"/>
        `
        }
        </div>
        `;
    $(".dnd__btns__bottom").append(dragItem);
  }

  for (i = 0; i < dropRandomCard.length; i++) {
    const dropItem = `
        <div data-val=${dropRandomCard[i].val} class="dnd__epilogue ${
      dropRandomCard[i].droppable ? "droppable border__styled" : ""
    }">
        ${
          conceptContData.type !== "1_2_2_2"
            ? `
          ${dropRandomCard[i].droppable ? "?" : dropRandomCard[i].txt}
        `
            : ``
        }
        </div>
      `;

    $(".dnd__btns__box").append(dropItem);
  }

  $(".draggable")
    .draggable()
    .on("draggable:start", function (dropp, drag) {
      touchAudio.play();

      $(".draggable").removeClass("dragging");
      $(this).addClass("dragging");
      $(".draggable:not(.dragging)")
        .css("pointer-events", "")
        .css("transform", "");
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
        console.log("정답");
        dropp.target.className = "dnd__epilogue";
        if (conceptContData.type !== "1_2_2_2") {
          dropp.target.textContent = "";
        }
        drag.item.addClass("eventNone");
        audioPlay(answerAudio);
      } else {
        audioPlay(wrongAudio);
        return false;
      }

      audioObj.addEventListener("ended", function () {
        // 정답 시 오디오재생
        if ($(".dnd__btns__box .border__styled").length === 0) {
          if (conceptContData.normalAnswerAudio) {
            audioPlay(conceptContData.normalAnswerAudio);
          }

          if (conceptContData.answerAudioList) {
            audioPlay(conceptContData.answerAudioList[0]);

            if (conceptContData.type === "numberDnD") {
              //1-1-5차시 강조 효과
              const aniCont = document.querySelectorAll(".dnd__epilogue");
              aniCont.forEach((el, idx) => {
                setTimeout(function () {
                  if (idx > 0) {
                    aniCont.forEach((el) => {
                      el.classList.remove("animated");
                    });
                  }
                  el.classList.add("animated");
                }, idx * 1100);

                audioObj.addEventListener("ended", function () {
                  aniCont.forEach((el) => {
                    el.classList.remove("animated");
                  });
                });
              });
            }

            audioObj.addEventListener("ended", function () {
              audioPlay(conceptContData.answerAudioList[1]);

              if (isStopElement && conData.stop.stopClass === "stop_1_1_5") {
                audioObj.addEventListener("ended", function () {
                  stopTopContEl.innerHTML = `
                    <ul>
                      ${conData.stop.stopContList
                        .map(
                          (item, idx) =>
                            `
                        <li class="stop_ani_wrap">
                          <span class="stop_ani_num">${idx + 1}</span>
                          <span class="stop_ani_txt">${item}</span>
                        </li>
                        `
                        )
                        .join("")} 
                    </ul>
                  `;
                  showConceptPage(stopTopContEl);
                  document
                    .querySelectorAll(".stop_ani_wrap")
                    .forEach((el, idx) => {
                      setTimeout(function () {
                        el.classList.add("animated");
                      }, idx * 1000);
                    });
                });
              }
            });
          }

          if (isStopElement) {
            if (conData.stop.stopClass === "stop_1_1_4") {
              stopTopContEl.innerHTML = `
                    <div class="top_img">
                      <img src="${conData.stop.topImg}" alt="top_img"/>
                    </div>
                    <ul class="stop_ani_wrap">
                      ${conData.stop.aniList
                        .map(
                          (item) =>
                            `
                        <li class="aniBox">
                          ${item}<span>째</span>
                        </li>
                        `
                        )
                        .join("")}
                    </ul>
                  `;
              showConceptPage(stopTopContEl);
            } else if (conData.stop.stopClass === "stop_1_2_2") {
              stopTopContEl.innerHTML = `
                    <div class="top_img">
                      ${conData.stop.topImgList
                        .map(
                          (item) => `
                        <div class="boxWrap">
                          <div class="figureImg"><img src="${
                            item.figure
                          }" alt="도형이미지"/></div>
                          <div class="boxInner">
                            ${item.imgList
                              .map(
                                (el) =>
                                  `<div class="box"><img src="${el}" class="changeAni"/></div>`
                              )
                              .join("")}
                          </div>
                          <h3>${item.txt} 모양</h3>
                        </div>
                      `
                        )
                        .join("")}
                    </div>
                  `;
              showConceptPage(stopTopContEl);
            }

            addAnimationHandler(document.querySelectorAll(".aniBox"));
          } else if (
            conCurrentActivity === 2 &&
            conCurrentPage === conTotalPage
          ) {
            conceptFinished();
          } else {
            nextBtnHandler();
          }
        }
      });
    });
}

/**
 * keypad 이벤트
 * @param answerBox 정답 박스
 */
function keypadEvent(answerBox) {
  const conceptContentEl = document.querySelector(".content");
  const contImgEl = document.querySelector(".cont-left img");
  const tableImgEl = document.querySelectorAll(".th img");
  //키패드 데이터
  const keyData = [
    { id: 0, val: 1 },
    { id: 1, val: 2 },
    { id: 2, val: 3 },
    { id: 3, val: 4 },
    { id: 4, val: 5 },
    { id: 5, val: 6 },
    { id: 6, val: 7 },
    { id: 7, val: 8 },
    { id: 8, val: 9 },
    { id: 9, val: 0 },
  ];

  const keypadEl = document.createElement("div");
  keypadEl.classList.add("keypad");

  keypadEl.innerHTML = `
    <div class="keypad-inner">
        <ul class="keypad-left">
            ${keyData
              .map(
                (item) =>
                  `<li key=${item.id} data-value=${item.val}>${item.val}</li>`
              )
              .join("")}
        </ul>

        <ul class="keypad-right">
            <li data-value="delete"><img src="../../../COMM/IMG/KEYPAD_DEL.PNG" alt="키패드 지우기"/></li>
            <li data-value="confirm"><img src="../../../COMM/IMG/KEYPAD_CON.PNG" alt="키패드 확인"/></li>
        </ul>

        <ul class="keypad-close-wrap">
            <li class="keypad-close" data-value="close"></li>
        </ul>
    </div>
  `;
  conceptContentEl.appendChild(keypadEl);

  const tableRow = document.querySelectorAll(".t-row");
  if (conceptContData.type === "1_2_4_2") {
    audioPlay(conceptContData.loadAudioList[0]);
    clickTouchGuide();
    tableRow[0].classList.add("on");
    tableImgEl[0].src = conceptContData.topAniList[0];
    answerBox[0].classList.remove("disabled");

    audioObj.addEventListener("ended", function () {
      tableImgEl[0].src = conceptContData.answerList[0].img;
    });
  }

  answerBox.forEach((el, idx) => {
    el.setAttribute("data-index", idx + 1);
    el.addEventListener("click", function () {
      touchAudio.play();
      keypadEl.classList.add("active");

      answerBox.forEach((el) => {
        el.classList.remove("on");
      });
      el.classList.add("on");

      const keyBtnEl = document.querySelectorAll(".keypad li");
      // 키패드 버튼 클릭 이벤트
      keyBtnEl.forEach((keyBtn) => {
        keyBtn.addEventListener("click", function () {
          touchAudio.play();
          let keyVal = keyBtn.getAttribute("data-value");
          let selectedAnswerBox = document.querySelector(".q-box.on");

          if (keyVal === "delete") {
            selectedAnswerBox.innerText = "?";
          } else if (keyVal === "confirm") {
            checkKeypadAnswer(selectedAnswerBox);
          } else if (keyVal === "close") {
            // 키패드 닫기 기능 추가 (0605)
            el.classList.remove("on");
            keypadEl.classList.remove("active");

            keyBtn.removeEventListener("click");
          } else {
            selectedAnswerBox.innerText = keyVal;
          }
        });
      });

      document.addEventListener("click", function (e) {
        let keypad = document.querySelector(".keypad");
        let selectedAnswerBox = document.querySelector(".q-box.on");

        // 클릭된 요소가 키패드 자신이거나 키패드 내부 요소인 경우 무시
        if (
          e.target.closest(".keypad") === keypad ||
          keypad.contains(e.target) ||
          e.target === selectedAnswerBox
        ) {
          return;
        }

        console.log("키패드 외부 영역 클릭");
        checkKeypadAnswer(selectedAnswerBox);
      });

      /**
       * 키패드 정답체크
       *  @param selectedAnswerBox 체크된 정답 박스
       * */
      function checkKeypadAnswer(selectedAnswerBox) {
        // conceptContentEl.removeChild(keypadEl);
        keypadEl.classList.remove("active");

        if (selectedAnswerBox) {
          selectedAnswerBox.classList.remove("on");

          let userAnswer = selectedAnswerBox.innerText.trim();
          let index =
            parseInt(selectedAnswerBox.getAttribute("data-index")) - 1;
          console.log(index);
          let correctAnswer = conceptContData.answerList[index].val;
          console.log(correctAnswer);

          if (userAnswer === correctAnswer) {
            console.log("정답입니다.");
            audioPlay(answerAudio);
            selectedAnswerBox.classList.add("disabled");

            if (conceptContData.type === "1_2_4_2") {
              tableImgEl[index].src = conceptContData.answerList[index].img;
              tableRow.forEach((el) => {
                el.classList.remove("on");
              });

              if (index < 2) {
                console.log(index + 1, "번째");
                audioObj.addEventListener("ended", function () {
                  tableRow[index + 1].classList.add("on");
                  tableImgEl[index + 1].src =
                    conceptContData.topAniList[index + 1];
                  answerBox[index + 1].classList.remove("disabled");
                  audioPlay(conceptContData.loadAudioList[index + 1]);
                  audioObj.addEventListener("ended", function () {
                    tableImgEl[index + 1].src =
                      conceptContData.answerList[index + 1].img;
                  });
                });
              } else {
                console.log("마지막!!!!!!!!!");
                audioObj.addEventListener("ended", function () {
                  audioPlay(conceptContData.answerAudio);

                  conceptContData.lastAniList.forEach((el, idx) => {
                    setTimeout(() => {
                      contImgEl.src = el;
                    }, 3500 * idx);
                  });

                  audioObj.addEventListener("ended", function () {
                    if (isStopElement) {
                      stopTopContEl.innerHTML = `
                        <div class="top_img">
                          <img src="${
                            conData.stop.topImg
                          }" alt="개념 상단 이미지"/>
                  
                          <div class="top-aniBox top-aniBox01">
                            <img src="${
                              conData.stop.topAniImgList[0]
                            }" alt="네모 강조" class="aniBox1"/>
                            <img src="${
                              conData.stop.topAniImgList[0]
                            }" alt="네모 강조" class="aniBox2"/>
                          </div>
                          <div class="top-aniBox top-aniBox02">
                            <img src="${
                              conData.stop.topAniImgList[1]
                            }" alt="세모 강조" class="aniBox3"/>
                            <img src="${
                              conData.stop.topAniImgList[1]
                            }" alt="세모 강조" class="aniBox4"/>
                            <img src="${
                              conData.stop.topAniImgList[1]
                            }" alt="세모 강조" class="aniBox5"/>
                          </div>
                          <div class="top-aniBox top-aniBox03">
                            <img src="${
                              conData.stop.topAniImgList[2]
                            }" alt="동그라미 강조" class="aniBox6"/>
                            <img src="${
                              conData.stop.topAniImgList[2]
                            }" alt="동그라미 강조" class="aniBox7"/>
                            <img src="${
                              conData.stop.topAniImgList[2]
                            }" alt="동그라미 강조" class="aniBox8"/>
                          </div>
                        </div>
                  
                        <div class="figure-table">
                  
                          ${conData.stop.answerList
                            .map(
                              (item) =>
                                `
                              <div class="t-row">
                                <div class="th"><img src="${item.img}" class="aniImg"/></div>
                                <div class="td">
                                  <span class="q-box q-box-s2 q-box-ani" value=${item.val}>?</span>개
                                </div>
                              </div>
                            `
                            )
                            .join("")}
                        </div>
                      `;
                      showConceptPage(stopTopContEl);
                    }
                  });
                });
              }
            }
          } else {
            console.log("오답입니다.");
            audioPlay(wrongAudio);
            selectedAnswerBox.innerText = "?";

            if (conceptContData.type === "1_2_4_2") {
              audioObj.addEventListener("ended", function () {
                audioPlay(conceptContData.wrongAudioList[index]);
                // contImgEl.src = conceptContData.topAniList[index];
                if (index < 2) {
                  tableImgEl[index].src = conceptContData.topAniList[index];
                  audioObj.addEventListener("ended", function () {
                    tableImgEl[index].src =
                      conceptContData.answerList[index].img;
                  });
                } else {
                  contImgEl.src = conceptContData.lastAniList[index];
                }
              });
            }
          }
        }
      }
    });
  });
}

function selectIntro() {
  audioPlay(conceptContData.loadAudio);

  audioObj.addEventListener("ended", function () {
    audioPlay(conceptContData.numberAudio);
    aniNumberFn($(".number__anibox__top > .anibox__top__one"));
    setTimeout(() => {
      $(".answer__text__wrap").eq(0).addClass("animated");
      $(".number__anibox__top > .anibox__top__one").removeClass("animated");
    }, 3000);

    setTimeout(() => {
      aniNumberFn($(".number__anibox__bottom > .anibox__top__one"));

      setTimeout(() => {
        $(".answer__text__wrap").eq(1).addClass("animated");
        $(".number__anibox__bottom > .anibox__top__one").removeClass(
          "animated"
        );

        if (!conData.stop) {
          nextBtnHandler();
        } else {
          showConceptPage();
        }
      }, 3000);
    }, 3000);
  });
}

// 1학년 4차시 4,5p box애니메이션
function aniNumberFn(val) {
  for (let k = 0; k < val.length; k++) {
    setTimeout(() => {
      val[k].classList.add("animated");
    }, 500 * k);
  }
}
