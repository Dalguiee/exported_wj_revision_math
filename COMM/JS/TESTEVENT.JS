//현재 문제 번호
let currentQuestion = 1;
let completeQuestion = 0;
let completeQuestionState = false;
// 정답 맞출 기회 = 2회
let isCorrectChance = 2;

// test 컨텐츠
let testContentEl;
//정답 상태 배열
let answerStatusArr;

// 이전 , 다음 버튼
let prevBtnEl, nextBtnEl;

//힌트 캐릭터 제공
const wrongHintCont = document.createElement('div');
wrongHintCont.classList.add('hint-desc');

//공통 효과음
//정답 효과음
const commonCorrect = '../../../COMM/SOUND/CORRECT.MP3';
//오답 효과음
// const commonWrong = '../../../COMM/SOUND/WRONG.MP3';
const commonWrong = new Audio('../../../COMM/SOUND/WRONG.MP3');

const testEvent = {
    /**
     * @param testData 확인 문제 데이터
     * @param startBtn 시작하기 버튼
     */
    createTestPage: (testData, startBtn) => {
        startBtn.addEventListener('click', function () {
            console.log('확인 문제 시작');

            // 확인문제 재시작 시 examScore 삭제 (0426)
            RemoveLocalStorage("examScore");

            playAudio(startAudio)
            initTestPage();
        });

        // 문제 데이터
        const questionData = testData?.testData;

        /**
         * 테스트 데이터 랜덤 추출
         * @param {array} array 랜덤으로 추출 될 테스트 리스트
         * @param {string} count 리스트에서 추출 될 갯수
         */
        function getRandomElements(array, count) {
            const shuffledArr = array.sort(() => 0.5 - Math.random());
            return shuffledArr.slice(0, count);
        }

        // 랜덤 추출 후 문제리스트 재배열
        const randomArray = [];
        questionData.forEach((data) => {
            const { randomCount, randomTestList } = data;
            const selectedTestList = getRandomElements(randomTestList, randomCount);
            randomArray.push(...selectedTestList);
        });

        console.log('랜덤문제 리스트 :: ', randomArray);

        //총 문제 갯수
        const totalQuestion = randomArray.length;

        //정답 상태 체크 배열
        answerStatusArr = new Array(totalQuestion).fill(null);

        // 최종 발문 결과 및 가이드 재배열
        const resultCommArray = [];

        questionData.forEach((data) => {
            const { randomCount, title, guide, correct, wrong } = data;
            for (let i = 0; i < randomCount; i++) {
                const titleData = {
                    title: { ...title },
                    guide: i === 0 && guide ? { ...guide } : null,
                    correct: correct ? { ...correct } : null,
                    wrong: wrong ? { ...wrong } : null,
                };
                resultCommArray.push(titleData);
            }
        });

        console.log('공통 데이터 추출::: ', resultCommArray);

        function initTestPage() {
            //현재 문제 데이터
            let resultData = randomArray[currentQuestion - 1];
            console.log('현재 문제 ::::: ', resultData);

            console.log('answerStatusArr ====> ', answerStatusArr);

            ContentsWrap.innerHTML = `
                <div class="content-wrap content-intro">
                <div class="content-inner">
                    <div class="header">
                        <div class="h-left">
                            <button class="playBtn"><img src="../../../COMM/IMG/PLAYBTN.PNG" alt="스피커 버튼"/></button>
                            <h1 class="content-tit">${resultCommArray[currentQuestion - 1].title.txt}</h1>

                        </div>
                        <div class="h-right">
                            <ul class="pagination">
                                ${randomArray.map((item, idx) => `<li key=${idx}>${idx + 1}</li>`).join('')}
                            </ul>  
                        </div>
                    </div>

                    <button class="arrowBtn prevBtn ${currentQuestion - 1 === 0 ? 'd-none' : 'on'}"></button>
                    <button class="arrowBtn nextBtn ${currentQuestion - 1 === 4 ? 'd-none' : ''}"></button> 
                    
                    <div class="content"></div>
                </div>
            </div>
            `;

            // 효과음 후 발문 재생
            console.log('*******************공통 타이틀 ')
            // playAudio(resultCommArray[currentQuestion - 1].title.audio);
            playEffectAudioHandler(resultCommArray[currentQuestion - 1].title.audio)

            const contentWrapEl = document.querySelector('.content-wrap');
            testContentEl = document.querySelector('.content');
            const playBtnEl = document.querySelector('.playBtn');
            nextBtnEl = document.querySelector('.nextBtn');
            prevBtnEl = document.querySelector('.prevBtn');

            const guideData = resultCommArray[currentQuestion - 1].guide;

            const reactionData = {
                correct: resultCommArray[currentQuestion - 1].correct,
                wrong: resultCommArray[currentQuestion - 1].wrong,
            };

            //오답힌트
            wrongHintCont.innerHTML = `
                <div class="hintBox">
                    <div class="characterWrap">
                        <div class="hint-character"></div>
                    </div>
                    <div class="hint-txtWrap">
                        ${resultData.hintBoxImg ? `<img src="${resultData.hintBoxImg}" alt="힌트 이미지"/>` : ``}
                       <h3>${reactionData.wrong ? reactionData.wrong.txt : resultData.wrong ? resultData.wrong.txt : ""}</h3> 
                    </div>
                </div>
            `
            contentWrapEl.appendChild(wrongHintCont)

            // 정답 리액션
            const reactionCont = document.createElement('div');
            reactionCont.classList.add('reaction');
            reactionCont.innerHTML = `
                <div class="re-body"></div>
            `
            contentWrapEl.appendChild(reactionCont);

            //문제 유형
            let testType = resultData.type;
            testContentEl.classList.add(testType);

            // 1단원 제외 공통 스타일 지정을 위해 클래스 추가
            if (unit !== 'unit1') {
                testContentEl.classList.add('noUnit1');
            }

            //보기 리스트
            let answerList = resultData.answerList && !testType.includes('dottodot') ? shuffle(resultData.answerList) : null;
            // 정답체크 한 적이 있는지
            const isAnswered = answerStatusArr[currentQuestion - 1] !== null;

            if (testType.includes('click')) {
                // 선택형 기본 선택형 레이아웃
                testContentEl.innerHTML = `
                ${resultData.question
                        ? ` <div class="question-wrap ${resultData.question.txt || resultData.question.txtList ? 'txt-ver' : resultData.question.img ? 'img-ver' : 'b-none'
                        }">
                        ${resultData.question.img
                            ? `
                                <div class="question-img">
                                    <img src="${resultData.question.img}" alt="문제"/>
                                </div>
                            `
                            : resultData.question.txt
                                ? `
                            <h2>${resultData.question.txt}</h2>
                            `
                                : resultData.question.txtList
                                    ? `
                                    <div class="txt-wrap">
                                        ${resultData.question.txtList.map((item) => (
                                        `<h2 key=${item.id}>${item.txt}</h2>`
                                    )).join('')}
                                    </div>
                                `
                                    : resultData.question.questionArea
                                        ? `
                                <ul class="q-container">
                                    ${resultData.question.questionArea.map((item) => `<li key=${item.id}>${item.content}</li>`).join('')}
                                </ul>
                            `
                                        : ``
                        }

                        ${resultData.question.aniList
                            ? `
                            <div class="q-ani">
                                ${resultData.question.aniList.map((item) => `<span key=${item.id}>${item.txt}</span>`).join('')}
                            </div>
                            `
                            : ``
                        }
                    </div>`
                        : ``
                    }

                ${testType !== 'click_compare' && resultData.question.subTxt
                        ? `
                        <h2 class="question-subTxt">${resultData.question.subTxt}</h2>
                    `
                        : ``
                    }

                ${testType === 'click_qani2' ? `
                    <h2 class='question-subWrap'>
                        <span class='q-box q-box-s'></span>원
                    </h2>
                ` : ``}

                <div class="hint-wrap"></div>

                <ul class="answer-wrap">
                    ${answerList &&
                    answerList
                        .map(
                            (item) =>
                                `<li class="answerBtn" key=${item.id}>
                                <p data-index=${item.id}>
                                ${item.txt ? item.txt : `<img src="${item.img}" alt="보기"/>`}</p>
                            </li>`
                        )
                        .join('')
                    }
                </ul>
            `;


            } else if (testType.includes('dnd')) {
                // 드래그앤드랍 레이아웃

                testContentEl.innerHTML = `
                    <div class="question-wrap ${resultData.question.txt || resultData.question.txtList ? 'txt-ver' : resultData.question.img ? 'img-ver' : 'b-none'
                    } ${resultData.question.qClass ? resultData.question.qClass : ''}">
                        ${resultData.question.img
                        ? `
                                <div class="question-img">
                                    <img src="${resultData.question.img}" alt="문제"/>
                                </div>
                            `
                        : resultData.question.txtList
                            ? `<ul class="question">
                                ${resultData.question.txtList
                                .map(
                                    (item) =>
                                        `
                                        <li key=${item.id}>${item.content}</li>
                                    `
                                )
                                .join('')}
                            </ul>`

                            : resultData.question.txt
                                ? `<h2>${resultData.question.txt}</h2>`
                                : ``
                    }

                        ${resultData.question.dropArea
                        ?
                        `
                                <div class="dropArea">
                                    <ul> 
                                        ${resultData.question.dropArea
                            .map(
                                (item) =>
                                    `<li key=${item.id} droppable=${item.droppable} class=${item.droppable ? 'q-box' : ''}>
                                                ${item.content ? item.content : '?'}
                                            </li>`
                            )
                            .join('')
                        }
                                    </ul>
                                </div>
                            ` : ``
                    }
                
                    </div>

                    ${resultData.question.subTxt
                        ? `
                            <h2 class="question-subTxt">${resultData.question.subTxt}</h2>
                        `
                        : ``
                    }

                    ${testType === 'dnd_sentence_img' ? `
                        <h2 class="question-subTxt">${resultData.question.txt}은 100이 <span class='q-box q-box-s2' key='1' droppable='true'></span>개, 10이 <span class='q-box q-box-s2' key='2' droppable='true'></span>개, 1이 <span class='q-box q-box-s2' key='3' droppable='true'></span>개입니다.</h2>
                    ` : testType === 'dnd_sentence_img2' ? `
                        ${resultData.question.txtList.map((item) => (
                        `
                                <h2 class="question-subTxt">${item.txt}</h2>
                            `
                    )).join('')}

                    ` : ``
                    }

                    ${resultData.question.subTxtList
                        ? `
                            <div class="sub-txtWrap">
                                ${resultData.question.subTxtList.map((item) => (
                            `<h2 key=${item.id} class="subTxt">${item.txt}</h2>`
                        )).join('')}
                            </div>
                            `

                        : ``
                    }

                    <div class="hint-wrap"></div>

                    <ul class="answer-wrap dragArea">
                        ${resultData.answerList
                        .map(
                            (item) =>
                                `<li class="answerBtn" data-key=${item.id} draggable="true"data-value=${item.txt}>
                                <p data-index=${item.id}>${item.txt}</p>
                            </li>`
                        )
                        .join('')}
                    </ul>
                `;
            } else if (testType.includes('dottodot')) {
                //선긋기 레이아웃
                testContentEl.innerHTML = `
                    <div class="dot-q-wrap">
                        <ul class="dot-question"> </ul>
                        <canvas id="dotCanvas" width="1920" height="1200"></canvas>
                        <ul class="dot-answer"></ul>
                    </div>
                `;
            }

            // 보기 컨텐츠 container
            const answerContainer = document.querySelector('.answer-wrap');

            // 선긋기 dot 영역
            const questionDotWrap = document.querySelector('.dot-question');
            const answerDotWrap = document.querySelector('.dot-answer');

            // 문제 유형별로 내부 컨텐츠 다르게
            switch (testType) {
                // 기본 보기 선택형 옆 스피커
                case 'click_speaker':
                    answerContainer.innerHTML = `
                    ${answerList
                            .map(
                                (item) =>
                                    `<li class="answerBtn" key=${item.id}>
                            <button class="an-speaker" data-audio=${item.audio}><img src="../../../COMM/IMG/PLAYBTN.PNG" alt="스피커 버튼"/></button>
                            <p data-index=${item.id}>${item.txt}</p>
                        </li>`
                            )
                            .join('')}
                `;
                    const anSpeakerBtn = document.querySelectorAll('.an-speaker');

                    anSpeakerBtn.forEach((el) => {
                        el.addEventListener('click', function () {
                            const audioRes = el.getAttribute('data-audio');
                            playAudio(audioRes);
                        });
                    });

                    break;

                // 보기 선택시 동그라미
                case 'click_circle':
                    answerContainer.innerHTML = `
                    <li><p>(</p></li>
                    ${answerList
                            .map(
                                (item) =>
                                    `<li class="answerBtn" key=${item.id}>
                            <p data-index=${item.id}>${item.txt}</p><span class="last_none">,</span>
                        </li>`
                            )
                            .join('')}
                    <li><p>)</p></li>
                `;
                    break;

                // 보기 선택 문제 이미지 + 텍스트
                case 'click_multi':
                    testContentEl.innerHTML = `
                    <div class="question-wrap">
                        <div class="q-img">
                            <img src=" ${resultData.question.img}" alt="문제"/>
                        </div>
                        <h2>${resultData.question.txt}</h2>
                    </div>

                    <div class="hint-wrap"></div>

                    <ul class="answer-wrap">
                        ${answerList
                            .map(
                                (item) =>
                                    `<li class="answerBtn" key=${item.id}>
                                    <p data-index=${item.id}>${item.txt}</p>
                                </li>`
                            )
                            .join('')}
                    </ul>
                `;
                    break;

                // 보기 선택 문제 이미지 + 텍스트 뛰어 세기
                case 'click_multi3':
                    testContentEl.innerHTML = `
                        <div class="question-wrap">
                            <div class="q-img">
                                <img src=" ${resultData.question.img}" alt="문제"/>
                                <ul class="q-txt-wrap">
                                    ${resultData.question.txtList.map((item) => (
                        `<li key=${item.id}>${item.txt}</li>`
                    )).join('')}
                                </ul>
                            </div>
                        
                            ${resultData.question.subTxtState !== 'none' ?
                            `    
                                <h2>
                                    <span class="arrow-s"><img src="../../../COMM/IMG/TEST/ARROW.PNG" alt="화살표"/></span><span class="q-box"></span> 씩 뛰어 세었습니다.
                                </h2>
                                    `
                            : ``}
                        </div>

                        <div class="hint-wrap"></div>

                        <ul class="answer-wrap">
                            ${answerList
                            .map(
                                (item) =>
                                    `<li class="answerBtn" key=${item.id}>
                                        <p data-index=${item.id}>${item.txt}</p>
                                    </li>`
                            )
                            .join('')}
                        </ul>
                    `;
                    break;

                // 보기 선택시 동그라미 문제 영역 여러개
                case 'click_circle2':
                    testContentEl.innerHTML = `
                        <div class="q-container q-top">
                            ${resultData.question.topList
                            .map(
                                (item) =>
                                    `
                                <div class="q-cont q-cont${item.id}" key=${item.id}>
                                        <div class="textArea">${item.txt}</div>
                                        <div class="question-wrap">
                                            <img src="${item.img}" alt="문제"/>
                                        </div>
                                </div> 
                                `
                            )
                            .join('')}
                        </div>
                        <div class="q-container q-bottom">
                            ${resultData.question.bottomList
                            .map(
                                (item, idx) =>
                                    `<div class="q-bottom-col" key=${idx + 1}>
                                    <p class="q-bottom-txt">
                                        ${item.txt}
                                        <ul class="answer-wrap">
                                            ${idx === 0
                                        ? `
                                                <li><p>(</p></li>
                                                <li class="answerBtn" key="1">
                                                    <input type="radio" id="1-1" name="1" value="1-1"/>
                                                    <label for="1-1"><span>많습니다</span></label>
                                                    <span class="last_none">,</span>
                                                </li>

                                                <li class="answerBtn" key="1">
                                                    <input type="radio" id="1-2" name="1" value="1-2"/>
                                                    <label for="1-2"><span>적습니다</span></label>
                                                </li>
                                                <li><p>).</p></li>
                                            `
                                        : `
                                                <li><p>(</p></li>
                                                <li class="answerBtn" key="2">
                                                    <input type="radio" id="2-1" name="2" value="2-1"/>
                                                    <label for="2-1"><span>큽니다</span></label>
                                                    <span class="last_none">,</span>
                                                </li>
                                                <li class="answerBtn" key="2">
                                                    <input type="radio" id="2-2" name="2" value="2-2"/>
                                                    <label for="2-2"><span>작습니다</span></label>
                                                </li>
                                                <li><p>).</p></li>
                                            `
                                    }
                                        </ul>
                                    </p>
                                </div>`
                            )
                            .join('')}
                        </div>
                    `;
                    const answerBtnEl = document.querySelectorAll('input');

                    let correctArr = new Array(resultData.answer.length).fill({
                        state: null,
                        // chance: isCorrectChance,
                    });

                    if (isAnswered) {

                        document.querySelectorAll('.answerBtn').forEach((el) => { el.classList.add('disabled') })

                        updateCheckbox("1", resultData.answer[0]);
                        updateCheckbox("2", resultData.answer[1]);
                    }

                    clickMultipleEvent(answerBtnEl, resultData, correctArr, reactionData);

                    break;

                // click_compare2 수비교 클릭
                case 'click_compare2':
                    testContentEl.innerHTML = `
                        <ul class="answer-wrap">
                            ${answerList &&
                        answerList
                            .map(
                                (item) =>
                                    `<li class="answerBtn" key=${item.id}>
                                        <p data-index=${item.id}>
                                        ${item.txt ? item.txt : `<img src="${item.img}" alt="보기"/>`}</p>
                                    </li>`
                            )
                            .join('')
                        }
                        </ul>
                    `
                    break;

                // click_group 도형 물건 그룹 클릭
                case 'click_group':
                    answerContainer.innerHTML = `
                        ${answerList
                            .map(
                                (item) =>
                                    `<li class="answerBtn" key=${item.id}>
                                    <p data-index=${item.id}>
                                        ${item.imgList.map((el) => (`
                                            <img src='${el}' alt="모양 이미지"/>
                                        `)).join('')}
                                    </p>
                                </li>`
                            )
                            .join('')}
                    `;
                    break;

                // click_box 박스 안 물건
                case 'click_box':
                    testContentEl.innerHTML = `
                        <div class="q-left">
                            <img src="${resultData.question.img}" alt="박스 찾기 이미지"/>
                            <div class="q-txt-bubble">
                                ${resultData.question.txt}
                            </div>
                        </div>
                        <div class="answer-wrap">
                            ${answerList.map((item) => `
                                    <li class="answerBtn" key=${item.id}>
                                        <p data-index=${item.id}><img src="${item.img}" alt="보기"/></p>
                                    </li>`
                    ).join('')
                        }
                        </div>
                    `
                    break

                // click_circle_figure 발문 내 도형 동그라미
                case 'click_circle_figure':
                    testContentEl.innerHTML = `
                        <div class="question-wrap txt-ver">
                            <h2>
                                ${resultData.question.txt} (

                                    <ul class="answer-wrap">
                                        ${answerList
                            .map(
                                (item) =>
                                    `<li class="answerBtn" key=${item.id}>
                                            <p data-index=${item.id}><img src="${item.img}"/></p><span class="last_none">,</span>
                                        </li>`
                            )
                            .join('')}
                                    </ul>
                                   
                                ) 모양입니다.
                            </h2>
                        </div>
                     
                    `;

                    break;

                // click_circle_figure2 발문 내 도형 동그라미
                case 'click_circle_figure2':
                    testContentEl.innerHTML = `
                        <div class="question-wrap">
                            <ul class="answer-wrap">
                                ${answerList
                            .map(
                                (item) =>
                                    `<li class="answerBtn" key=${item.id}>
                                        <p data-index=${item.id}><img src="${item.img}"/></p>
                                    </li>`
                            )
                            .join('')}
                            </ul>
                        </div>
                        
                    `;

                    break;

                // click_figure_multi 발문 내 이미지 텍스트 같이
                case 'click_box_multi':
                    testContentEl.innerHTML = `
                        <div class="question-wrap">
                            <p class="q-txt-wrap">
                                ${resultData.question.txt}  
                            </p>
                            <div class="question-img">
                                <img src=" ${resultData.question.img}" alt="문제"/>
                            </div>
                        </div>

                        <ul class="answer-wrap">
                            ${answerList
                            .map(
                                (item) =>
                                    `<li class="answerBtn" key=${item.id}>
                                        <p data-index=${item.id}>${item.txt}</p>
                                    </li>`
                            )
                            .join('')}
                        </ul>
                    `;
                    break;

                // 키패드 비교하기 유형
                case 'keypad_compare':
                    testContentEl.innerHTML = `
                    <div class="question-wrap">
                        <div class="answerArea small-wrap">
                            <h5>1만큼 더<br/>작은 수</h5>
                            <span class="q-box" value=${resultData.answer[0].val}></span> 
                            <span class="hint-txt">${resultData.question.txt} 바로 앞의 수</span>
                        </div>
                        <div class="question">${resultData.question.txt}</div>
                        <div class="answerArea big-wrap">
                            <h5>1만큼 더<br/>큰 수</h5>
                            <span class="q-box" value=${resultData.answer[1].val}></span>
                            <span class="hint-txt">${resultData.question.txt} 바로 뒤의 수</span>
                        </div>
                    </div>

                `;
                    break;

                // 키패드 도형 갯수 유형
                case 'keypad_figure':
                    testContentEl.innerHTML =
                        `
                        <div class="question-wrap">
                            <div class="question-img">

                                <img src="${resultData.question.img}" alt="문제"/>
                                <img src="${resultData.wrongAni}" class="activeHint"/>
                            </div>
                        </div>    
                        
                        <div class="answerArea">
                            <p>
                                <img src="${resultData.question.bottomBox}" alt="하단 문제 이미지"/>
                                모양 :  <span class="q-box q-box-s" value=${resultData.answer[0].val}></span>개
                            </p>
                        </div>
                    `

                    break;

                // 키패드 도형 정답 두개
                case 'keypad_figure2':
                    testContentEl.innerHTML =
                        `
                           <div class="question-wrap">
                               <div class="question-img">
   
                                   <img src="${resultData.question.img}" alt="문제"/>
                               </div>
                           </div>    
                           
                           <div class="answerArea">
                              ${resultData.question.txtList.map((item) => (
                            `
                                    <p key=${item.id}>${item.txt}</p>
                                `
                        )).join('')}
                           </div>
                       `

                    break;

                // dnd 숫자 맞추기 유형
                case 'dnd_num':
                    const dropArea = document.querySelector('.dropArea');
                    dropArea.innerHTML = `
                        <div class="drop-table">
                            <div class="t-row">
                                <div class="td">백 모형</div>
                                <div class="td">십 모형</div>
                                <div class="td">일 모형</div>
                            </div>
                            <div class="t-row">
                                ${resultData.question.dropArea
                            .map(
                                (item) =>
                                    `<div class='td ${item.droppable ? 'q-box' : ''}' value=${resultData.answer[item.id - 1]} key=${item.id
                                    } droppable=${item.droppable}>${item.content}</div>`
                            )
                            .join('')}
                            </div>
                        </div>
                        
                        <div class="drop-num">
                            <img src="../../../COMM/IMG/TEST/ARROW.PNG" alt="화살표"/>
                            <p>100</p>
                        </div>

                    `;

                    break;

                // 뛰어세보기 dnd
                case 'dnd_multi':
                    testContentEl.innerHTML = `
                        <div class="question-wrap">
                            <div class="q-img">
                                <img src=" ${resultData.question.img}" alt="문제"/>
                                <ul class="q-txt-wrap">
                                    ${resultData.question.dropArea.map((item) => (
                        `<li key=${item.id} droppable=${item.droppable} class='${item.droppable ? 'q-box' : ''} q-box-s'>
                                            ${item.content ? item.content : '?'}
                                        </li>`
                    )).join('')}
                                </ul>
                            </div>
                        </div>

                        <div class="hint-wrap"></div>

                        <ul class="answer-wrap dragArea">
                            ${resultData.answerList
                            .map(
                                (item) =>
                                    `<li class="answerBtn" data-key=${item.id} draggable="true"data-value=${item.txt}>
                                    <p data-index=${item.id}>${item.txt}</p>
                                </li>`
                            )
                            .join('')}
                        </ul>
                    `;
                    break;

                // dnd 비교하기
                case 'dnd_compare':

                    testContentEl.innerHTML = `
                        <div class="q-wrap">
                            <div class="question-wrap txt-ver">
                                <h2>${resultData.question.txtList[0].txt}</h2>
                            </div>
                            <span class="q-box q-box-o" key="1" droppable="true"></span>
                            <div class="question-wrap">
                                <h2>${resultData.question.txtList[1].txt}</h2>
                            </div>
                        </div>

                        <div class="hint-wrap"></div>

                        <ul class="answer-wrap dragArea">
                            ${resultData.answerList
                            .map(
                                (item) =>
                                    `<li class="answerBtn" data-key=${item.id} draggable="true" data-value=${item.txt}>
                                            <p data-index=${item.id}> ${item.txt === '크다' ? '<' : '>'} </p>
                                        </li>`
                            )
                            .join('')}
                        </ul>
                    `
                    break;

                // dnd_tangram 칠교판
                case 'dnd_tangram':
                    const tangramDropArea = document.querySelector('.dropArea');
                    tangramDropArea.innerHTML = `
                        <div class="drop-table">
                            <div class="t-row thead">
                                <div class="td">삼각형</div>
                                <div class="td">사각형</div>
                            </div>
                            <div class="t-row">
                                ${resultData.question.dropArea
                            .map(
                                (item) =>
                                    `
                                            <div key=${item.id} class="td">
                                                ${item.dropCont.map((el) => {
                                        let dropVal = null;

                                        if (resultData.id !== 4) {
                                            dropVal = (el.id < 3) ? `${resultData.answer[0]},${resultData.answer[1]}` : resultData.answer[el.id - 1];
                                        } else {
                                            dropVal = (el.id > 1) ? `${resultData.answer[1]},${resultData.answer[2]}` : resultData.answer[el.id - 1];
                                        }

                                        return `
                                                    <div 
                                                        class='td-cont ${el.droppable ? 'q-box q-box-s2' : ''}' 
                                                        value=${el.droppable ? dropVal
                                                : 'no-val'
                                            } 
                                                        key=${el.id} droppable=${el.droppable}
                                                    >
                                                        ${el.content} 
                                                    </div>
                                                    <span class="last_none">,</span>
                                                    
                                                    `
                                    }).join('')}
                                            </div>
                                            `
                            )
                            .join('')}
                            </div>
                        </div>

                        `
                    break;

                // 선긋기 기본형
                case 'dottodot':
                    questionDotWrap.innerHTML = `
                        ${resultData.question.dotList.map((item) => (
                        `<li key=${item.id} value=${item.value}>
                                ${item.answerTxt ? `<span class="answerTxt">${item.answerTxt}</span>` : ``}
                                <p>${item.content}</p>
                                <button data-key=${item.id} class="dot startDot" name="question" locked="false" value=${item.value}></button>
                            </li>`
                    )).join('')}       
                    `;

                    answerDotWrap.innerHTML = `
                        ${resultData.answerList.map((item) => (
                        `<li key=${item.id} value=${item.id}>
                                <button data-key=${item.id} class="dot endDot" name="answer" locked="false" value=${item.id}></button>
                                <p>${item.txt}</p>
                                ${item.qaniTxt ? `<p class="q-ani">${item.qaniTxt}</p>` : ``}
                            </li>`
                    )).join('')}
                    `

                    break;

                // 선긋기 이미지 형
                case 'dottodot_img':
                    questionDotWrap.innerHTML = `
                        ${resultData.question.dotList.map((item) => (
                        `<li key=${item.id} value=${item.value}>
                                <img src="${item.content}"/>
                                <button data-key=${item.id} class="dot startDot" name="question" locked="false" value=${item.value}></button>
                            </li>`
                    )).join('')}       
                    `;

                    answerDotWrap.innerHTML = `
                        ${resultData.answerList.map((item) => (
                        `<li key=${item.id} value=${item.id}>
                                <button data-key=${item.id} class="dot endDot" name="answer" locked="false" value=${item.id}></button>
                                <img src="${item.img}"/>
                            </li>`
                    )).join('')}
                    `
                    break;

                // 도형 그리기 유형
                case 'draw_figure':

                    testContentEl.innerHTML = `
                        <div class="question-wrap">
                            <img src="${resultData.question.img}"/>
                            <canvas id="drawCanvas" width="1280" height="800"></canvas>
                        </div>
                    `

                    break;
            }

            let answeredCont;
            if (isAnswered) {
                answeredCont = answerStatusArr[currentQuestion - 1].checkTarget;
            }

            //보기 버튼
            const answerBtnEl = document.querySelectorAll('.answerBtn p');

            // 문제 내 정답 박스
            const answerBoxEl = document.querySelectorAll('.q-box');

            if (answerBoxEl.length !== 0) {
                answerBoxEl.forEach((el) => {
                    el.innerText = `?`;
                });
            }

            // 문제 유형별 이벤트
            if (testType.includes('click') && testType !== 'click_circle2') {
                // 클릭 유형 보기 선택 이벤트
                console.log(' 보기 선택 유형');

                // 문제 내 애니메이션 영역
                const aniContWrap = document.querySelector('.q-ani');

                if (answerBoxEl.length !== 0) {
                    // 보기 선택 이력 && 정답일 경우 선택한 텍스트 정답박스에 넣기
                    if (isAnswered) {
                        const checkText = document.querySelector(`p[data-index="${resultData.answer}"]`).innerHTML;
                        answerBoxEl.forEach((el) => {
                            el.innerHTML = checkText;
                        });
                    }
                }

                //보기 클릭 이벤트
                answerBtnEl.forEach((el) => {
                    // 정답 체크한 적 있을 때 보기 표시 및 비활성화
                    if (isAnswered) {
                        const isActive = el.getAttribute('data-index') === resultData.answer.toString();

                        isActive ? el.classList.add('active') : el.classList.add('off');
                        el.classList.add('disabled');
                    }

                    el.addEventListener('click', function () {
                        answerBtnEl.forEach((el) => el.classList.remove('active'));
                        el.classList.add('active');
                        touchAudio.play();

                        checkAnswerHandler(el, resultData, reactionData, answerBtnEl, answerBoxEl, aniContWrap);
                    });
                });


            } else if (testType.includes('dnd')) {
                // 유형 드래그앤드랍 이벤트
                console.log(' 드래그앤 드랍 유형');

                // 드래그 아이템
                const dragItemEl = document.querySelectorAll('.dragArea li');
                // 드랍 아이템
                const dropItemEl = document.querySelectorAll('.q-box');
                const dropStatusArr = new Array(dropItemEl.length).fill({
                    state: null,
                    chance: isCorrectChance,
                });

                dropItemEl.forEach((el) => {
                    el.innerText = '?'
                })

                // dnd 도형 텍스트 넣기 타입 일때 (2학년 2단원 2,3,4차시)
                if (resultData.type === 'dnd_figure_txt') {
                    dropItemEl.forEach((el, idx) => {
                        el.classList.add('q-box-s');
                        el.classList.add(resultData.question.dropArea[idx].arrow);
                    })
                }

                // 정답 체크한 적 있을 때 표시 및 비활성화
                if (isAnswered) {
                    document.querySelector('.dragArea').classList.add('disabled');
                    console.log(answerStatusArr);

                    dragItemEl.forEach((el) => {
                        const dataKey = el.getAttribute('data-key');
                        const targetState = answeredCont[dataKey - 1];

                        el.draggable = false;
                        el.classList.add('off');

                        dropItemEl.forEach((el, index) => {
                            if (testType === 'dnd_compare') {
                                el.innerText = resultData.answer[index] === '크다' ? '<' : '>';
                            } else if (testType === 'dnd_figure_txt') {
                                el.innerText = resultData.answerList[index].txt;
                            } else {
                                el.innerText = resultData.answer[index];
                            }
                        });
                    });
                }

                dndEvent(dragItemEl, dropItemEl, dropStatusArr, resultData, reactionData);

            } else if (testType.includes('keypad')) {
                // 유형 키패드 이벤트
                console.log(' 키패드 유형');

                // 정답 체크한 적 있을 때 표시
                if (isAnswered) {
                    answerBoxEl.forEach((el, idx) => {
                        el.classList.add('disabled')
                        el.innerText = resultData.answer[idx].val;
                    });
                }

                const keypadStatusArr = new Array(answerBoxEl.length).fill({
                    state: null,
                    chance: isCorrectChance,
                });
                console.log(keypadStatusArr);

                console.log('resultData:::', resultData);
                keypadEvent(answerBoxEl, resultData, keypadStatusArr, reactionData);
            } else if (testType.includes('dottodot')) {

                let dottodotStatusArr = new Array(resultData.answer.length).fill({
                    state: null,
                    chance: isCorrectChance,
                });

                dottodotEvent(dottodotStatusArr, reactionData, resultData, isAnswered);

            } else if (testType === 'draw_figure') {
                let drawStatusArr = new Array(resultData.answer.length).fill({
                    state: null,
                    chance: isCorrectChance,
                });

                drawFigureEvent(drawStatusArr, reactionData, resultData, isAnswered);
            }

            // 이미 문제 풀었을 경우 활성화
            if (answerStatusArr[currentQuestion - 1] !== null) {
                completeQuestionState = true;
                nextBtnEl.classList.add('on');
            }

            playBtnEl.addEventListener('click', () => {
                touchAudio.play();
                playAudio(resultCommArray[currentQuestion - 1].title.audio)
            });

            // 전체 문제 푼 경우 다음 스텝 가기 버튼 활성화
            if (answerStatusArr.filter(Boolean).length === 5) {
                console.log('=====전체 문제 완료=====');
                createNextStep();
            }

            /**
             * 이전 버튼 클릭 이벤트
             */
            function prevPage() {
                if (currentQuestion > 1) {
                    currentQuestion--;
                    playAudio(commonChangeAudio);
                    initTestPage();
                    // pauseAudio(audio);
                }
            }

            /**
             * 다음 버튼 클릭 이벤트
             */
            function nextPage() {
                if (completeQuestionState && currentQuestion < totalQuestion) {
                    currentQuestion++;
                    completeQuestionState = false;
                    isCorrectChance = 2;
                    playAudio(commonChangeAudio);
                    initTestPage();
                    // pauseAudio(audio);
                }
            }

            /**
             * 클릭 유형 채점 이벤트
             * @param target 유저가 선택한 답안
             * @param {object} data 해당 문제 데이터
             * @param  reactionData 정오답일 때 공통 리액션 데이터
             * @param answerElement 보기 element
             * @param answerBox 정답 박스
             */
            function checkAnswerHandler(target, data, reactionData, answerElement, answerBox, aniCont) {
                console.log('======채점채점채점======');
                // console.log(target)
                // console.log( target,  data, reactionData, answerElement, answerBox )
                // console.log(answerBox)

                // 정답인지 체크
                const isCorrectState = resultData.answer.toString() === target.getAttribute('data-index');
                const targetTxt = target.innerText;
                const targetHtml = target.innerHTML;

                if (isCorrectState) {
                    console.log('정답');
                    if (answerBox.length !== 0) {
                        answerBox.forEach((el) => {
                            el.innerHTML = targetHtml;
                        });
                    }

                    // 공통 정답
                    playAudio(commonCorrect);

                    // 정답 효과음 나올때 리액션
                    correctReaction();

                    //정답 표시
                    answerElement.forEach((el) => {
                        if (target.getAttribute('data-index') !== el.getAttribute('data-index')) {
                            el.classList.add('off')
                        }
                    });
                    if (data.type === 'click_compare2') {
                        document.querySelectorAll('.answerBtn').forEach((el) => {
                            el.classList.remove('animated')
                        })
                    }

                } else {
                    console.log('오답');

                    // 정답 횟수 차감
                    isCorrectChance--;

                    const isWrongData = reactionData.wrong !== null;
                    const isPersonalWrongData = data.wrong !== null;

                    // playAudio(commonWrong);
                    commonWrong.play();

                    setTimeout(function () {
                        answerElement.forEach((el) => el.classList.remove('active'));
                    }, 1000);

                    //최초 오답시 선택 비활성화
                    if (isCorrectChance === 1) {

                        if (isWrongData || isPersonalWrongData) {
                            // 오답 리액션
                            if (data.type === 'click_multi') {
                                //1-1-4차시 3번 문항 click_multi
                                if (data.wrong.idx === target.getAttribute('data-index')) {
                                    // 오답 리액션
                                    console.log('개별 오답');
                                    addAudioEventListener(reactionData, data, false)
                                } else {
                                    wrongHintCont.classList.remove('active');
                                }
                            } else {
                                addAudioEventListener(reactionData, data, isWrongData)
                            }
                        }


                        const hintEl = document.querySelector('.hint-wrap');
                        // 힌트 있을때 힌트 보이기
                        if (data.hintImg) {
                            testContentEl.classList.add('hint');
                            hintEl.innerHTML = `
                            <img src="${data.hintImg}" alt="힌트 이미지"/>
                        `;
                        } else if (data.hintTxt) {
                            testContentEl.classList.add('hint');
                            hintEl.innerHTML = `
                            <span>${data.hintTxt}</span>
                        `;
                        }

                        // 문제 애니메이션 있을 때 보이기
                        if (aniCont) {
                            aniCont.classList.add('active');

                            addAnimationHandler(aniCont.querySelectorAll('span'))
                        }

                        //문제 내 박스 애니메이션 추가
                        if (data.type.includes('click_qani') && document.querySelector('.question-img')) {
                            document.querySelector('.question-img').classList.add('img-q-ani')
                        }

                        // 텍스트에 순서대로 애니메이션 있을 때
                        if (data.question) {

                            if (data.question.txt || data.question.txtList) {
                                const txtAniCont = document.querySelectorAll('h2 span.txt-ani');
                                addAnimationHandler(txtAniCont)
                            }
                        }

                        if (data.type === 'click_multi3') {
                            const txtAniCont = document.querySelectorAll('span.txt-ani');
                            txtAniCont.forEach((el) => {
                                el.classList.add('animated')
                            })
                        } else if (data.type === 'click_compare2') {
                            document.querySelectorAll('.answerBtn').forEach((el) => {
                                console.log(typeof (el.getAttribute('key')))
                                const matchKey = el.getAttribute('key');
                                if (matchKey === '2' || matchKey === '3') {
                                    el.classList.add('animated')
                                }
                            })
                        } else if (data.type === 'click_group') {
                            target.querySelectorAll('img').forEach((el, idx) => {
                                if (data.wrongAni.idx === idx + 1) {
                                    el.src = data.wrongAni.src
                                }
                            })
                        } else if (data.type === 'click_figure' || data.type === 'click_box_multi') {
                            addAnimationHandler(document.querySelectorAll('h2'))

                            if (data.wrongAni) {
                                document.querySelector('.question-img img').src = data.wrongAni;
                            }
                        } else if (data.type === 'click_box') {
                            document.querySelector('.q-left').classList.add('active');
                        } else if (data.type === 'click_figure6') {
                            const hintImg = document.createElement('img');
                            hintImg.classList.add('activeHint');
                            hintImg.src = data.wrongAni
                            document.querySelector('.question-img').appendChild(hintImg)
                        }


                    } else {

                        // 2회 오답시 정답 보여주기
                        setTimeout(() => {
                            answerElement.forEach((el) => {
                                const isActive = el.getAttribute('data-index') === resultData.answer.toString();
                                isActive ? el.classList.add('active') : el.classList.add('off');
                                el.classList.add('disabled');
                            })

                            if (answerBox.length !== 0) {
                                const checkText = document.querySelector(`p[data-index="${resultData.answer}"]`).innerHTML;
                                answerBox.forEach((el) => {
                                    el.innerHTML = checkText;
                                });
                            }

                            if (data.type === 'click_compare2') {
                                document.querySelectorAll('.answerBtn').forEach((el) => {
                                    el.classList.remove('animated')
                                })
                            }

                        }, 1000)

                    }
                }

                // 정답 상태 및 체크한 값 업데이트
                answerStatusArr[currentQuestion - 1] = {
                    isCorrect: isCorrectChance === 2 ? true : false,
                    checkTarget: target.getAttribute('data-index')
                };

                // 정답 & 오답 중 기회 소진 시 보기 버튼 비활성화
                if (isCorrectState || isCorrectChance === 0) {
                    answerElement.forEach((el) => el.classList.add('disabled'));
                    completePageHandler();
                }

                updatePagination();
            }

            nextBtnEl.addEventListener('click', () => nextPage());
            prevBtnEl.addEventListener('click', () => prevPage());
            updatePagination();
        }
        //임시
        // initTestPage();
    },
};

/**
 * 클릭 보기 정답 2개 이상
 * @param {object} answerBtn 보기 박스
 * @param currentData 현재문제 데이터
 * @param clickStatusArr 보기 각 문항 정답 상태 
 * @param reactionData 리액션 데이터
 */

function clickMultipleEvent(answerBtn, currentData, clickStatusArr, reactionData) {
    answerBtn.forEach((el) => {
        el.addEventListener('click', function () {
            console.log('인풋 클릭ㄱ');
            touchAudio.play();

            const matchingIdx = el.getAttribute('name');

            if (currentData.answer[matchingIdx - 1] === el.value) {
                console.log(matchingIdx + '번 정답');
                clickStatusArr[matchingIdx - 1] = {
                    state: true,
                    // chance: clickStatusArr[matchingIdx - 1].chance,
                };
                playAudio(commonCorrect);

                const isAllCorrect = clickStatusArr.every((correct) => correct.state);

                if (isAllCorrect) {
                    setTimeout(() => {
                        updateCheckbox("1", currentData.answer[0]);
                        updateCheckbox("2", currentData.answer[1]);
                    }, 1000)
                }

                document.querySelectorAll(`[name="${matchingIdx}"]`).forEach((el) => {
                    el.parentNode.classList.add('disabled');
                });
            } else {
                console.log(matchingIdx + '번 오답');
                clickStatusArr[matchingIdx - 1] = {
                    state: false,
                    // chance: clickStatusArr[matchingIdx - 1].chance - 1,
                };
                isCorrectChance--;
                console.log(isCorrectChance)
                // 오답 오디오 제생
                // playAudio(commonWrong);
                commonWrong.play();

                setTimeout(function () {
                    el.checked = false;
                }, 1000);

                // if (clickStatusArr[matchingIdx - 1].chance === 1) {
                if (isCorrectChance === 1) {
                    const txtAsNumbers = currentData.question.topList.map((item) => parseInt(item.txt, 10));
                    const minNumber = Math.min(...txtAsNumbers);

                    const aniCont = document.createElement('div');
                    aniCont.classList.add('q-ani2');

                    // 작은 숫자만큼 div 추가
                    for (let i = 0; i < minNumber; i++) {
                        const matchingBar = document.createElement('div');
                        matchingBar.classList.add('matching-bar');
                        aniCont.appendChild(matchingBar);
                    }

                    document.querySelector('.q-top').appendChild(aniCont);

                    // audio.addEventListener('ended', function(){
                    addAnimationHandler(document.querySelectorAll('.matching-bar'));
                    playAudio(reactionData.wrong.audio);
                    // })

                } else {
                    document.querySelectorAll(`[name="${matchingIdx}"]`).forEach((el) => {
                        el.parentNode.classList.add('disabled');
                    });
                    document.querySelectorAll('.answer-wrap').forEach((el) => { el.classList.add('disabled') })

                    // 2회 오답시 정답 보여주기 
                    setTimeout(() => {
                        updateCheckbox("1", currentData.answer[0]);
                        updateCheckbox("2", currentData.answer[1]);
                    }, 1000)

                }
            }

            checkCurrentPageHandler(clickStatusArr, currentData.correctAudio);
        });
    });
}

// click_circle2 유형 정답 D/P
function updateCheckbox(name, answer) {
    document.querySelectorAll(`[name="${name}"]`).forEach((el) => {
        if (el.getAttribute('value') === answer) {
            el.checked = true;
        } else {
            el.classList.add('off');
        }
    });
}

/**
 * 드래그앤드랍
 * @param {object} dragItem  드래그 영역
 * @param {object} dropItem  드랍 영역
 * @param  dropStatusArr  드랍 상태
 * @param  currentData  현재 문제 데이터
 * @param  reactionData  리액션
 *
 */
function dndEvent(dragItem, dropItem, dropStatusArr, currentData, reactionData) {
    let draggedItem = null;
    let x, y;
    let left, right, top, bottom;

    // 드래그 이벤트
    function dragStartEvent(e, item) {
        console.log('드래그 시작');
        const key = item.dataset.key;
        touchAudio.play();

        if (item.draggable) {
            if (e.dataTransfer) {
                e.dataTransfer.setData('key', key);
                draggedItem = item;
            } else {
                // 터치한 아이템의 데이터를 전달
                item.setAttribute('data-touch-key', key);
            }

            // 드래그 중인 아이템의 이미지를 설정
            const dragImage = item.cloneNode(true);
            dragImage.className = 'drag-image';
            dragImage.style.position = 'absolute';
            dragImage.style.top = '-9999px'; // 화면에서 숨김
            testContentEl.appendChild(dragImage);

            // 아이템의 투명도를 설정
            item.style.opacity = '0';
        }
    }

    function dragOverEvent(e, item) {
        const isDroppAble = el.getAttribute('droppable');
        e.preventDefault();
        dropItem.forEach((el) => {
            if (isDroppAble === 'true') {
                el.classList.remove('on')
            }
        });
        item.classList.add('on');
    }

    function touchOverEvent(e, item) {

        if (item.draggable) {
            x = e.clientX;
            y = e.clientY;
            const dragImage = document.querySelector('.drag-image');
            dragImage.style.zIndex = '2';
            dragImage.style.left = x - 100 + 'px';
            dragImage.style.top = y - 200 + 'px';


            dropItem.forEach((el) => {
                const isDroppAble = el.getAttribute('droppable');

                if (isDroppAble === 'true') {
                    el.classList.remove('on');
                    getDropPos(el);

                    if (left < x && x < right && top < y && y < bottom) {
                        el.classList.add('on');
                    }
                }

            });
        }
    }

    function dragEndEvent(e, item) {
        console.log('드래그 끝');
        e.preventDefault();
        // 데이터 인덱스로 매칭 확인
        const matchingData = e.dataTransfer ? item.dataset.key : item.getAttribute('data-touch-key');
        // 데이터 텍스트로 매칭 확인
        const matchingTxtData = item.dataset.value;
        // 드래그 중인 아이템의 이미지 삭제
        const dragImage = document.querySelector('.drag-image');
        if (dragImage) {
            dragImage.parentNode.removeChild(dragImage);
        }
        draggedItem = null;
        item.style.opacity = 1;

        dropItem.forEach((el, idx) => {
            const isDroppAble = el.getAttribute('droppable');
            // 중복 value 체크 배열
            console.log(isDroppAble)
            el.classList.remove('on');
            getDropPos(el);

            if (isDroppAble === 'true') {
                console.log('드랍 가능')

                if (left < x && x < right && top < y && y < bottom) {
                    console.log('isCorrectChance', isCorrectChance);

                    // 중복 정답 인지
                    let matchingReduplicate = false;
                    if (currentData.type === 'dnd_tangram') {
                        const valData = el.getAttribute('value').split(',');
                        valData.forEach((el) => {
                            if (el === matchingTxtData) {
                                console.log('중복정답')
                                matchingReduplicate = true
                            }
                        })
                    }

                    if (
                        el.getAttribute('key') === matchingData ||
                        el.getAttribute('value') === matchingTxtData || matchingReduplicate
                    ) {
                        console.log('매칭');
                        // 공통 정답 오디오 재생
                        playAudio(commonCorrect);
                        el.innerText = item.innerText;
                        el.setAttribute('droppable', false)
                        item.style.opacity = 0;
                        item.draggable = false;
                        item.classList.add('disabled');

                        // console.log(dropStatusArr)

                        //드랍 상태 업데이트
                        dropStatusArr[matchingData - 1] = {
                            state: true,
                            // chance: dropStatusArr[matchingData - 1].chance,
                        };


                        const isAllCorrect = dropStatusArr.every((correct) => correct.state);
                        if (currentData.type === 'dnd_compare') {
                            processDragItems(dragItem, 1000);
                        } else {
                            if (isAllCorrect) {
                                processDragItems(dragItem, 1000);
                            }
                        }

                        if (currentData.type === 'dnd_sentence') {
                            if (isAllCorrect) {
                                document.querySelector('.question-wrap h2').classList.add('active')
                            }
                        }

                    } else {
                        item.querySelector('p').classList.add('active');
                        // playAudio(reactionData.wrong.audio);
                        isCorrectChance--;

                        //오답음성 재생
                        // playAudio(commonWrong);
                        commonWrong.play();

                        setTimeout(function () {
                            item.querySelector('p').classList.remove('active');
                        }, 1000);

                        dropStatusArr[idx] = {
                            state: false,
                            // chance: dropStatusArr[idx].chance - 1,
                        };
                        console.log(dropStatusArr);

                        // 문제 풀 기회 2회 제공 조건 나누기
                        if (isCorrectChance === 1) {

                            const hintEl = document.querySelector('.hint-wrap');
                            // 힌트 있을때 힌트 보이기
                            if (currentData.hintImg) {
                                testContentEl.classList.add('hint');
                                hintEl.innerHTML = `
                                <img src="${currentData.hintImg}" alt="힌트 이미지"/>
                            `;
                            }


                            if (reactionData.wrong || currentData.wrong) {
                                console.log('오답 오디오');
                                // audio.addEventListener('ended', function(){
                                wrongHintCont.classList.add('active');
                                playAudio(reactionData.wrong ? reactionData.wrong.audio : currentData.wrong.audio);

                                audio.addEventListener('ended', function () {
                                    wrongHintCont.classList.remove('active');
                                })
                                // })
                            }

                            if (currentData.type === 'dnd_num2') {
                                const aniCont = document.createElement('div');
                                aniCont.classList.add('q-ani');

                                // 수직선 간격 만큼 div 추가
                                const aniContLen = currentData.question.dropArea.length - 1;

                                for (let i = 0; i < aniContLen; i++) {
                                    const aniBar = document.createElement('div');
                                    aniBar.classList.add('aniBar');
                                    aniBar.innerHTML = `
                                        <span>${currentData.hintTxt}</span>
                                    `;
                                    aniCont.appendChild(aniBar);
                                }

                                document.querySelector('.question-wrap').appendChild(aniCont);
                                const aniBar = document.querySelectorAll('.aniBar');

                                aniBar.forEach((el, index) => {
                                    el.style.width = `calc(100% / ${aniContLen})`;
                                });
                                addAnimationHandler(aniBar)

                            } else if (currentData.type === 'dnd_sentence') {
                                document.querySelector('.q-txt-ani').classList.add('animated')
                            } else if (currentData.type === 'dnd_sentence3') {
                                document.querySelectorAll('.q-txt-ani').forEach((el, idx) => {
                                    el.classList.add(`animated${idx + 1}`)
                                });

                            } else if (currentData.type === 'dnd_multi' || currentData.type === 'dnd_compare') {
                                document.querySelectorAll('.txt-ani').forEach((el) => { el.classList.add('animated') })
                            }

                        } else {
                            // 기회 없을 때 보기 비활성화 및 정답 표시
                            processDragItems(dragItem, 1000);
                        }
                    }
                }
            } else {
                console.log('드랍 불가능')
                return;
            }

        });

        checkCurrentPageHandler(dropStatusArr, currentData.correctAudio);
    }

    function processDragItems(dragItem, delay) {
        dragItem.forEach((drag) => {
            drag.draggable = false;
            drag.classList.add('disabled');
            setTimeout(() => {
                drag.classList.add('off');
                document.querySelectorAll('.q-box').forEach((drop) => {
                    if (drop.getAttribute('key') === drag.getAttribute('data-key')) {
                        drop.innerText = drag.innerText;
                    }
                });
            }, delay);
        });
    }

    // 드랍 이벤트
    function dropEndEvent(e, item) {
        e.preventDefault();
        console.log('drop 이벤트');
        const matchingData = e.dataTransfer ? e.dataTransfer.getData('key') : item.getAttribute('data-touch-key');

        // 매칭 되었을 때 넣기! ( 정답 유도 )
        if (item.getAttribute('key') === matchingData) {
            const draggingItem = document.querySelector(`[data-key="${matchingData}"] p`).innerText;
            item.innerText = draggingItem;
            draggingItem.draggable = false;
            item.classList.remove('on');

            //드랍 상태 업데이트
            dropStatusArr[matchingData - 1] = {
                ...dropStatusArr[matchingData],
                state: true,
            };
            console.log(dropStatusArr);
        }
    }

    function dropOverEvent(e, item) {
        console.log('=======dragOver');
        e.preventDefault();
        dropItem.forEach((el) => {
            el.classList.remove('on');
        });
        item.classList.add('on');
    }

    function dropLeaveEvent(e, item) {
        e.preventDefault();
        item.classList.remove('on');
    }

    // 드랍 영역 위치 확인
    function getDropPos(el) {
        let dropPos = el.getBoundingClientRect();
        left = dropPos.left;
        right = dropPos.right;
        top = dropPos.top;
        bottom = dropPos.bottom;

        return left, right, top, bottom;
    }

    dragItem.forEach((el) => {
        el.addEventListener('dragstart', (e) => dragStartEvent(e, el));
        el.addEventListener('drag', (e) => dragOverEvent(e, el));
        el.addEventListener('dragend', (e) => dragEndEvent(e, el));

        el.addEventListener('touchstart', (e) => dragStartEvent(e.touches[0], el));
        el.addEventListener('touchmove', (e) => touchOverEvent(e.touches[0], el));
        el.addEventListener('touchend', (e) => dragEndEvent(e, el));
    });

    dropItem.forEach((el) => {
        el.addEventListener('drop', (e) => dropEndEvent(e, el));
        el.addEventListener('dragover', (e) => dropOverEvent(e, el));
        el.addEventListener('dragleave', (e) => dropLeaveEvent(e, el));

        el.addEventListener('touchmove', (e) => dropOverEvent(e.touches[0], el));
        el.addEventListener('touchcancel', (e) => dropLeaveEvent(e, el));
        el.addEventListener('touchend', (e) => {
            e.preventDefault();
            dropEndEvent(e, el);
        });
    });
}

/**
 * 키패드
 * @param {object} answerBox 정답 박스
 * @param currentData 현재문제 데이터
 * @param keypadStatusArr 키패드 정답 상태
 * @param reactionData 공통 리액션 데이터
 */
let keypadCurrentData;
let initkeypadStatusArr; // 241202 추가
function keypadEvent(answerBox, currentData, keypadStatusArr, reactionData) {
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

  console.log("currentData:::", currentData);
  keypadCurrentData = currentData;

  console.log("initKeypadStatusArr:::", keypadStatusArr);
  initkeypadStatusArr = keypadStatusArr; // 241202 추가

  // 키패드 정답 체크 횟수
  let correctCount = 0;

  // 키패드 닫기 체크
  let keypadCloseFlag = false;

  const keypadEl = document.createElement("div");
  keypadEl.classList.add("keypad");

  // 문제 박스 클릭 시 키패드 노출
  answerBox.forEach((el, idx) => {
    el.setAttribute("data-index", idx + 1);
    el.addEventListener("click", function (e) {
      touchAudio.play();
      let answerPosLeft = el.getBoundingClientRect().left;

      if (currentData.type === "keypad_compare") {
        keypadEl.style.left = answerPosLeft;
      } else if (currentData.type === "keypad_figure") {
        keypadEl.style.left = answerPosLeft + 250;
        keypadEl.style.bottom = "15vw";
      } else if (currentData.type === "keypad_figure2") {
        keypadEl.style.left = "73%";
        keypadEl.style.bottom = "15vw";
      }

      keypadEl.innerHTML = `
                <div class="keypad-inner">
                    <ul class="keypad-left">
                        ${keyData.map((item) => `<li key=${item.id} data-value=${item.val}>${item.val}</li>`).join("")}
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

      testContentEl.appendChild(keypadEl);

      answerBox.forEach((el) => {
        el.classList.remove("on");

        //정답입력 한 이후 다음 박스 클릭시 정답 체크
        if (
          el.innerText !== "?" &&
          !e.currentTarget.classList.contains("on") &&
          correctCount === 0 &&
          !keypadCloseFlag
        ) {
          checkKeypadAnswer(el);
        }
      });

      if (isCorrectChance >= 1) {
        el.classList.add("on");
        keypadEl.classList.add("active");
      }

      const keyBtnEl = document.querySelectorAll(".keypad li");

      //키패드 버튼 클릭이벤트
      keyBtnEl.forEach((keyBtn) => {
        keyBtn.addEventListener("click", function () {
          keypadCloseFlag = false;

          touchAudio.play();
          let keyVal = keyBtn.getAttribute("data-value");
          let selectedAnswerBox = document.querySelector(".q-box.on");

          if (keyVal === "delete") {
            selectedAnswerBox.innerText = "?";
          } else if (keyVal === "confirm") {
            checkKeypadAnswer(selectedAnswerBox);
          } else if (keyVal === "close") {
            // 키패드 닫기 기능 추가 (0605)
            keypadCloseFlag = true;

            el.classList.remove("on");
            keypadEl.classList.remove("active");
          } else {
            selectedAnswerBox.innerText = keyVal;
          }
        });
      });
    });
  });

  document.addEventListener("click", function (e) {
    let keypad = document.querySelector(".keypad");
    let selectedAnswerBox = document.querySelector(".q-box.on");

    // 클릭된 요소가 키패드 자신이거나 키패드 내부 요소인 경우 무시
    if (e.target.closest(".keypad") === keypad || keypad.contains(e.target) || e.target === selectedAnswerBox) {
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
    console.log("selectedAnswerBox:::", selectedAnswerBox);

    // testContentEl.removeChild(keypadEl);
    keypadEl.classList.remove("active");

    selectedAnswerBox.classList.remove("on");

    const currentData = keypadCurrentData;
    keypadStatusArr = initkeypadStatusArr; // 241202 추가

    let userAnswer = selectedAnswerBox.innerText.trim();
    let index = parseInt(selectedAnswerBox.getAttribute("data-index")) - 1;

    // 241202 중복 실행으로 이미 정답 처리가 된 상황에서 추가 정답 처리됨을 막기 위해 추가
    if(keypadStatusArr[index].state){
        return;
    }

    console.log(index);
    let correctAnswer =
      currentData.type !== "keypad_figure" ? currentData.answer[index].val : selectedAnswerBox.getAttribute("value");

    console.log("checked currentData:::", currentData);

    if (userAnswer === correctAnswer) {
      console.log("정답입니다.");
      correctCount++; // 정답 맞춘 정답 박스

      keypadStatusArr[index] = {
        state: true,
      };
      selectedAnswerBox.classList.add("disabled");

      playAudio(commonCorrect);
    } else {
      console.log("오답입니다.");
      // playAudio(commonWrong);
      commonWrong.play();
      isCorrectChance--;

      keypadStatusArr[index] = {
        state: false,
      };
      console.log(keypadStatusArr);

      //힌트 텍스트
      const hintTxt = document.querySelectorAll(".hint-txt");

      if (hintTxt.length > 0) {
        hintTxt[index].classList.add("on");
      }
      selectedAnswerBox.innerText = "?";

      if (currentData.type === "keypad_compare") {
        const hintTxtWrap = document.querySelector("h3");
        hintTxtWrap.innerText = currentData.wrong[index].txt;
      }

      // 문제 풀 기회 2회 제공
      if (isCorrectChance === 1) {
        if (currentData.type === "keypad_figure") {
          const hintImgEl = document.querySelector(".activeHint");
          hintImgEl.classList.add("active");

          // const hintImg = document.createElement('img');
          // hintImg.classList.add('activeHint');
          // hintImg.src = currentData.wrongAni
          // document.querySelector('.question-img').appendChild(hintImg)
        } else {
          if (currentData.wrong) {
            // audio.addEventListener('ended', function(){
            playAudio(currentData.wrong[index].audio);

            // })
          } else if (reactionData.wrong) {
            // audio.addEventListener('ended', function(){
            playAudio(reactionData.wrong.audio);
            // })
          }

          wrongHintCont.classList.add("active");
          audio.addEventListener("ended", function () {
            wrongHintCont.classList.remove("active");
          });
        }

        setTimeout(() => {
          document.querySelectorAll(".q-box").forEach((el) => {
            el.classList.remove("on");
          });
          testContentEl.removeChild(keypadEl);
        }, 500);
      } else {
        selectedAnswerBox.classList.add("disabled");

        setTimeout(() => {
          console.log("Last currentData:::", currentData);
          document.querySelectorAll(".q-box").forEach((el, idx) => {
            el.classList.remove("on");
            el.innerText = currentData.type !== "keypad_figure" ? currentData.answer[idx].val : correctAnswer;
          });
        }, 1000);
      }
    }
    console.log("keypadStatusArr:::", keypadStatusArr);
    checkCurrentPageHandler(keypadStatusArr, currentData.correctAudio);
  }
}

/**
 * dottodot 선긋기 이벤트
 * @param dottodotStatusArr 선긋기 상태 배열 
 * @param reactionData 공통 리액션 데이터
 * @param currentData 현재 데이터
 * @param isAnswered 연결 한적 있는지 상태
 */

function dottodotEvent(dottodotStatusArr, reactionData, currentData, isAnswered) {
    console.log('=============dottodot ===============')
    console.log(reactionData)

    let mainCanvas = null; // main canvas Class
    let ani = null; // ani Class
    let questionDots = []; // question dots (top dots)
    let answerDots = []; // answer dots (bottom dots)
    let questionNum = 1; // 문항 숫자

    const qDotEl = document.querySelectorAll('.startDot');

    /**
     * 데이터 서치
     */
    function searchDots() {
        questionDots = $(".dot[name=question][locked=false]");
        answerDots = $(".dot[name=answer][locked=false]");
    }

    // Dot Class
    class Dot {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }
    // Line Class
    class Line {
        constructor() {
            this.point = new Dot(null, null);
            this.pointLine = new Dot(null, null);
            this.pointEnd = new Dot(null, null);
            this.isDown = false;
            this.color = "#FF64DC";
        }

        // default 색상
        prevDrawingColor() {
            this.color = "#FF64DC";
        }
        // 그릴때 색상
        DrawingColor() {
            this.color = "#FF64DC";
        }
        // 그림 그리기
        draw(ctx) {
            this.drawDot(ctx, this.point, 12, "#6744F3");
            this.drawLine(ctx);
            this.drawDot(
                ctx,
                this.pointEnd,
                12,
                this.isDown ? "transparent" : "#6744F3"
            );
        }
        // 점그리기
        drawDot(ctx, dot, radius, color) {
            if (dot.x == null || dot.y == null) return;
            ctx.beginPath();
            ctx.arc(this.point.x, this.point.y, radius, 0, Math.PI * 2, true);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
        // 라인 그리기
        drawLine(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.point.x, this.point.y);
            ctx.lineTo(this.pointLine.x, this.pointLine.y);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 6;
            ctx.stroke();
            ctx.closePath();
        }
        // touchDown
        onDown(x, y) {
            this.point.x = x;
            this.point.y = y;
            this.pointLine.x = x;
            this.pointLine.y = y;
            this.isDown = true;
        }
        // touchMove
        onMove(x, y) {
            if (this.isDown && this.point.x) {
                this.pointLine.x = x;
                this.pointLine.y = y;
            }
        }
        // touchUp
        onUp(x, y) {
            this.pointEnd.x = x;
            this.pointEnd.y = y;

            this.isDown = false;
        }
        // line clear
        onClear() {
            this.point = new Dot(null, null);
            this.pointLine = new Dot(null, null);
            this.pointEnd = new Dot(null, null);
            this.isDown = false;
        }
    }

    // Canvas Class
    class Canvas {
        constructor() {
            this.canvas = $("#dotCanvas")[0];
            this.ctx = this.canvas.getContext("2d");
            this.rect = this.canvas.getBoundingClientRect();
            this.questionDot = null;
            this.answerDot = null;
            this.moving = false;
            this.pos = {};
            this.lines = [];
            this.line = null;
            this.touchCount = 0;

            this.init();
            this.resize();

            window.addEventListener("resize", this.resize.bind(this));
            window.requestAnimationFrame(this.animate.bind(this));
            this.canvas.addEventListener("mousedown", this.onDown.bind(this));
            this.canvas.addEventListener("touchstart", this.onDown.bind(this));
            this.canvas.addEventListener("mouseup", this.onUp.bind(this));
            this.canvas.addEventListener("touchend", this.onUp.bind(this));
            this.canvas.addEventListener("mousemove", this.onMove.bind(this));
            this.canvas.addEventListener("touchmove", this.onMove.bind(this));
        }
        // init
        init() {
            const dpr = window.devicePixelRatio;
            this.canvas.width = this.rect.width * dpr;
            this.canvas.height = this.rect.height * dpr;
        }
        // clear
        clear() {
            this.questionDot = null;
            this.answerDot = null;
            this.pos = {};
            this.lines = [];
            this.line = null;
        }
        // resize
        resize() {
            this.canvas.width = document.body.clientWidth;
            this.canvas.height = document.body.clientHeight;
            this.stageWidth = document.body.clientWidth;
            this.stageHeight = document.body.clientHeight;
            this.ctx.scale(this.pixelRatio, this.pixelRatio);
        }
        // ani
        animate() {
            window.requestAnimationFrame(this.animate.bind(this));
            this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
            this.lines.forEach((line) => {
                line.draw(this.ctx);
            });
        }
        // touchDown
        onDown(e) {
            this.touchCount++;
            console.log("canvas onDown start : ", this.touchCount);

            e = e.changedTouches ? e.changedTouches[0] : e;

            if (this.line != null) {
              this.line.onClear(this.ctx, this.stageWidth, this.stageHeight);
            }

            if(this.touchCount == 1){
                this.rect = this.canvas.getBoundingClientRect();
                let clientX = e.clientX - this.rect.left;
                let clientY = e.clientY - this.rect.top;
                this.pos = { x: clientX, y: clientY };
                searchDots();
                let questionDot = this.dotBoundaryCheck("question");
                if (questionDot) {
                    playAudio(audioLine);
                    const newLine = new Line();
                    this.lines.push(newLine);
                    this.line = newLine;
                    this.questionDot = questionDot;
                    let questionDotRect = this.questionDot.getBoundingClientRect();
                    let questionDotX = (questionDotRect.x + questionDotRect.width / 2);
                    let questionDotY =
                        (questionDotRect.y + questionDotRect.height / 2);
                    this.line.onDown(questionDotX, questionDotY);
                } else {
                    this.questionDot = null;
                }
            }

            console.log("canvas onDown end");
        }
        // touchMove
        onMove(e) {
            console.log("canvas onMove start");

            if(this.touchCount == 1 && this.line != null){
                if (this.questionDot) {
                    e = e.changedTouches ? e.changedTouches[0] : e;

                    let clientX = e.clientX - this.rect.left;
                    let clientY = e.clientY - this.rect.top;
                    this.pos = { x: clientX, y: clientY };
                    this.line.onMove(this.pos.x, this.pos.y);
                }
            }
  
            console.log("canvas onMove end");
        }
        // touchUp
        onUp(e) {
            console.log("canvas onUp start");

            let touchCountFlag = false;

            // if (!this.questionDot) return;
            if (!this.questionDot) {
              this.touchCount--;
              touchCountFlag = true;
              console.log("canvas onUp1 end : ", this.touchCount);
            }

            if(this.touchCount == 1 && this.line != null){
                e = e.changedTouches ? e.changedTouches[0] : e;
                let clientX = e.clientX - this.rect.left;
                let clientY = e.clientY - this.rect.top;
                this.pos = { x: clientX, y: clientY };
                let answerDot = this.dotBoundaryCheck("answer");
                this.answerDot = answerDot;

                console.log('정답체크')
                const keyVal = this.questionDot.getAttribute('data-key');


                if (this.questionDot.value === this.answerDot.value) {

                    playAudio(commonCorrect);

                    dottodotStatusArr[keyVal - 1] = {
                        state: true,
                        // chance: dottodotStatusArr[keyVal - 1].chance,
                    };
                    checkCurrentPageHandler(dottodotStatusArr, currentData.correctAudio, currentData.wrong);
                } else {

                    // playAudio(commonWrong);
                    commonWrong.play();

                    isCorrectChance--;
                    dottodotStatusArr[keyVal - 1] = {
                        state: false,
                        // chance: dottodotStatusArr[keyVal - 1].chance - 1,
                    };

                    if (isCorrectChance === 1) {
                        const aniCont = document.querySelectorAll('.answerTxt');
                        const aniCont2 = document.querySelectorAll('.q-ani');

                        if (aniCont.length > 0) {
                            aniCont.forEach((el) => {
                                el.classList.add('active');
                            })
                        }

                        if (aniCont2.length > 0) {
                            aniCont2.forEach((el) => {
                                el.classList.add('active');
                            })
                        }

                        if (reactionData.wrong) {

                            // audio.addEventListener('ended', function(){
                            wrongHintCont.classList.add('active');
                            playAudio(reactionData.wrong.audio);
                            audio.addEventListener('ended', function () {
                                wrongHintCont.classList.remove('active');
                            })
                            // })

                        }

                        if (currentData.type === 'dottodot_img') {
                            document.querySelectorAll('.dot-question li img').forEach((el, idx) => {
                                el.src = currentData.wrongAniList[idx]
                            })
                        }
                    } else {

                        dottodotStatusArr.forEach((el, idx) => {
                            qDotEl[idx].setAttribute('locked', 'true');
                            qDotEl[idx].style.background = '#666'
                        })
                        console.log('실패 완료!!!!!!!!!!!!!!!!!!!')
                        setTimeout(() => {
                            autoConnect(currentData.answerImg);
                        }, 1000)
                    }

                    checkCurrentPageHandler(dottodotStatusArr, currentData.correctAudio, currentData.wrong);

                    // this.line = null;
                    this.touchCount--;

                    if (!answerDot) {
                        this.line.onClear(this.ctx, this.stageWidth, this.stageHeight);
                        return;
                    }

                    this.line.onClear(this.ctx, this.stageWidth, this.stageHeight);
                    return;

                }

                let answerDotRect = this.answerDot.getBoundingClientRect();
                let answerDotX = (answerDotRect.x + answerDotRect.width / 2);
                let answerDotY = (answerDotRect.y + answerDotRect.height / 2);
                this.line.onMove(answerDotX, answerDotY);
                this.line.prevDrawingColor();
                this.line.onUp(answerDotX, answerDotY);
                this.onConnect();
            }

            this.line = null;
            if(!touchCountFlag) this.touchCount--;
            console.log("canvas onUp2 end : ", this.touchCount);
        }
        // 점과 점의 line 연결
        onConnect() {
            $(this.questionDot).attr("locked", "true");
            $(this.answerDot).attr("locked", "true");
            $(this.answerDot).css("z-index", "999");
            this.questionDot = null;
            this.answerDot = null;
            searchDots();
        }

        // 점의 영역을 클릭했는지 체크
        dotBoundaryCheck(type) {
            if (!questionDots) {
                return;
            }
            let res = false;
            const dotRadius = 80;
            let searchDots = null;
            if (type === "question") {
                searchDots = questionDots;
            } else {
                searchDots = answerDots;
            }
            searchDots.each((idx, qsDot) => {
                const qsDotRect = qsDot.getBoundingClientRect();
                const qsDotCenterX = (qsDotRect.x + qsDotRect.width / 2);
                const qsDotCenterY = (qsDotRect.y + qsDotRect.height / 2);
                const isWithinX = this.isWithinRange(this.pos.x, qsDotCenterX, dotRadius);
                const isWithinY = this.isWithinRange(this.pos.y, qsDotCenterY, dotRadius);
                if (isWithinX && isWithinY) {
                    res = qsDot;
                }
            });
            return res;
        }
        // 영역안에 있는지 확인 true, false
        isWithinRange(coord, center, radius) {
            return coord >= center - radius && coord <= center + radius;
        }
    }

    searchDots();

    // 정답 체크한적 있는지 체크
    if (isAnswered) {
        autoConnect(currentData.answerImg);
    } else {
        mainCanvas = new Canvas();
    }

}

function autoConnect(imgSrc) {
    const questionArea = document.querySelector('.dot-q-wrap');
    questionArea.classList.add('active')

    questionArea.innerHTML = `
        <img src="${imgSrc}" class="answerImg"/>
    `
}

/**
 * drawFigure 도형 그리기 이벤트
 * @param drawStatusArr 선긋기 상태 배열 
 * @param reactionData 공통 리액션 데이터
 * @param currentData 현재 데이터
 * @param isAnswered 연결 한적 있는지 상태
 */
function drawFigureEvent(drawStatusArr, reactionData, currentData, isAnswered) {
    console.log('도형그리기 이벤트!!!!!!!!!')
    console.log(currentData.question.dotList)
    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');

    const dots = currentData.question.dotList;

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

    window.addEventListener('resize', resizeCanvas);

    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('touchstart', handleCanvasTouchStart);
    canvas.addEventListener('touchmove', handleCanvasTouchMove);
    canvas.addEventListener('touchend', handleCanvasTouchEnd);

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
        ctx.strokeStyle = '#FF64DC';
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
        playAudio(audioLine);
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
            for (const dot of dots) {
                if (isPointInsideCircle(x, y, dot.x, dot.y, 30) && selectedDot !== dot) {
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
                console.log('정답')
                playAudio(commonCorrect);

                canvas.classList.add('disabled');

                console.log(drawStatusArr)

                drawStatusArr[0] = {
                    state: true,
                };
                checkCurrentPageHandler(drawStatusArr, currentData.correctAudio, currentData.wrong);

            } else {
                // 오답 점이랑 연결해야 정답체크
                if (connectedToInCorrectDot) {
                    console.log('오답')
                    // playAudio(commonWrong);
                    commonWrong.play();
                    isCorrectChance--;

                    if (isCorrectChance === 1) {

                        // audio.addEventListener('ended', function(){
                        wrongHintCont.classList.add('active');
                        playAudio(reactionData.wrong.audio);
                        audio.addEventListener('ended', function () {
                            wrongHintCont.classList.remove('active');
                        })
                        // })
                    } else {
                        canvas.classList.add('disabled')

                        setTimeout(() => {
                            document.querySelector('.question-wrap img').src = currentData.answerImg;
                        }, 1000)
                    }
                    drawStatusArr[0] = {
                        state: false,
                    };
                    checkCurrentPageHandler(drawStatusArr);
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
            drawDot(dot.x, dot.y, dot.id, '#000');
        }
    }

    resizeCanvas();
    drawGame();

    if (isAnswered) {
        canvas.classList.add('disabled')
        document.querySelector('.question-wrap img').src = currentData.answeredImg;
    }
}

/**
 * 클릭 오디오 이후 오답리액션 오디오 재생
 * @param audioData 오디오 데이터
 * @param currentData 현재 문제 데이터
 * @param isWrongData 오답 데이터
 */
function addAudioEventListener(audioData, currentData, isWrongData) {
    // audio.addEventListener('ended', function(){
    wrongHintCont.classList.add('active');
    playAudio(isWrongData ? audioData.wrong.audio : currentData.wrong.audio);
    audio.addEventListener('ended', function () {
        wrongHintCont.classList.remove('active');
    })
    // })
}

/**
 * 순서대로 애니메이션 추가
 * @param element 애니메이션 컨텐츠
 */
function addAnimationHandler(element) {
    element.forEach((el, index) => {
        setTimeout(function () {
            el.classList.add('animated');
        }, index * 500);
    });
}

/**
 * 한 페이지 내 정답 여러개 확인 처리
 * @param statusArr  각 유형 정답 상태 배열
 * @param correctAudio  현재페이지 정답 리액션 오디오
 * @param wrongAudio  현재페이지 오답 리액션 오디오
 * */
function checkCurrentPageHandler(statusArr, correctAudio, wrongAudio) {
    //모두 문제 풀이 유무
    let allClearArray = new Array(statusArr.length).fill(null);
    statusArr.forEach((el, idx) => {
        if (el.state) {
            allClearArray[idx] = true;
        }
    })

    const isAllCorrect = statusArr.every((correct) => correct.state);
    const isAllClear = allClearArray.every((el) => el);

    console.log('******************모든 문제 끝*********');
    console.log(isAllClear);

    // 정답 상태 및 체크한 값 업데이트
    console.log("currentQuestion:::", currentQuestion);
    console.log("isCorrectChance:::", isCorrectChance);
    console.log("statusArr:::", statusArr);
    answerStatusArr[currentQuestion - 1] = {
        isCorrect: isCorrectChance === 2 ? true : false,
        checkTarget: statusArr,
    };

    console.log("answerStatusArr:::", answerStatusArr)

    // answerStatusArr[currentQuestion - 1] = {
    //     isCorrect: isAllCorrect,
    //     checkTarget: statusArr,
    // };

    if (isAllClear || isCorrectChance === 0) {
        completePageHandler();

        if (isAllCorrect) {
            console.log('전체 정답입니다!');
            correctReaction();
            // audio.addEventListener('ended', function(){
            // playAudio(correctAudio);
            // })
        } else if (wrongAudio) {
            // 오답 오디오 재생
            audio.addEventListener('ended', function () {
                playAudio(wrongAudio);
            })
        }
    } else if (isCorrectChance === 1) {
        updatePagination();
    }
}

// 페이지 완료 처리
function completePageHandler() {
    updatePagination();
    completeQuestion++;

    if (currentQuestion === 5) {
        nextBtnEl.classList.remove('active');
        setTimeout(() => {
            createNextStep();
        }, 2000)
    } else {
        setTimeout(() => {
            completeQuestionState = true;
            nextBtnEl.classList.add('on');
            nextBtnEl.classList.add('active');
        }, 1200)
    }
}

// 정답 캐릭터
function correctReaction() {
    const reactionCont = document.querySelector('.reaction')
    reactionCont.classList.add('active');
}

/**
 * 문항번호 정/오답/진행/완료 상태 업데이트
 * on = 진행 중 / off = 진행 전 / done = 완료 / correct = 정답 / incorrect = 오답
 */
function updatePagination() {
    const paginationItems = document.querySelectorAll('.pagination li');
    const isAnsweredLen = answerStatusArr.filter(item => item !== null).length;

    paginationItems.forEach((item, idx) => {
        item.className = idx + 1 === currentQuestion ? 'on' : idx + 1 <= completeQuestion || idx + 1 <= isAnsweredLen ? 'done' : 'off';

        // 정답 표시
        if (answerStatusArr[idx] !== null) {
            item.classList.add(answerStatusArr[idx].isCorrect ? 'correct' : 'incorrect');
        }
    });
}

/**
 * 테스트 결과
 * 정답률 - 80% 이상 : 실력쑥쑥 / 80% 이하 : 개념 더하기 랜딩
 */
function getTestResult() {
    const nextStepBtn = document.querySelector('.next-step');
    const isGameState = answerStatusArr.filter(item => item.isCorrect === true).length >= 4;
    let str = isGameState ? 'game' : 'video';

    if (deviceConfirm() === 'mo') {
        // 확인문제 점수 로컬 저장 (0426)
        SetLocalStorage("examScore", answerStatusArr.filter(item => item.isCorrect === true).length);

        window.javascript_object.putStudyVdo('1', str, '0');
    }

    nextStepBtn.addEventListener('click', function () {
        nextStepBtn.style.display = 'none'
        pauseAudio();
        touchAudio.play();
        contentsData = data[str];
        firstContents = str;
        console.log(firstContents)
        if (isGameState) {
            layout.game();
        } else {
            layout.video();
        }
    });
}

// 다음 스텝 버튼 생성
function createNextStep() {
    const nextStepBtn = document.createElement('button');
    nextStepBtn.classList.add('next-step');
    nextStepBtn.innerHTML = `
        <img src="../../../COMM/IMG/NEXT_STEP.PNG" alt="다음버튼" />
    `;
    ContentsWrap.append(nextStepBtn);
    getTestResult();
}
