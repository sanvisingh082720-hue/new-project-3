const subjects=["Mathematics","Physics","Chemistry","English","Computer Science"];
const grid=document.getElementById("marksGrid");
subjects.forEach((s,i)=>grid.insertAdjacentHTML("beforeend",`<label class="mark-input"><span>${i+1}</span>${s}<input class="mark" data-subject="${s}" type="number" min="0" max="100" placeholder="0"></label>`));

const $=id=>document.getElementById(id);
let current=null;

function grade(p){
  if(p>=90)return["A+","Outstanding"];
  if(p>=80)return["A","Excellent"];
  if(p>=70)return["B+","Very Good"];
  if(p>=60)return["B","Good"];
  if(p>=50)return["C","Satisfactory"];
  if(p>=40)return["D","Needs Improvement"];
  return["F","Needs Improvement"];
}
function performance(m){return m>=90?"Outstanding":m>=80?"Excellent":m>=70?"Very Good":m>=60?"Good":m>=40?"Pass":"Fail"}

function generate(){
  const name=$("name").value.trim(),roll=$("roll").value.trim();
  if(!name||!roll){alert("Please enter student name and roll number.");return}
  const marks=[...document.querySelectorAll(".mark")].map(x=>Number(x.value));
  if(marks.some(x=>x<0||x>100||Number.isNaN(x))){alert("Enter valid marks from 0 to 100 for every subject.");return}
  const total=marks.reduce((a,b)=>a+b,0), pct=total/5, [g,perf]=grade(pct);
  current={name,roll,className:$("className").value||"Not specified",year:$("year").value,marks,total,pct,g,perf};
  $("emptyState").classList.add("hidden");$("resultContent").classList.remove("hidden");
  $("resultName").textContent=name;$("resultMeta").textContent=`Roll ${roll} • ${current.className} • ${current.year}`;
  $("gradeBadge").textContent=g;$("total").textContent=`${total} / 500`;$("percentage").textContent=`${pct.toFixed(2)}%`;
  $("average").textContent=pct.toFixed(2);$("resultStatus").textContent=marks.some(m=>m<33)?"FAIL":"PASS";
  $("progress").style.width=`${Math.max(0,Math.min(100,pct))}%`;$("performanceText").textContent=perf;
  $("resultTable").innerHTML=subjects.map((s,i)=>`<tr><td>${s}</td><td><b>${marks[i]}</b>/100</td><td><span class="pill">${performance(marks[i])}</span></td></tr>`).join("");
  const hi=Math.max(...marks),lo=Math.min(...marks);
  $("bestSubject").textContent=`${subjects[marks.indexOf(hi)]} (${hi})`;
  $("lowestSubject").textContent=`${subjects[marks.indexOf(lo)]} (${lo})`;
  $("remark").textContent=marks.some(m=>m<33)?"Some subjects need improvement. Review the weak areas and try again.":pct>=80?"Excellent work! Keep maintaining this performance.":pct>=60?"Good result! A little more practice can take you higher.":"Keep practicing consistently and focus on your weaker subjects.";
}
function clearForm(){
  document.querySelectorAll("input").forEach(x=>{if(x.type==="number"||x.type==="text")x.value=""});
  $("className").value="";$("emptyState").classList.remove("hidden");$("resultContent").classList.add("hidden");current=null;
}
function loadDemo(){
  $("name").value="Aarav Sharma";$("roll").value="1024";$("className").value="BCA 2nd Semester";$("year").value="2026-27";
  [88,76,91,84,95].forEach((v,i)=>document.querySelectorAll(".mark")[i].value=v);generate();
}
function records(){return JSON.parse(localStorage.getItem("markpro_records")||"[]")}
function renderRecords(){
  const r=records();$("studentCount").textContent=r.length;
  $("recordsList").innerHTML=r.length?r.map((x,i)=>`<div class="record"><div><b>${x.name}</b><br><small>Roll ${x.roll} • ${x.pct.toFixed(2)}% • Grade ${x.g}</small></div><button class="delete-btn" onclick="removeRecord(${i})">Delete</button></div>`).join(""):`<div class="record-empty">No saved records yet.</div>`;
}
function saveRecord(){if(!current){alert("Generate a marksheet first.");return}const r=records();r.unshift(current);localStorage.setItem("markpro_records",JSON.stringify(r.slice(0,20)));renderRecords()}
function removeRecord(i){const r=records();r.splice(i,1);localStorage.setItem("markpro_records",JSON.stringify(r));renderRecords()}
$("generateBtn").onclick=generate;$("clearBtn").onclick=clearForm;$("demoBtn").onclick=loadDemo;$("saveBtn").onclick=saveRecord;$("printBtn").onclick=()=>window.print();
$("copyBtn").onclick=()=>{if(!current)return; navigator.clipboard?.writeText(`${current.name} | Roll ${current.roll} | Total ${current.total}/500 | ${current.pct.toFixed(2)}% | Grade ${current.g} | ${current.result}`);alert("Summary copied.");};
$("clearRecords").onclick=()=>{if(confirm("Delete all saved records?")){localStorage.removeItem("markpro_records");renderRecords()}};
$("themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("markpro_dark",document.body.classList.contains("dark"))};
if(localStorage.getItem("markpro_dark")==="true")document.body.classList.add("dark");
renderRecords();
