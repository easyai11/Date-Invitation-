let selectedFoods = [];
let answers = {
  answer: "YES",
  food: "",
  date: "",
  time: "",
  message: "",
  submittedAt: ""
};

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzgAYA9yeVHQYBp9gqL91lwSW49N9w6YY7bfMb4x3jodMoEMeSO0RtxQ7qGYpYxp2o9/exec";

function show(n){
  document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
  document.getElementById("s"+n).classList.add("active");
  window.scrollTo(0,0);
}

function yes(){ answers.answer="YES"; show(2); }

function nope(){
  const b=document.getElementById("no");
  const yesBtn=document.querySelector("#s1 .pink");
  b.style.position="fixed";
  b.style.left=Math.max(8,Math.random()*78)+"%";
  b.style.top=Math.max(12,Math.random()*75)+"%";
  const current=parseFloat(yesBtn.dataset.scale || "1");
  const next=Math.min(current*1.22,2.8);
  yesBtn.dataset.scale=next;
  yesBtn.style.transform=`scale(${next})`;
}

function toggleChoice(button,value){
  const i=selectedFoods.indexOf(value);
  if(i>=0){
    selectedFoods.splice(i,1);
    button.classList.remove("selected");
  }else{
    selectedFoods.push(value);
    button.classList.add("selected");
  }
  document.getElementById("selectedText").textContent =
    selectedFoods.length ? "Selected: " + selectedFoods.join(", ") : "Nothing selected yet";
}

function continueFromFood(){
  if(!selectedFoods.length){
    document.getElementById("selectedText").textContent="Please select at least one option 💗";
    return;
  }
  answers.food=selectedFoods.join(", ");
  show(4);
}

function finish(){
  const d=document.getElementById("date").value;
  const t=document.getElementById("time").value;
  if(!d || !t){
    alert("Please choose both a date and a time.");
    return;
  }

  answers.date=d;
  answers.time=t;
  answers.submittedAt=new Date().toISOString();

  const displayDate=new Date(d+"T12:00:00").toLocaleDateString("en-US",{
    weekday:"long",year:"numeric",month:"long",day:"numeric"
  });
  const [hh,mm]=t.split(":").map(Number);
  const suffix=hh>=12 ? "PM" : "AM";
  const hour12=(hh%12)||12;
  const displayTime=hour12+":"+String(mm).padStart(2,"0")+" "+suffix;

  document.getElementById("out").innerHTML =
    "💗 " + escapeHtml(answers.food) +
    "<br>📅 " + displayDate +
    "<br>🕐 " + displayTime;

  sendToSheet();
  show(5);
  setTimeout(playBlast, 120);
}

function submitMessage(){
  const box=document.getElementById("herMessage");
  const message=(box.value||"").trim();
  if(!message){
    box.focus();
    return;
  }
  answers.message=message;
  answers.submittedAt=new Date().toISOString();
  sendToSheet();
  box.value="";
  document.getElementById("count").textContent="0";
  showMessageThanks();
}

function showMessageThanks(){
  const card=document.getElementById("s7");
  card.querySelector("h1").textContent="Thank you for the message! 💗";
  card.querySelector("p").innerHTML="I'll keep your words close. <br>Can't wait to see you soon! ✨";
  card.querySelector("textarea").style.display="none";
  card.querySelector(".charcount").style.display="none";
  card.querySelector("button").textContent="Start again ↻";
  card.querySelector("button").onclick=()=>location.reload();
}

document.addEventListener("DOMContentLoaded",()=>{
  const box=document.getElementById("herMessage");
  if(box) box.addEventListener("input",()=>{
    document.getElementById("count").textContent=box.value.length;
  });
});

function sendToSheet(){
  if(!GOOGLE_SCRIPT_URL) return;
  fetch(GOOGLE_SCRIPT_URL,{
    method:"POST",
    mode:"no-cors",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify(answers)
  }).catch(()=>{});
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

function playBlast(){
  const b=document.getElementById("blast");
  if(!b)return;
  b.innerHTML=["💗","✨","💖","⭐","🌸","💕","🧸","🐱","💫","♡","🐾","🎀"].map(x=>`<i>${x}</i>`).join("");
  b.classList.add("active");
  setTimeout(()=>b.classList.remove("active"),1900);
}
