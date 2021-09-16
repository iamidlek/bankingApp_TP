import './scss/main.scss'

// A.계좌별 페이지
const acountPages = document.querySelectorAll('.app_screen')

// A.Date set
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const today = date.getDate();
const lastDate = new Date(year, month, 0).getDate();
const restDate = lastDate - today

// A.Json data set(this month data)
const currMonth = fetch('https://gist.githubusercontent.com/iamidlek/f875ad6f59d5afe1e232a01287b40164/raw/923194a341dbdbdfdf77947bd1a77cd823a8b0aa/cashbook.json')
  .then(blob => blob.json())
  .then(data => thisMonth(data))

function thisMonth (data) {
  return data.bankList.filter(dailyObj => {
    const y = parseInt(dailyObj.date.slice(0,5))
    const m = parseInt(dailyObj.date.slice(5,7))
    const d = parseInt(dailyObj.date.slice(8))
      return m === month && y === year && d <= today
  })
}


// B.지출 설정 페이지 on/off
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
  const minY = page.querySelector('.home_header').getBoundingClientRect().bottom 

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

// B. input & value
acountPages.forEach( page => {
  const input = page.querySelector('.set-val')
  const homeInput = page.querySelector('.onlyview')
  const stdAmount = page.querySelector('.set_budget > span')
  const spended = page.querySelector('.total')
  const recommend = page.querySelector('.calced > span')

  // 정보 받아오면 실행으로 변경 가능
  window.addEventListener('load', () => inputUpdate(input,homeInput,stdAmount,spended,recommend))
  // 값 변경시
  input.addEventListener('change', () => inputUpdate(input,homeInput,stdAmount,spended,recommend))
  // 모바일
  input.addEventListener('touchmove', () => inputUpdate(input,homeInput,stdAmount,spended,recommend))
  // 웹
  input.addEventListener('mousemove', () => inputUpdate(input,homeInput,stdAmount,spended,recommend))
  
})

function inputUpdate (input,homeInput,stdAmount,spended,recommend) {
  homeInput.value = input.value
  const valueToPer = input.value / 50000
  input.style.background = `linear-gradient(to right, #FFDB4C 0%, #FFDB4C ${valueToPer}%, #C4C4C4 ${valueToPer}%, #C4C4C4 100%)`
  homeInput.style.background = `linear-gradient(to right, #FFDB4C 0%, #FFDB4C ${valueToPer}%, #C4C4C4 ${valueToPer}%, #C4C4C4 100%)`
  stdAmount.innerHTML= `${numberWithCommas(input.value)}원`

  // 권고
  const result = input.value - parseInt(spended.innerHTML.replace(/,/g,''))
  
  if (result >= 0) {
    recommend.innerHTML =`D -${restDate} : ${numberWithCommas(result)}원 남음`
  } else {
    recommend.innerHTML =`D -${restDate} : ${numberWithCommas(Math.abs(result))}원 초과`
  }
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


// B.Home In/Out details
acountPages.forEach( page => {
  const ulMother = page.querySelector('.use_history_detail > ol')
  currMonth.then( logs => {
    
    const dayList = Array.from(new Set(logs.map(l => l.date))).reverse()
    const dayAccum = getDayListAccum()
    const detailList = dayList.map(day=> logs.filter(l => day === l.date))

    function getDayListAccum () {
      return dayList.map(day=>{
        let count = 0
        logs.forEach(l => {
          if (day === l.date && l.income === 'out') count += l.price;
        })
        return count
      })
    }
    
    const html = dayList.map( (day, i) => {
      return pulsEl(day,dayAccum[i],detailList[i])
    }).join('')

    ulMother.innerHTML = html

    // B.Canvas-Mixed bar
    const dayInfo = []
    for (let i = 1; i <= today; i++) {
      dayInfo.push(i)
    }
    const dayListIndex = dayList.map(day=>parseInt(day.slice(8)))
    const valAcc = dayInfo.map(every => dayListIndex.includes(every) ? dayAccum[dayListIndex.indexOf(every)] : 0)

    BuildMixChart(dayInfo, valAcc)
  })
})

function BuildMixChart(dayLabels, valAcc) {
  let cal = 0
  const valAccRa = valAcc.map((val,i)=> {
    cal = (cal + val) / (i+1)
    return cal 
  })
  const data = {
    labels: dayLabels,
    datasets: [
      {
        type: 'bar',
        data: valAcc,
        backgroundColor: '#38C976',
        barThickness: 5,
        borderRadius: 4,
        order: 2
      },
      {
        type: 'line', 
        data: valAccRa,
        borderWidth: 2,
        borderColor: '#FF5F00',
        borderDash: [5,7],
        pointBorderColor: 'transparent',
        pointBackgroundColor:'transparent',
        order: 1
      }
    ]
  };

  const ctx = document.getElementById('bar_chart').getContext('2d');

  const mixedChart = new Chart(ctx, {
    type: 'bar',
    data: data,
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
          max: 250000,
          ticks: {
            stepSize: 50000
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

  return mixedChart
}

function pulsEl (day,accum,list) {
  const date = parseInt(day.slice(8)) === today ? '오늘' : parseInt(day.slice(8)) === today - 1 ? '어제' : `${parseInt(day.slice(8))}일`
  
  const htmlH = `
    <div>
      <span>${date}</span>
      <span>${numberWithCommas(accum)}원 지출</span>
    </div>
    `
  
  const htmlC = list.map(l => {
    const {income,history,price} = l
    if (income === 'in') {
      return `
      <li>
        <span>${history}</span>
        <span class="${income}">+ ${numberWithCommas(price)}</span>
      </li>
      `
    } else {
      return `
      <li>
        <span>${history}</span>
        <span class="${income}">${numberWithCommas(price)}</span>
      </li>
      `
    }
  }).join('')

  return `<li>${htmlH}<ol>${htmlC}</ol></li>`
}

// B.Canvas-doughnut
currMonth.then(logs => {
  const accum = logs.reduce( function (obj,item) {
      if (!obj[item.classify]){
        obj[item.classify] = 0
      }
      obj[item.classify] += item.price
      return obj
    }, {})
    
    const DoughnutLabels =[
      'health',
      'eatout',
      'mart',
      'shopping',
      'oiling',
    ]
  
  const accumList = DoughnutLabels.map(name => {
      return accum[name]
    })
  
  const totalSum = accumList.reduce( function (a, i) {
    return a+i 
  })

  const income = accum[""]

  totalAmount(accumList, totalSum, income)
  BuildChart(DoughnutLabels, accumList);
  
})

function totalAmount(list,total,income) {
  // 월 정보
  const monInfo = document.querySelector('.thismon')
  monInfo.innerHTML = month

  // 지출 총액
  const totalSpan = document.querySelector('.total')
  totalSpan.innerHTML = numberWithCommas(total)
  
  // 홈화면 금액
  const homeSpan = document.querySelector('.acct_balance > span')
  homeSpan.innerHTML = numberWithCommas(income)
  // 종목별 금액
  // memo: 순서가 바뀌는 요건사항이 있을 수 있음 (반복문x?)
  //       분류 종목이 추가되는 요건 사항이 있을 수 있음
  const oiling = document.querySelector('.oiling')
  const health = document.querySelector('.health')
  const eatout = document.querySelector('.eatout')
  const mart = document.querySelector('.mart')
  const shopping = document.querySelector('.shopping')

  oiling.innerHTML = `${numberWithCommas(list[list.length -1])}원`
  health.innerHTML = `${numberWithCommas(list[0])}원`
  eatout.innerHTML = `${numberWithCommas(list[1])}원`
  mart.innerHTML = `${numberWithCommas(list[2])}원`
  shopping.innerHTML = `${numberWithCommas(list[3])}원`

}

function BuildChart(labels, values) {
  const data = {
      labels: labels,
      datasets: [{
          data: values,
          backgroundColor: [
            '#F58F29',
            '#FF4B3E',
            '#235789',
            '#9BC53D',
            '#DB3069',
          ],
          hoverOffset: 0,
          borderWidth: 0,
      }],
  };

  const ctx = document.getElementById('donut').getContext('2d');
  const myChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false,
            }
          },
          cutout: '77%',
      },
    });

  return myChart;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
