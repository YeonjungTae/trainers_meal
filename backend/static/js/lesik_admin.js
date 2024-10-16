// ajax 요청 시에 사용할 csrf token
const csrftoken = getCookie('csrftoken');

// ajax 요청 시 csrf token 인증
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(document).ready(function() {
    init();
    clickEvent();
});

// 초기화
function init() {
}

function clickEvent() {
    // 대량 다운로드 버튼 클릭 시 발생 이벤트
    $(document).on('click', '.download', function() {
        excelDownload();
    });
}

// YYYY/MM/DD 출력 함수
function convertDate(data) {
    var date = new Date(data);
    var formatOptions = { 
           day:    '2-digit', 
           month:  '2-digit', 
           year:   'numeric',
    };
    var dateString = date.toLocaleDateString('ko-KR', formatOptions).replaceAll('. ', '.').slice(0, -1);
        // => "2024/06/16"

    return dateString;
}

// ================ 파일 업로드 다운로드 관련 함수 정의 시작 ================
// 현재 리스트를 엑셀로 다운로드
function excelDownload() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        var a, today;
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            a = document.createElement('a');
            a.href = window.URL.createObjectURL(xhttp.response);
            today = new Date();
            a.download = '[' + convertDate(today) + '] LeSIK 주문 목록.xlsx';
            a.style.display = 'none';
            document.body.appendChild(a);
            document.body.className='loaded';
            return a.click();
        }
    };

    xhttp.withCredentials = true;
    xhttp.open('POST', 'download/', true);
    xhttp.setRequestHeader('X-CSRFToken', csrftoken);
    xhttp.responseType = 'blob';
    xhttp.send();
    
}