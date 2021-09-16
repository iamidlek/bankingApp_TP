# Q.

## Html

### 컨테이너, wrapper 박스 

1. 어떤 동작 등을 미리 예상하고 작성해야 좋다고 생각
  - 파악하는 좋은 방법이 있는지 (생각, 고려하는 순서, 틀잡는 순서)

### swiper 적용시

1. 슬라이드 되면 해당 페이지의 정보를 불러오는 이벤트 실행이 가능한지
2. 실제 어플 등에서 슬라이드해서 다른 계좌로 이동하는 것이 슬라이드로 적용 되는지

## Css

1. figma의 요소들이 미묘하게 중앙 정렬이 아닌 이유는 무엇인지

2. 적응형? 일때 다양한 디바이스를 지원하기위한 여백, 배치 등은 어떻게 하면 좋을지(vh vw %)
  - 세로길이 가로길이가 다 변하는 경우.. 폰트사이즈 변경은 해야할지 말아야 할지

## JS

1. 같은 구성의 내용만 다른 경우 queryselectAll로 가져와서 forEach
  - pages.forEach( page => {} )
  - 한번에 안에 다 써야하는지 or 기능 별로 pages.forEach( page => {} )를 재작성해서 사용하는지
  

2. function을 밖에 선언하는 것과 .forEach( page => {여기} ) 안에 선언하는 것의 차이
  - 안에 선언하면 내부의 변수를 편하게 사용하는데 여러번 선언되는것 같아 좋은건지 않좋은건지
  - 밖에 선언하면 (파라미터) 로 받아 와야하긴 하지만 함수 자체는 하나를 이용함

  ```js
  pages.forEach( page => {
    
    const 변수 = [];
    
    정리하기()
    표만들기()
    데이터처리()
  } )
  ```
  ```js
  pages.forEach( page => {
    
    const 변수 = [];

    정리하기(변수)
    표만들기(변수)
  } )
  
  function 정리하기(변수) {}
  function 표만들기(변수) {}
  function 데이터처리() {}
  ```