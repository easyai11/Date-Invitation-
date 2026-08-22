let plan={food:'',date:'',time:''};

// All displayed date/time text is intentionally formatted in English (en-US).


// Paste your Google Apps Script Web App URL between the quotes below.
const GOOGLE_SCRIPT_URL='https://script.google.com/macros/s/AKfycbzgAYA9yeVHQYBp9gqL91lwSW49N9w6YY7bfMb4x3jodMoEMeSO0RtxQ7qGYpYxp2o9/exec';

function show(n){document.querySelectorAll('.card').forEach(x=>x.classList.remove('active'));document.getElementById('s'+n).classList.add('active')}
function yes(){show(3)}
function nope(){const b=document.getElementById('no');b.style.position='fixed';b.style.left=Math.random()*70+10+'%';b.style.top=Math.random()*70+10+'%'}
function pick(v){plan.food=v;show(4)}

function finish(){
  plan.date=document.getElementById('date').value;
  plan.time=document.getElementById('time').value;
  if(!plan.date||!plan.time){alert('Please choose a date and time 💗');return}

  const dateText = new Date(plan.date + 'T00:00:00').toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric', year:'numeric'});
  const [hh, mm] = plan.time.split(':').map(Number);
  const timeText = new Date(2000,0,1,hh,mm).toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit'});
  document.getElementById('out').innerHTML=`${plan.food}<br>📅 Date: ${dateText}<br>🕐 Time: ${timeText}`;
  sendToGoogleSheet();
  show(5);
  setTimeout(() => show(6), 2500);
}

function sendToGoogleSheet(){
  if(!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.startsWith('PASTE_')) return;

  const data={
    answer:'YES',
    food:plan.food,
    date:plan.date,
    time:plan.time,
    submittedAt:new Date().toISOString()
  };

  fetch(GOOGLE_SCRIPT_URL,{
    method:'POST',
    mode:'no-cors',
    headers:{'Content-Type':'text/plain;charset=utf-8'},
    body:JSON.stringify(data)
  }).catch(()=>{});
}
