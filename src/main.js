import './scss/main.scss'

// Json data set
// fetch('https://gist.githubusercontent.com/iamidlek/f875ad6f59d5afe1e232a01287b40164/raw/923194a341dbdbdfdf77947bd1a77cd823a8b0aa/cashbook.json')
//   .then(blob => blob.json())
//   .then(data => value(data))
  
// const kakeibo = []
  
// function value (data) {
//   data.bankList.forEach( dailyObj => {
//     kakeibo.push(element)
//   });
// }

// let today = new Date();
// let year = today.getFullYear(); // 년도
// let month = today.getMonth() + 1;  // 월
// let date = today.getDate();  // 날짜

// console.log(kakeibo)
// Income & Expenditure 

// this month data



// const monthKakei = kakeibo.filter( log => {
//   return info[0] === year && info[1] === month
// })


// daily

// kakeibo.forEach( log => {

// })

// Category



// A.계좌별 페이지
const acountPages = document.querySelectorAll('.app_screen')

// B.지출 설정 페이지 on/off 토글
acountPages.forEach( page => {
  const setBtn = page.querySelector('.go_set_budget')
  const closeBtn = page.querySelector('.close')
  const setting = page.querySelector('.setting')
  setBtn.addEventListener('click', () => setBugetPage(setting))
  closeBtn.addEventListener('click', () => setHomePage(setting))
})

function setBugetPage (setting) {
  setting.classList.add('on')
}

function setHomePage (setting) {
  setting.classList.remove('on')
}

// B.드래그 업 (지출 상세) + 상세 페이지 높이 변화 주기
acountPages.forEach( page => {
  const dragBtn = page.querySelector('.drag_btn')
  const dragTarget = page.querySelector('.bank_use_history') 
  let currTargetY = dragTarget.getBoundingClientRect().top
  
  // 최대 최소 값 (고정)
  const maxY = dragBtn.getBoundingClientRect().top
  const minY = page.querySelector('.home_header').getBoundingClientRect().bottom +6 

  // 컨트롤러
  let isDown = false
  let eStartY = 0


  // + 지출 상세 페이지 높이 변화
  const changeBottom = page.querySelector('nav').getBoundingClientRect().top - 8
  const detailPage = page.querySelector('.use_history_detail')

  window.addEventListener('load', changeHeight)
  function changeHeight () {
    const changeTop = page.querySelector('.saving').getBoundingClientRect().bottom
    const changedHeight = changeBottom-changeTop
    detailPage.style.height = changedHeight + "px"
  }

  // 모바일
  dragBtn.addEventListener('touchstart', moveActivate)
  dragTarget.addEventListener('touchmove', moveAct)
  dragTarget.addEventListener('touchend', moveEnd)
  
  // 웹 
  dragBtn.addEventListener('mousedown', moveActivate)
  dragTarget.addEventListener('mousemove', moveAct)
  dragTarget.addEventListener('mouseup', moveEnd)
  dragTarget.addEventListener('mouseout', moveEnd)
  
  function moveActivate (e) {
    isDown = true
    if (e.type === 'mousedown') {
      eStartY = e.clientY
    } else if (e.type === 'touchstart'){
      eStartY = e.touches[0].clientY
    }
  }

  function moveAct (e) {
    if (isDown) {
      if (e.type === 'mousemove') {
        const distanceY = (eStartY - e.clientY)
        const movedY = currTargetY - distanceY
        if (movedY <= maxY && movedY >= minY) {
          dragTarget.style.top  = movedY + 'px';
        }
      } else if (e.type === 'touchmove'){
        const distanceY = (eStartY - e.touches[0].clientY)
        const movedY = currTargetY - distanceY
        if (movedY <= maxY && movedY >= minY) {
          dragTarget.style.top  = movedY + 'px';
        }
      }
      changeHeight()
    }
  }
  
  function moveEnd () {
    isDown = false;
    currTargetY = dragTarget.getBoundingClientRect().top
  }
})

  // 색상 정보도 받아 올 수 있게?하려면 page 부터 돌듯..?
// A.input[type="range"] style (thumb 이동시 bar 스타일)
const inputs = document.querySelectorAll('input[type="range"]')

// B.
inputs.forEach(input => {
  // 정보 받아오면 실행으로 변경 가능
  window.addEventListener('load', () => inputUpdate(input))
  // 값 변경시
  input.addEventListener('change', () => inputUpdate(input))
  // 모바일
  input.addEventListener('touchmove', () => inputUpdate(input))
  // 웹
  input.addEventListener('mousemove', () => inputUpdate(input))
})

function inputUpdate (input) {
  input.style.background = `linear-gradient(to right, #FFDB4C 0%, #FFDB4C ${input.value}%, #C4C4C4 ${input.value}%, #C4C4C4 100%)`
}

// A. 옆으로 스크롤 되는 요소에 휠을 줄 수 있게 하기
const horizontals = document.querySelectorAll('.saving')

horizontals.forEach( horizontal => {
  horizontal.addEventListener('wheel', e => {
    e.preventDefault();
    if(e.wheelDelta > 0){
      // scroll up -> move left
      horizontal.scrollLeft -= 20;
    }else{
      // scroll down -> move right
      horizontal.scrollLeft += 20;
		}
  })
})

// canvas-bar
const ctx = document.getElementById('bar_chart').getContext('2d');
const mixedChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['01', '02', '03', '04','04','04','04','04','04','04','04','04','04','04','04','04','04','04','04','04','04','04','04','04','30','04','04','04','04','30' ],
    datasets: [
      {
        type: 'bar',
        data: [10000, 20000, 30000, 30000, 20000, 50000],
        backgroundColor: '#38C976',
        barThickness: 5,
        borderRadius: 4,
        order: 2
      },
      {
        type: 'line', 
        data: [10000, 30000, 60000, 90000, 10000, 50000],
        borderWidth: 2,
        borderColor: '#FF5F00',
        borderDash: [5,7],
        pointBorderColor: 'transparent',
        pointBackgroundColor:'transparent',
        order: 1
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {        
      y: {
        grid: {
          borderDash: [8, 4],
          color: '#ECF0F4',
          drawBorder: false
        },
        beginAtZero: false,
        min: 0,
        max: 100000,
        ticks: {
          stepSize: 20000
        }
      },  
      x: {
        grid: {
          display: false,
        },
      },
      
    }
  }
});


// canvas-donut
const testing = document.getElementById('donut').getContext('2d');

const donutChart = new Chart(testing, {
  type: 'doughnut',
  data: {
    labels: [
      'health',
      'eatout',
      'mart',
      'shopping',
      'oiling',
    ],
    datasets: [{
      data: [300, 50, 100,200,100],
      backgroundColor: [
        '#F58F29',
        '#FF4B3E',
        '#235789',
        '#9BC53D',
        '#DB3069',
      ],
      hoverOffset: 4,
    }]
  },
  options: {
    maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      plugins: {
        legend: {
          display: false,
        }
      },
      cutout: '77%',
  },
});
