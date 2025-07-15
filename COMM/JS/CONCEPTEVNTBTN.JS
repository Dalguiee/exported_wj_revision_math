// 개념익히기 시작 버튼 클릭 공통 처리 (240424)
$(document).on("click", ".startBtn", () => {
  audioBtnStart();
  pageAction();
});

//이전 버튼
$(document).on("click", ".btn-prev", () => {
  disStep -= pageData[disStep - 1].prev;
  pageAudioReset();
  pageAction();
});

//다음 버튼
$(document).on("click", ".btn-next", () => {
  disStep += pageData[disStep - 1].next;
  pageAudioReset();
  pageAction();
});

//해더 사운드 버튼 재생
const titleSound = () => {
  titleAudioSet([`${pageData[disStep - 1].sound}`]);
};
