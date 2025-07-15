const game = {
  /**
   * createGameContent
   * @param {*} el 게임 컨텐츠 container
   * @param {*} type 게임 컨텐츠 타입
   */
  createGameContent: (el, type) => {
    console.log("게임타입:::::", type);

    //게임 컨텐츠 타입별로 레이아웃과 function 넣어주세요!!!!!
    switch (type) {
      //카드 뒤집기
      case "CARDFLIP":
        $(el).load("../../../COMM/GAME/CARDFLIP.HTML");
        break;
      // OX 퀴즈형
      case "OXQUIZ":
        $(el).load("../../../COMM/GAME/OXQUIZ.HTML");
        break;
      // 선잇기
      case "DOTTODOT":
        $(el).load("../../../COMM/GAME/DOTTODOT.HTML");
        break;
      // 계산왕 키패드
      case "CALCKING":
        $(el).load("../../../COMM/GAME/CALCKING.HTML");
        break;
      // 악어 이빨끼기
      case "BRUSHING":
        $(el).load("../../../COMM/GAME/BRUSHING.HTML");
        break;
      // 뽀득뽀득
      case "CRUNCHY":
        $(el).load("../../../COMM/GAME/CRUNCHY.HTML");
        break;
      // 진주줍줍
      case "PEARLPICKUP":
        $(el).load("../../../COMM/GAME/PEARLPICKUP.HTML");
        break;
      // 타임어택
      case "TIMEATTACK":
        $(el).load("../../../COMM/GAME/TIMEATTACK.HTML");
        break;
      // 퀴즈배틀
      case "QUIZBATTLE":
        $(el).load("../../../COMM/GAME/QUIZBATTLE.HTML");
        break;
      // 마트
      case "MART":
        $(el).load("../../../COMM/GAME/MART.HTML");
        break;
      default:
        break;
    }
  },
};
