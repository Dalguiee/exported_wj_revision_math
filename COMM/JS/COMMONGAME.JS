// GAME쪽에서 사용하는 공용 CLASS
class Game {
  constructor() {
    this.examData = null;
    this.sound = null;
  }

  // 데이터 셋팅
  setExamData(_examData) {
    this.examData = _examData;
  }

  // 데이터 로드 (데이터 랜덤 포함)
  dataLoad(initData) {
    let examData = "";
    let originExamData = "";
    let examDataRandom = "";

    try {
      if (newVarExGame) {
        examData = gameData.game.data;
        examDataRandom = gameData.game.random;
      }
    } catch (e) {
      try {
        examData = contentsData?.data;
        examDataRandom = contentsData?.random;
      } catch (e) {
        examData = initData;
        examDataRandom = 'Y';
      }
    }

    if (examData) {
      originExamData = examData.slice();

      // 문항 순차 노출 추가 (0509)
      examData.sort(() => Math.random() - 0.5);
      if (examDataRandom == 'N') {
        examData = originExamData.slice();
      }
    }

    this.setExamData(examData);
    return examData;
  }

  // 게임 사운드 플레이
  soundPlay(sound) {
    if (this.sound) {
      this.sound.pause();
      this.sound.currentTime = 0;
    }
    this.sound = sound;
    this.sound.play();
  }

  // hide or show
  onView(obj, view) {
    if (view) {
      obj.removeClass("hide").addClass("show");
    } else {
      obj.removeClass("show").addClass("hide");
    }
  }
}

const GAME = new Game();

function onPause() {
  try {
    audioBG.pause();
  } catch (e) { }
}

function onResume() {
  try {
    audioBG.play();
  } catch (e) { }
}
