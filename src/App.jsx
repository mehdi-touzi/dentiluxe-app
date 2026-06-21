import { useState, useMemo, useEffect, useRef } from "react";
import { cloudEnabled, cloudLoad, cloudSave } from "./cloud";
const CR=0.20,U2M=10;
const SC={confirmed:{label:"Confirme",emoji:"OK",color:"#00C896"},pending:{label:"En attente",emoji:"...",color:"#F5A623"},cancelled:{label:"Annule",emoji:"X",color:"#FF4D6D"}};
const SRCO=["Instagram","WhatsApp","Bouche-a-oreille","Autre"];
const TRTO=["Facettes composites","Facettes zircon","Enlevement facettes","Blanchiment","Detartrage","Autre"];
const IF0={name:"",teeth:"",price:"",date:"",time:"",phone:"",source:"Instagram",status:"pending",treatment:"Facettes composites",notes:"",returnPatient:false};
const PF0={label:"",dateFrom:"",dateTo:"",dailyBudget:"5",currency:"USD",platform:"Instagram Ads",notes:""};
function pamad(p){const d=p.dateFrom&&p.dateTo?Math.max(1,Math.round((new Date(p.dateTo)-new Date(p.dateFrom))/86400000)+1):1;return p.currency==="USD"?Math.round((p.dailyBudget||0)*d*U2M):Math.round((p.dailyBudget||0)*d);}
function pdays(p){if(!p.dateFrom||!p.dateTo)return 0;return Math.max(1,Math.round((new Date(p.dateTo)-new Date(p.dateFrom))/86400000)+1);}
function load(k,d){try{const s=localStorage.getItem(k);return s?JSON.parse(s):d;}catch{return d;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}
function fmtMAD(n){return Number(n).toLocaleString("fr-MA")+" DH";}
function fmtDate(d){if(!d)return"";return new Date(d).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"});}
function mlabel(k){const[y,m]=k.split("-");return new Date(y,m-1).toLocaleDateString("fr-FR",{month:"long",year:"numeric"});}
function today(){return new Date().toISOString().slice(0,10);}
function isToday(d){return d===today();}
function ddiff(d){return Math.floor((Date.now()-new Date(d))/86400000);}
function waLink(phone,name,date,time){const n=phone.replace(/[^0-9]/g,"");return"https://wa.me/"+n+"?text="+encodeURIComponent("Bonjour "+name+" - Denti Luxe - RDV du "+fmtDate(date)+(time?" a "+time:"")+". Merci");}
const DR=[
  {id:1780070095163,name:"Chouaib",teeth:16,price:1500,date:"2026-05-28",time:"17:30",phone:"+212 714-440124",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780070249991,name:"Mouna",teeth:16,price:2000,date:"2026-05-29",time:"16:30",phone:"+212 653-814391",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780070327501,name:"Jsp",teeth:10,price:1500,date:"2026-05-30",time:"15:00",phone:"+212 646-953092",source:"WhatsApp",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780070366362,name:"Ayoub",teeth:20,price:2500,date:"2026-06-02",time:"15:00",phone:"+212 655-290181",source:"Instagram",status:"cancelled",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780084377762,name:"Azen",teeth:16,price:2000,date:"2026-05-30",time:"16:00",phone:"+212 662-140988",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780152612551,name:"Hamza",teeth:16,price:2000,date:"2026-05-30",time:"18:30",phone:"+212 661-991893",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780309862483,name:"Anis",teeth:16,price:2000,date:"2026-05-31",time:"21:30",phone:"+212 666-075959",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780311246329,name:"Youssef",teeth:20,price:2500,date:"2026-06-03",time:"15:00",phone:"+212 617-413866",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780424737184,name:"Asmae",teeth:16,price:2000,date:"2026-06-02",time:"18:30",phone:"+212 661-178747",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780424814605,name:"Issam",teeth:6,price:1000,date:"2026-06-03",time:"16:00",phone:"+212 689-374579",source:"Instagram",status:"cancelled",treatment:"Facettes composites",notes:"Retour 6 facettes",returnPatient:false},
  {id:1780484673154,name:"Walid",teeth:20,price:3000,date:"2026-06-04",time:"17:00",phone:"+212 661-696779",source:"Instagram",status:"cancelled",treatment:"Facettes composites",notes:"Enlever les bagues + faire des facettes",returnPatient:false},
  {id:1780484756041,name:"Azen commando",teeth:0,price:300,date:"2026-06-03",time:"18:00",phone:"+212 662-140988",source:"Instagram",status:"confirmed",treatment:"Blanchiment",notes:"",returnPatient:true},
  {id:1780512841092,name:"Boutaina",teeth:1,price:200,date:"2026-06-03",time:"19:30",phone:"+212 778-338139",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780512890548,name:"Imad",teeth:20,price:2500,date:"2026-06-03",time:"23:30",phone:"+212 641-901561",source:"Instagram",status:"cancelled",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780526218434,name:"Ayoub",teeth:20,price:2500,date:"2026-06-03",time:"23:00",phone:"+212 670-880043",source:"WhatsApp",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780632515297,name:"Mouna 2",teeth:16,price:2500,date:"2026-06-06",time:"17:00",phone:"+212 662-740096",source:"Instagram",status:"cancelled",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780678831897,name:"Mom of lyna",teeth:20,price:3000,date:"2026-06-06",time:"15:00",phone:"+212 631-397633",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780678937748,name:"Zaidan",teeth:20,price:3200,date:"2026-06-07",time:"16:00",phone:"0764543582",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780848150704,name:"Seyf",teeth:2,price:300,date:"2026-06-08",time:"19:00",phone:"+212 661-191805",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780848177938,name:"Sanae",teeth:20,price:2500,date:"2026-06-08",time:"19:00",phone:"+212 661-191805",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780848584175,name:"Malak",teeth:20,price:2500,date:"2026-06-08",time:"17:00",phone:"0661378692",source:"Instagram",status:"cancelled",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1780934239569,name:"Nezita",teeth:10,price:1250,date:"2026-06-10",time:"14:00",phone:"+212 661-771564",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1781115108564,name:"Youssef 2",teeth:20,price:2300,date:"2026-06-10",time:"20:00",phone:"+212 781-987337",source:"WhatsApp",status:"cancelled",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1781115752251,name:"Sata",teeth:1,price:200,date:"2026-06-10",time:"",phone:"+212 693-012069",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1781635103795,name:"Fermlia",teeth:20,price:3500,date:"2026-06-16",time:"17:00",phone:"+212 661-171581",source:"Instagram",status:"confirmed",treatment:"Facettes composites",notes:"",returnPatient:false},
  {id:1781635270108,name:"Ilyes",teeth:20,price:2500,date:"2026-06-16",time:"20:00",phone:"+212 694-419964",source:"Instagram",status:"pending",treatment:"Facettes composites",notes:"",returnPatient:false},
];
const DP=[
  {id:10,label:"Boost Facettes",dateFrom:"2026-05-27",dateTo:"2026-06-02",dailyBudget:4,currency:"USD",platform:"Instagram Ads",notes:""},
  {id:1780948413407,label:"Instaboost",dateFrom:"2026-06-04",dateTo:"2026-06-10",dailyBudget:5,currency:"USD",platform:"Instagram Ads",notes:""},
];
const DG=10000;

function Donut({segs,size=100}){const tot=segs.reduce((s,x)=>s+x.value,0);if(!tot)return <div style={{width:size,height:size,borderRadius:"50%",background:"#142038"}}/>;let off=0;const r=40,cx=50,cy=50,ci=2*Math.PI*r;return <svg width={size} height={size} viewBox="0 0 100 100"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#142038" strokeWidth={16}/>{segs.map((s,i)=>{const p=s.value/tot,d=p*ci,ro=off*360-90;off+=p;return<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={16} strokeDasharray={`${d} ${ci-d}`} transform={`rotate(${ro} ${cx} ${cy})`}/>;})}<text x={cx} y={cy} textAnchor="middle" dy="0.35em" fill="#EEE8D8" fontSize={12} fontWeight={700}>{tot}</text></svg>;}

const IP={
  home:'M3 9.5L12 3l9 6.5M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9',
  cal:'M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM3 9h18M8 3v3M16 3v3',
  money:'M12 2v20M16.5 6.5H9.75a3.25 3.25 0 0 0 0 6.5h4.5a3.25 3.25 0 0 1 0 6.5H7',
  mega:'M3 10v4a1 1 0 0 0 1 1h2.5L12 19V5L6.5 9H4a1 1 0 0 0-1 1zM16 9a4 4 0 0 1 0 6',
  bars:'M5 21V11M12 21V4M19 21v-7',
  trend:'M3 17l6-6 4 4 8-8M15 7h6v6',
  bell:'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M10.3 21a2 2 0 0 0 3.4 0',
  phone:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7A2 2 0 0 1 22 16.9z',
  wa:'M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z',
  search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  edit:'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z',
  trash:'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6',
  copy:'M9 9h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
  swap:'M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15',
  tooth:'M7 3C4.8 3 3.5 4.8 3.7 7.4c.3 3.4 1 5 1.6 8.6.3 1.7.6 4 1.7 4 .9 0 1-1.7 1.3-3.4.3-1.6.5-2.6 1.7-2.6s1.4 1 1.7 2.6c.3 1.7.4 3.4 1.3 3.4 1.1 0 1.4-2.3 1.7-4 .6-3.6 1.3-5.2 1.6-8.6C20.5 4.8 19.2 3 17 3c-1.8 0-2.8 1-5 1S8.8 3 7 3z',
  clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  note:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h6',
  award:'M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.2 13.9L7 23l5-3 5 3-1.2-9.1',
  bulb:'M9 18h6M10 22h4M15.1 14c.2-1 .7-1.8 1.4-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.2 1.5 1.4 2.5',
  zap:'M13 2L3 14h9l-1 8 10-12h-9z',
  target:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  rocket:'M5 13l-2 5 5-2M9 11a13 13 0 0 1 8-8 13 13 0 0 1-2 10l-3 2-5-5zM14 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0',
  plus:'M12 5v14M5 12h14',
  x:'M18 6L6 18M6 6l12 12',
  cl:'M15 18l-6-6 6-6',
  cr:'M9 18l6-6-6-6',
  up:'M12 19V5M6 11l6-6 6 6',
  dn:'M12 5v14M6 13l6 6 6-6',
  check:'M20 6L9 17l-4-4',
  user:'M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  gift:'M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  cloud:'M17.5 19a4.5 4.5 0 1 0-.9-8.9A6 6 0 0 0 5.2 11 4 4 0 0 0 6 19z',
  cloudok:'M17.5 19a4.5 4.5 0 1 0-.9-8.9A6 6 0 0 0 5.2 11 4 4 0 0 0 6 19M9.5 14.5l2 2 3.5-3.5',
  cloudx:'M17.5 19a4.5 4.5 0 1 0-.9-8.9A6 6 0 0 0 5.2 11 4 4 0 0 0 6 19M10 13l4 4M14 13l-4 4',
};
function Ic({n,s=16,sw=1.9,fill="none",style}){const d=IP[n];if(!d)return null;return <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,...style}}><path d={d}/></svg>;}

const CSS=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700&display=swap');
:root{--nv:#090D14;--nv2:#10151E;--nv3:#171D28;--nb:#252D3B;--bh:#323C4D;--go:#CBAA6A;--gl:#E6D09A;--tx:#E9EBEF;--dm:#9097A5;--mt:#646D7D;--gn:#33BA86;--or:#E2A845;--rd:#E45A6E;--pu:#8C7BE0;}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
body{background:var(--nv);}
::-webkit-scrollbar{width:3px;height:3px;}::-webkit-scrollbar-thumb{background:var(--nb);border-radius:2px;}
input,select,textarea,button{outline:none;font-family:'DM Sans',sans-serif;}
.card{background:var(--nv2);border:1px solid var(--nb);border-radius:14px;padding:14px;margin-bottom:10px;position:relative;overflow:hidden;transition:border-color .2s;}
.card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;}
.card.confirmed::before{background:var(--gn);}
.card.pending::before{background:var(--or);}
.card.cancelled::before{background:var(--rd);opacity:0.4;}
.card.cancelled{opacity:0.5;}
.tb{flex:1;padding:11px 4px;background:none;border:none;color:var(--dm);font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;transition:color .15s;letter-spacing:.2px;}
.tb.on{color:var(--go);border-bottom-color:var(--go);}
.inp{width:100%;background:var(--nv3);border:1px solid var(--nb);border-radius:11px;padding:12px 15px;color:var(--tx);font-family:'DM Sans',sans-serif;font-size:14px;transition:border-color .15s,box-shadow .15s;}
.inp:focus{border-color:var(--go);box-shadow:0 0 0 3px rgba(203,170,106,0.12);}
.inp::placeholder{color:var(--mt);}
.btn{background:linear-gradient(180deg,var(--gl),var(--go));color:#16110A;border:none;border-radius:12px;padding:14px;font-family:'DM Sans',sans-serif;font-weight:800;font-size:15px;cursor:pointer;width:100%;box-shadow:0 2px 10px rgba(203,170,106,0.22);letter-spacing:.2px;transition:transform .12s,box-shadow .12s;}
.btn:active{transform:translateY(1px);}
.btn2{background:var(--nv3);color:var(--tx);border:1px solid var(--nb);border-radius:12px;padding:14px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:15px;cursor:pointer;width:100%;transition:border-color .15s;}
.btn2:active{border-color:var(--bh);}
.fab{position:fixed;bottom:88px;right:18px;width:54px;height:54px;border-radius:16px;background:linear-gradient(180deg,var(--gl),var(--go));border:none;color:#16110A;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 22px rgba(203,170,106,0.4);z-index:50;transition:transform .12s;}
.fab:active{transform:scale(0.94);}
.ov{position:fixed;inset:0;background:rgba(4,7,12,0.78);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:100;display:flex;align-items:flex-end;animation:fade .2s ease;}
@keyframes fade{from{opacity:0;}to{opacity:1;}}
.sh{background:var(--nv2);border-radius:24px 24px 0 0;padding:22px 20px 44px;width:100%;max-height:93vh;overflow-y:auto;border-top:1px solid var(--nb);box-shadow:0 -10px 40px rgba(0,0,0,0.5);animation:rise .26s cubic-bezier(.2,.8,.2,1);}
@keyframes rise{from{transform:translateY(24px);}to{transform:translateY(0);}}
.ch{padding:6px 13px;border-radius:9px;border:1px solid var(--nb);background:none;color:var(--dm);font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .15s;}
.ch.on{background:rgba(203,170,106,0.1);color:var(--go);border-color:rgba(203,170,106,0.4);}
.ab{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:var(--nv3);border:1px solid var(--nb);border-radius:9px;cursor:pointer;color:var(--dm);transition:all .15s;}
.ab:active{border-color:var(--bh);color:var(--tx);}
.bn{position:fixed;bottom:0;left:0;right:0;background:rgba(9,13,20,0.92);border-top:1px solid var(--nb);display:flex;z-index:40;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);padding-bottom:env(safe-area-inset-bottom);}
.pb{height:5px;background:var(--nv3);border-radius:3px;overflow:hidden;}
.pbf{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--go),var(--gl));transition:width 0.7s;}
.gg{background:linear-gradient(95deg,var(--go),var(--gl));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
.bdg{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:7px;font-size:10px;font-weight:800;letter-spacing:.3px;}
.hero{background:linear-gradient(155deg,#161D2A 0%,#0E131C 60%);border:1px solid var(--nb);border-radius:18px;padding:20px;position:relative;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.35);}
.hero::after{content:'';position:absolute;top:-60px;right:-40px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(203,170,106,0.14),transparent 70%);pointer-events:none;}
.sl{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;background:var(--nv3);outline:none;}
.sl::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--gl),var(--go));cursor:pointer;box-shadow:0 2px 8px rgba(203,170,106,0.4);}
.tp{animation:tpa 2.4s infinite;}
@keyframes tpa{0%,100%{border-color:rgba(226,168,69,0.28);}50%{border-color:rgba(226,168,69,0.6);}}
.sec{font-size:10px;font-weight:700;color:var(--mt);letter-spacing:1.6px;text-transform:uppercase;margin-bottom:10px;}
.hd{position:sticky;top:0;z-index:30;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}
svg{display:block;}`;

export default function App(){
  const[rdvs,setRR]=useState(()=>load("dl_rdvs",DR));
  const[pubs,setPR]=useState(()=>load("dl_pubs",DP));
  const[goal,setGR]=useState(()=>load("dl_goal",DG));
  const[form,setF]=useState(IF0);
  const[pf,setPf]=useState(PF0);
  const[eid,setEid]=useState(null);
  const[epid,setEpid]=useState(null);
  const[sf,setSf]=useState(false);
  const[spf,setSpf]=useState(false);
  const[sgm,setSgm]=useState(false);
  const[gi,setGi]=useState("");
  const[tab,setTab]=useState("home");
  const[fst,setFst]=useState("all");
  const[q,setQ]=useState("");
  const[srt,setSrt]=useState("date");
  const[cdd,setCdd]=useState(null);
  const[cpd,setCpd]=useState(null);
  const[bk,setBk]=useState(false);
  const[it,setIt]=useState("");
  const[im,setIm]=useState("");
  const[cal,setCal]=useState(new Date());
  const[sel,setSel]=useState(null);
  const[scen,setScen]=useState(5);
  const[banner,setBanner]=useState(true);
  const[sync,setSync]=useState(cloudEnabled?"sync":"off");
  const didInit=useRef(false);
  function pushCloud(next){if(!cloudEnabled)return;setSync("sync");cloudSave(next).then(()=>setSync("ok")).catch(()=>setSync("err"));}
  function sr(v){const u=typeof v==="function"?v(rdvs):v;setRR(u);save("dl_rdvs",u);pushCloud({rdvs:u,pubs,goal});}
  function sp(v){const u=typeof v==="function"?v(pubs):v;setPR(u);save("dl_pubs",u);pushCloud({rdvs,pubs:u,goal});}
  function sg(v){setGR(v);save("dl_goal",v);pushCloud({rdvs,pubs,goal:v});}
  useEffect(()=>{
    if(!cloudEnabled||didInit.current)return;
    didInit.current=true;
    (async()=>{
      try{
        const remote=await cloudLoad();
        if(remote&&Array.isArray(remote.rdvs)){
          setRR(remote.rdvs);save("dl_rdvs",remote.rdvs);
          if(Array.isArray(remote.pubs)){setPR(remote.pubs);save("dl_pubs",remote.pubs);}
          if(remote.goal!=null){setGR(remote.goal);save("dl_goal",remote.goal);}
        }else{
          await cloudSave({rdvs,pubs,goal});
        }
        setSync("ok");
      }catch{setSync("err");}
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  function xp(){setIt(JSON.stringify({rdvs,pubs,goal,exportedAt:new Date().toISOString()},null,2));setIm("__x__");}
  function xr(){try{const p=JSON.parse(it);if(!p.rdvs||!p.pubs){setIm("Invalide");return;}sr(p.rdvs);sp(p.pubs);if(p.goal)sg(p.goal);setIm("OK");setIt("");setTimeout(()=>{setBk(false);setIm("");},1500);}catch{setIm("JSON invalide");}}
  const S=useMemo(()=>{
    const cf=rdvs.filter(r=>r.status==="confirmed");
    const pe=rdvs.filter(r=>r.status==="pending");
    const ca=rdvs.filter(r=>r.status==="cancelled");
    const tca=cf.reduce((s,r)=>s+r.price,0);
    const tc=tca*CR;
    const tp=pubs.reduce((s,p)=>s+pamad(p),0);
    const roi=tc-tp;
    const rp=tp?Math.round((roi/tp)*100):null;
    const cpl=cf.length?Math.round(tp/cf.length):0;
    const cvr=rdvs.length?Math.round((cf.length/rdvs.length)*100):0;
    const pca=pe.reduce((s,r)=>s+r.price,0);
    const cca=ca.reduce((s,r)=>s+r.price,0);
    const ac=cf.length?tc/cf.length:336;
    const bm={};
    cf.forEach(r=>{const k=r.date.slice(0,7);if(!bm[k])bm[k]={ca:0,comm:0,cnt:0,pub:0};bm[k].ca+=r.price;bm[k].comm+=r.price*CR;bm[k].cnt++;});
    pubs.forEach(p=>{const k=(p.dateFrom||"").slice(0,7);if(!k)return;if(!bm[k])bm[k]={ca:0,comm:0,cnt:0,pub:0};bm[k].pub+=pamad(p);});
    const bs={},bsc={};
    cf.forEach(r=>{bs[r.source]=(bs[r.source]||0)+1;bsc[r.source]=(bsc[r.source]||0)+r.price*CR;});
    const bt={};
    cf.forEach(r=>{const t=r.treatment||"Autre";if(!bt[t])bt[t]={cnt:0,ca:0};bt[t].cnt++;bt[t].ca+=r.price;});
    const cm=today().slice(0,7);
    const dim=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
    const dom=new Date().getDate();
    const mc=(bm[cm]||{comm:0}).comm;
    const proj=dom>0?Math.round((mc/dom)*dim):0;
    const trd=rdvs.filter(r=>r.status!=="cancelled"&&isToday(r.date));
    const rel=rdvs.filter(r=>r.status==="pending"&&ddiff(r.date)>=2);
    const stl=rdvs.filter(r=>r.status==="pending"&&ddiff(r.date)>=3);
    const gp=goal?Math.min(Math.round((tc/goal)*100),100):0;
    const gr=Math.max(goal-tc,0);
    const pr=cpl>0?1/cpl:9/280;
    return{tca,tc,tp,roi,rp,cpl,cvr,conf:cf.length,pend:pe.length,canc:ca.length,pca,cca,ac,bm,bs,bsc,bt,proj,trd,rel,stl,gp,gr,pr};
  },[rdvs,pubs,goal]);
  const ac2=S.trd.length+S.stl.length;
  const fr=useMemo(()=>rdvs.filter(r=>fst==="all"||r.status===fst).filter(r=>r.name.toLowerCase().includes(q.toLowerCase())||r.phone.includes(q)).sort((a,b)=>srt==="date"?new Date(b.date)-new Date(a.date):srt==="price"?b.price-a.price:a.name.localeCompare(b.name)),[rdvs,fst,q,srt]);
  const mk=Object.keys(S.bm).sort().reverse();
  function hs(){if(!form.name||!form.price||!form.date)return;if(eid){sr(rdvs.map(r=>r.id===eid?{...form,id:eid,price:+form.price,teeth:+form.teeth}:r));setEid(null);}else{sr([...rdvs,{...form,id:Date.now(),price:+form.price,teeth:+form.teeth}]);}setF(IF0);setSf(false);}
  function he(r){setF({...r,price:String(r.price),teeth:String(r.teeth)});setEid(r.id);setSf(true);setTab("rdv");}
  function hd(id){sr(rdvs.filter(r=>r.id!==id));setCdd(null);}
  function hdup(r){sr([...rdvs,{...r,id:Date.now(),date:today(),status:"pending",time:""}]);}
  function hst(id){sr(rdvs.map(r=>{if(r.id!==id)return r;const n={pending:"confirmed",confirmed:"cancelled",cancelled:"pending"};return{...r,status:n[r.status]};}));}
  function hps(){const lb=(pf.label||"").trim();const db=parseFloat(pf.dailyBudget);if(!lb||!pf.dateFrom||!pf.dateTo||!(db>0))return;const ent={label:lb,dateFrom:pf.dateFrom,dateTo:pf.dateTo,dailyBudget:db,currency:pf.currency,platform:pf.platform,notes:pf.notes||""};if(epid){sp(pubs.map(p=>p.id===epid?{...ent,id:epid}:p));setEpid(null);}else{sp([...pubs,{...ent,id:Date.now()}]);}setPf(PF0);setSpf(false);}
  function hpe(p){setPf({...p,dailyBudget:String(p.dailyBudget)});setEpid(p.id);setSpf(true);}
  function hpd(id){sp(pubs.filter(p=>p.id!==id));setCpd(null);}
  const sc=useMemo(()=>{const pm=scen*7*U2M;const pp=pm*(S.pr||9/280);const og=2/8*7;const tot=pp+og;const cm=tot*S.ac;return{pm,pu:scen*7,pat:Math.round(tot),cm:Math.round(cm),roi:Math.round(cm-pm)};},[scen,S]);
  const scols={Instagram:"#E1306C",WhatsApp:"#25D366","Bouche-a-oreille":"#C9A84C",Autre:"#7B5EA7"};
  const ss=useMemo(()=>Object.entries(S.bs).map(([s,c])=>({label:s,value:c,color:scols[s]||"#888"})),[S.bs]);

  // Semaine helpers
  function gwb(off){const n=new Date();const d=n.getDay();const df=(d===0)?-6:1-d;const mo=new Date(n);mo.setDate(n.getDate()+df+off*7);mo.setHours(0,0,0,0);const su=new Date(mo);su.setDate(mo.getDate()+6);su.setHours(23,59,59,999);return{s:mo,e:su};}
  function wst(b){const ir=rdvs.filter(r=>{if(!r.date)return false;const d=new Date(r.date);return d>=b.s&&d<=b.e;});const cf=ir.filter(r=>r.status==="confirmed");const ca=cf.reduce((s,r)=>s+r.price,0);const cm=ca*CR;const bd={};cf.forEach(r=>{const d=new Date(r.date).toLocaleDateString("fr-FR",{weekday:"short"});if(!bd[d])bd[d]={cm:0,cnt:0};bd[d].cm+=r.price*CR;bd[d].cnt++;});return{tot:ir.length,cf:cf.length,pe:ir.filter(r=>r.status==="pending").length,ca:ir.filter(r=>r.status==="cancelled").length,tca:ca,cm,bd,rdvs:ir};}
  function fmtB(b){const o={day:"2-digit",month:"short"};return b.s.toLocaleDateString("fr-FR",o)+" - "+b.e.toLocaleDateString("fr-FR",o);}
  function dlt(a,b){if(!b)return null;return Math.round(((a-b)/Math.max(b,1))*100);}

  return(
    <div style={{minHeight:"100vh",background:"var(--nv)",fontFamily:"'DM Sans',sans-serif",color:"var(--tx)",paddingBottom:80}}>
      <style>{CSS}</style>

      {/* HEADER */}
      <div className="hd" style={{padding:"52px 18px 14px",background:"linear-gradient(180deg,rgba(13,27,48,0.98),var(--nv))",borderBottom:"1px solid var(--nb)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:13,background:"linear-gradient(155deg,#1B2230,#0E131C)",border:"1px solid rgba(203,170,106,0.35)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--go)",boxShadow:"0 4px 14px rgba(0,0,0,0.4)"}}><Ic n="tooth" s={24} sw={1.7}/></div>
            <div>
              <div className="gg" style={{fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:700,lineHeight:1,letterSpacing:.3}}>Denti Luxe</div>
              <div style={{fontSize:9,color:"var(--mt)",letterSpacing:2,textTransform:"uppercase",marginTop:4}}>RDV & Commissions</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {sync!=="off"&&<span title={sync==="ok"?"Synchronisé dans le cloud":sync==="sync"?"Synchronisation…":"Hors-ligne (sauvegarde locale)"} style={{display:"inline-flex",alignItems:"center",color:sync==="ok"?"var(--gn)":sync==="err"?"var(--rd)":"var(--go)",opacity:sync==="sync"?0.6:1,transition:"opacity .3s"}}><Ic n={sync==="ok"?"cloudok":sync==="err"?"cloudx":"cloud"} s={18} sw={1.8}/></span>}
            {ac2>0&&<button onClick={()=>setTab("alertes")} style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(228,90,110,0.12)",border:"1px solid rgba(228,90,110,0.3)",borderRadius:10,padding:"6px 11px",color:"var(--rd)",fontSize:12,fontWeight:800,cursor:"pointer"}}><Ic n="bell" s={13}/> {ac2}</button>}
            <button onClick={()=>setBk(true)} style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(203,170,106,0.08)",border:"1px solid rgba(203,170,106,0.25)",borderRadius:10,padding:"6px 11px",color:"var(--go)",fontSize:11,fontWeight:700,cursor:"pointer"}}><Ic n="shield" s={13}/> Backup</button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{display:"flex",borderBottom:"1px solid var(--nb)",background:"rgba(8,15,30,0.96)",overflowX:"auto",scrollbarWidth:"none"}}>
        {[["home","Accueil"],["rdv","RDV"],["gains","Gains"],["pub","Pub"],["analyse","Analyse"],["semaine","Semaine"],["cal","Cal."],["alertes","Alertes"]].map(([t,l])=>(
          <button key={t} className={"tb"+(tab===t?" on":"")} onClick={()=>setTab(t)} style={{position:"relative",minWidth:58}}>
            {l}{t==="alertes"&&ac2>0&&<span style={{position:"absolute",top:8,right:4,width:6,height:6,borderRadius:"50%",background:"var(--rd)"}}/>}
          </button>
        ))}
      </div>

      {/* HOME */}
      {tab==="home"&&(
        <div style={{padding:"14px"}}>
          {S.trd.length>0&&banner&&(
            <div className="tp" style={{background:"rgba(245,166,35,0.08)",border:"1px solid rgba(245,166,35,0.3)",borderRadius:16,padding:14,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontWeight:800,fontSize:14,color:"var(--or)"}}>RDV aujourd'hui — {S.trd.length} patient{S.trd.length>1?"s":""}</div>
                <button onClick={()=>setBanner(false)} style={{display:"inline-flex",background:"none",border:"none",color:"var(--mt)",cursor:"pointer",padding:2}}><Ic n="x" s={16} sw={2.2}/></button>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {S.trd.map(r=>(
                  <div key={r.id} style={{flex:"1 1 140px",background:"rgba(245,166,35,0.06)",border:"1px solid rgba(245,166,35,0.2)",borderRadius:12,padding:"10px 12px"}}>
                    <div style={{fontWeight:700,fontSize:13}}>{r.name}</div>
                    <div style={{fontSize:11,color:"var(--dm)",marginTop:2}}>{r.time||"--"} {r.price} DH</div>
                    <div style={{display:"flex",gap:5,marginTop:8}}>
                      <a href={"tel:"+r.phone} style={{flex:1,textAlign:"center",padding:"5px",background:"rgba(201,168,76,0.1)",borderRadius:8,color:"var(--go)",fontSize:11,textDecoration:"none",fontWeight:600}}>Tel</a>
                      <a href={waLink(r.phone,r.name,r.date,r.time)} target="_blank" rel="noreferrer" style={{flex:1,textAlign:"center",padding:"5px",background:"rgba(37,211,102,0.08)",borderRadius:8,color:"#25D366",fontSize:11,textDecoration:"none",fontWeight:600}}>WA</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="hero" style={{marginBottom:12}}>
            <div style={{fontSize:10,color:"rgba(201,168,76,0.5)",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Commission totale</div>
            <div className="gg" style={{fontSize:40,fontWeight:900,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{fmtMAD(S.tc)}</div>
            <div style={{fontSize:12,color:"var(--dm)",marginTop:6}}>sur {fmtMAD(S.tca)} de CA</div>
            <div style={{height:1,background:"rgba(201,168,76,0.12)",margin:"12px 0"}}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
              {[["Patients",S.conf,"var(--gn)"],["Conv.",S.cvr+"%",S.cvr>=70?"var(--gn)":"var(--or)"],["Moy.",fmtMAD(Math.round(S.tca/(S.conf||1))).replace(" DH","")+"DH","var(--go)"],["ROI",S.roi>=0?"+"+Math.round(S.rp||0)+"%":"--",S.roi>=0?"var(--gn)":"var(--rd)"]].map(([l,v,c])=>(
                <div key={l} style={{textAlign:"center",background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"7px 3px"}}>
                  <div style={{fontSize:14,fontWeight:900,color:c}}>{v}</div>
                  <div style={{fontSize:9,color:"var(--mt)",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:"var(--nv2)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:16,padding:15,marginBottom:12,cursor:"pointer"}} onClick={()=>{setGi(String(goal));setSgm(true);}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontSize:13,fontWeight:700}}>Objectif mensuel</div>
              <div style={{fontSize:18,fontWeight:900,color:S.gp>=100?"var(--gn)":"var(--go)"}}>{S.gp}%</div>
            </div>
            <div className="pb" style={{height:8,marginBottom:8}}><div className="pbf" style={{width:S.gp+"%"}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
              <span style={{color:"var(--gn)",fontWeight:700}}>{fmtMAD(Math.round(S.tc))}</span>
              <span style={{color:"var(--mt)"}}>sur {fmtMAD(goal)}</span>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[
              {l:"Confirmes",v:S.conf,s:fmtMAD(S.tc),c:"var(--gn)",bg:"rgba(0,200,150,0.08)",bc:"rgba(0,200,150,0.2)"},
              {l:"En attente",v:S.pend,s:fmtMAD(S.pca)+" pot.",c:"var(--or)",bg:"rgba(245,166,35,0.08)",bc:"rgba(245,166,35,0.2)"},
              {l:"Projection mois",v:fmtMAD(S.proj),s:"au rythme actuel",c:"var(--go)",bg:"rgba(201,168,76,0.06)",bc:"rgba(201,168,76,0.15)"},
              {l:"ROI pub",v:(S.roi>=0?"+":"")+fmtMAD(S.roi),s:fmtMAD(S.tp)+" investi",c:S.roi>=0?"var(--gn)":"var(--rd)",bg:S.roi>=0?"rgba(0,200,150,0.06)":"rgba(255,77,109,0.06)",bc:S.roi>=0?"rgba(0,200,150,0.15)":"rgba(255,77,109,0.15)"},
            ].map(k=>(
              <div key={k.l} style={{background:k.bg,border:"1px solid "+k.bc,borderRadius:14,padding:13}}>
                <div style={{fontSize:9,color:"var(--mt)",letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>{k.l}</div>
                <div style={{fontSize:17,fontWeight:900,color:k.c}}>{k.v}</div>
                <div style={{fontSize:10,color:"var(--dm)",marginTop:3}}>{k.s}</div>
              </div>
            ))}
          </div>

          <div style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:16,padding:15,marginBottom:12}}>
            <div className="sec">Prochains RDV</div>
            {rdvs.filter(r=>r.status!=="cancelled"&&new Date(r.date)>=new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,4).map(r=>(
              <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid var(--nb)"}}>
                <div style={{width:32,height:32,borderRadius:9,background:SC[r.status].color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:SC[r.status].color,fontSize:14,flexShrink:0}}>{r.name[0].toUpperCase()}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13}}>{r.name}</div>
                  <div style={{fontSize:10,color:"var(--dm)",marginTop:1}}>{fmtDate(r.date)}{r.time?" "+r.time:""}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:12,fontWeight:800,color:"var(--gl)"}}>{fmtMAD(r.price)}</div>
                  <div style={{fontSize:10,color:"var(--gn)",fontWeight:700}}>+{fmtMAD(r.price*CR)}</div>
                </div>
              </div>
            ))}
            {rdvs.filter(r=>r.status!=="cancelled"&&new Date(r.date)>=new Date()).length===0&&<div style={{textAlign:"center",color:"var(--mt)",fontSize:12,padding:"14px 0"}}>Aucun RDV a venir</div>}
          </div>

          <div style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:16,padding:15,marginBottom:12}}>
            <div className="sec">Simulateur pub</div>
            <div style={{fontSize:12,color:"var(--dm)",marginBottom:12}}>{scen}$/j x 7j = {fmtMAD(sc.pm)} investi</div>
            <input type="range" min="1" max="50" value={scen} onChange={e=>setScen(+e.target.value)} className="sl" style={{marginBottom:14}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:10}}>
              {[["Budget",fmtMAD(sc.pm),"var(--rd)"],["~Patients",sc.pat+" pat.","var(--or)"],["Commission",fmtMAD(sc.cm),"var(--gn)"]].map(([l,v,c])=>(
                <div key={l} style={{background:"var(--nv3)",borderRadius:10,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:12,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:9,color:"var(--mt)",marginTop:2,textTransform:"uppercase"}}>{l}</div></div>
              ))}
            </div>
            <div style={{padding:"8px 12px",background:sc.roi>=0?"rgba(0,200,150,0.06)":"rgba(255,77,109,0.06)",border:"1px solid "+(sc.roi>=0?"rgba(0,200,150,0.2)":"rgba(255,77,109,0.2)"),borderRadius:10,fontSize:12,color:sc.roi>=0?"var(--gn)":"var(--rd)",fontWeight:800,textAlign:"center"}}>
              ROI net : {sc.roi>=0?"+":""}{fmtMAD(sc.roi)} x{Math.round(sc.cm/Math.max(sc.pm,1)*10)/10}
            </div>
          </div>

          <div style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:16,padding:15}}>
            <div className="sec">Insights</div>
            {[
              S.conf>0&&"Source n1 : "+Object.entries(S.bsc).sort((a,b)=>b[1]-a[1])[0]?.[0]+" - "+fmtMAD(Math.round(Object.entries(S.bsc).sort((a,b)=>b[1]-a[1])[0]?.[1]||0)),
              S.cpl>0&&"Cout/patient : "+fmtMAD(S.cpl)+" pour "+fmtMAD(Math.round(S.ac))+" commission (x"+Math.round(S.ac/Math.max(S.cpl,1))+" ROI)",
              S.proj>0&&"Projection mois : "+fmtMAD(S.proj)+(S.proj>goal?" - objectif depasse !":""),
              S.rel.length>0&&S.rel.length+" patient(s) en attente +2j - relance !",
            ].filter(Boolean).map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"10px 12px",background:"rgba(255,255,255,0.02)",borderRadius:11,border:"1px solid rgba(255,255,255,0.05)",marginBottom:8}}>
                <span style={{flexShrink:0,marginTop:1,color:i===0?"var(--go)":i===1?"var(--or)":i===2?"var(--gn)":"var(--pu)"}}><Ic n={i===0?"award":i===1?"bulb":i===2?"trend":"zap"} s={16}/></span>
                <span style={{fontSize:12,color:"var(--dm)",lineHeight:1.6}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RDV */}
      {tab==="rdv"&&(
        <div style={{padding:"14px 14px 0"}}>
          {S.trd.length>0&&(
            <div className="tp" style={{background:"rgba(245,166,35,0.06)",border:"1px solid rgba(245,166,35,0.25)",borderRadius:14,padding:12,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:13,color:"var(--or)",marginBottom:8}}>Aujourd'hui — {S.trd.length} RDV</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {S.trd.map(r=>(
                  <div key={r.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:"rgba(245,166,35,0.06)",borderRadius:10,flex:"1 1 130px"}}>
                    <div style={{fontWeight:700,fontSize:12,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name} {r.time?"- "+r.time:""}</div>
                    <a href={"tel:"+r.phone} style={{display:"inline-flex",background:"rgba(203,170,106,0.1)",borderRadius:8,padding:"6px",color:"var(--go)",textDecoration:"none"}}><Ic n="phone" s={13}/></a>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            <div style={{background:"rgba(0,200,150,0.06)",border:"1px solid rgba(0,200,150,0.18)",borderRadius:14,padding:13}}><div style={{fontSize:9,color:"var(--mt)",marginBottom:3}}>Confirmes</div><div style={{fontSize:24,fontWeight:900,color:"var(--gn)"}}>{S.conf}</div><div style={{fontSize:10,color:"var(--dm)",marginTop:2}}>{fmtMAD(S.tc)}</div></div>
            <div style={{background:"rgba(245,166,35,0.06)",border:"1px solid rgba(245,166,35,0.18)",borderRadius:14,padding:13}}><div style={{fontSize:9,color:"var(--mt)",marginBottom:3}}>En attente</div><div style={{fontSize:24,fontWeight:900,color:"var(--or)"}}>{S.pend}</div><div style={{fontSize:10,color:"var(--dm)",marginTop:2}}>{fmtMAD(S.pca)} pot.</div></div>
            <div style={{background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.18)",borderRadius:14,padding:13}}><div style={{fontSize:9,color:"var(--mt)",marginBottom:3}}>Conversion</div><div style={{fontSize:24,fontWeight:900,color:"var(--go)"}}>{S.cvr}%</div><div className="pb" style={{marginTop:7}}><div className="pbf" style={{width:S.cvr+"%"}}/></div></div>
            <div style={{background:"rgba(255,77,109,0.05)",border:"1px solid rgba(255,77,109,0.15)",borderRadius:14,padding:13}}><div style={{fontSize:9,color:"var(--mt)",marginBottom:3}}>Annules</div><div style={{fontSize:24,fontWeight:900,color:"var(--rd)"}}>{S.canc}</div><div style={{fontSize:10,color:"var(--dm)",marginTop:2}}>{fmtMAD(S.cca)} perdus</div></div>
          </div>
          {S.pend>0&&<div style={{background:"rgba(226,168,69,0.05)",border:"1px solid rgba(226,168,69,0.2)",borderRadius:12,padding:"10px 13px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}><span style={{color:"var(--or)"}}><Ic n="bulb" s={16}/></span><div style={{flex:1,fontSize:12,color:"var(--dm)"}}>Potentiel si tout confirme</div><div style={{fontSize:14,fontWeight:900,color:"var(--or)"}}>{fmtMAD(Math.round(S.pca*CR))}</div></div>}
          <div style={{position:"relative",marginBottom:10}}>
            <input className="inp" placeholder="Rechercher un patient..." value={q} onChange={e=>setQ(e.target.value)} style={{paddingLeft:40}}/>
            <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--mt)",display:"flex"}}><Ic n="search" s={16}/></span>
            {q&&<button onClick={()=>setQ("")} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",display:"inline-flex",background:"none",border:"none",color:"var(--mt)",cursor:"pointer",padding:4}}><Ic n="x" s={15} sw={2.2}/></button>}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none"}}>
              {["all","confirmed","pending","cancelled"].map(s=>(
                <button key={s} className={"ch"+(fst===s?" on":"")} onClick={()=>setFst(s)}>
                  {s==="all"?"Tous":SC[s].label} ({s==="all"?rdvs.length:rdvs.filter(r=>r.status===s).length})
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:4,marginLeft:8,flexShrink:0}}>
              {[["date","D"],["price","P"],["name","N"]].map(([k,e])=>(
                <button key={k} onClick={()=>setSrt(k)} style={{width:28,height:28,borderRadius:8,border:"1px solid "+(srt===k?"rgba(201,168,76,0.4)":"var(--nb)"),background:srt===k?"rgba(201,168,76,0.1)":"none",fontSize:11,fontWeight:700,cursor:"pointer",color:srt===k?"var(--go)":"var(--mt)"}}>{e}</button>
              ))}
            </div>
          </div>
          {fr.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"var(--dm)"}}>Aucun resultat</div>}
          {fr.map(rdv=>{
            const du=Math.ceil((new Date(rdv.date)-Date.now())/86400000);
            const ip=du<0&&rdv.status==="pending";
            const is=du===1&&rdv.status!=="cancelled";
            return(
              <div key={rdv.id} className={"card "+rdv.status} style={{borderColor:ip?"rgba(255,77,109,0.35)":isToday(rdv.date)&&rdv.status!=="cancelled"?"rgba(245,166,35,0.4)":"var(--nb)"}}>
                <div style={{display:"flex",gap:5,marginBottom:9,flexWrap:"wrap"}}>
                  {isToday(rdv.date)&&rdv.status!=="cancelled"&&<span className="bdg" style={{background:"var(--or)",color:"#050D1A"}}>AUJOURD HUI</span>}
                  {is&&<span className="bdg" style={{background:"rgba(100,200,180,0.85)",color:"#050D1A"}}>DEMAIN</span>}
                  {ip&&<span className="bdg" style={{background:"var(--rd)",color:"white"}}>PASSE</span>}
                  {rdv.returnPatient&&<span className="bdg" style={{background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.3)",color:"var(--go)"}}>Fidele</span>}
                  {rdv.source==="Instagram"&&<span className="bdg" style={{background:"rgba(225,48,108,0.12)",color:"#E1306C"}}>Instagram</span>}
                  {rdv.source==="WhatsApp"&&<span className="bdg" style={{background:"rgba(37,211,102,0.1)",color:"#25D366"}}>WhatsApp</span>}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:40,height:40,borderRadius:11,background:SC[rdv.status].color+"20",border:"1px solid "+SC[rdv.status].color+"30",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:SC[rdv.status].color,fontSize:17,flexShrink:0}}>{rdv.name[0].toUpperCase()}</div>
                    <div>
                      <div style={{fontWeight:800,fontSize:15}}>{rdv.name}</div>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3,flexWrap:"wrap"}}>
                        {rdv.teeth>0&&<span style={{fontSize:11,color:"var(--dm)",display:"inline-flex",alignItems:"center",gap:4}}><Ic n="tooth" s={12} sw={1.6}/> {rdv.teeth}</span>}
                        {rdv.treatment&&<span style={{fontSize:10,color:"var(--go)",background:"rgba(201,168,76,0.08)",padding:"1px 7px",borderRadius:10}}>{rdv.treatment}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontWeight:900,fontSize:16,color:rdv.status==="cancelled"?"var(--mt)":rdv.status==="confirmed"?"var(--gl)":"var(--tx)"}}>{fmtMAD(rdv.price)}</div>
                    {rdv.status==="confirmed"&&<div style={{fontSize:11,color:"var(--gn)",fontWeight:700,marginTop:2}}>+{fmtMAD(rdv.price*CR)}</div>}
                    {rdv.status==="pending"&&<div style={{fontSize:11,color:"var(--or)",marginTop:2}}>~{fmtMAD(rdv.price*CR)}</div>}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"7px 11px",background:"var(--nv3)",borderRadius:10,marginBottom:8}}>
                  <span style={{fontSize:12,color:"var(--dm)",display:"inline-flex",alignItems:"center",gap:5}}><Ic n="cal" s={13} sw={1.7}/> {fmtDate(rdv.date)}</span>
                  {rdv.time&&<span style={{fontSize:12,color:"var(--dm)",display:"inline-flex",alignItems:"center",gap:5}}><Ic n="clock" s={13} sw={1.7}/> {rdv.time}</span>}
                  <span style={{marginLeft:"auto",fontSize:10,color:du>0&&du<=3?"var(--or)":"var(--mt)"}}>{rdv.status==="cancelled"?"Annule":du>0?"dans "+du+"j":du===0?"Aujourd hui":"il y a "+Math.abs(du)+"j"}</span>
                </div>
                <div style={{marginBottom:rdv.notes?8:0}}>
                  <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:8,fontSize:10,fontWeight:800,letterSpacing:.3,background:SC[rdv.status].color+"14",color:SC[rdv.status].color,border:"1px solid "+SC[rdv.status].color+"2A"}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:SC[rdv.status].color}}/>{SC[rdv.status].label}
                  </span>
                </div>
                {rdv.notes&&<div style={{display:"flex",alignItems:"flex-start",gap:7,fontSize:12,color:"var(--dm)",fontStyle:"italic",margin:"8px 0",padding:"8px 10px",background:"rgba(255,255,255,0.02)",borderRadius:8,borderLeft:"2px solid var(--nb)"}}><span style={{color:"var(--mt)",marginTop:1,flexShrink:0}}><Ic n="note" s={13} sw={1.6}/></span>{rdv.notes}</div>}
                <div style={{display:"flex",gap:6,alignItems:"center",justifyContent:"space-between",marginTop:9,paddingTop:9,borderTop:"1px solid var(--nb)"}}>
                  <div style={{display:"flex",gap:6}}>
                    <a href={"tel:"+rdv.phone} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,color:"var(--go)",textDecoration:"none",background:"rgba(203,170,106,0.08)",border:"1px solid rgba(203,170,106,0.2)",borderRadius:9,padding:"6px 11px",fontWeight:600}}><Ic n="phone" s={13}/> Tel</a>
                    <a href={waLink(rdv.phone,rdv.name,rdv.date,rdv.time)} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,color:"#25D366",textDecoration:"none",background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:9,padding:"6px 11px",fontWeight:600}}><Ic n="wa" s={13}/> WA</a>
                  </div>
                  <div style={{display:"flex",gap:5}}>
                    {cdd===rdv.id?(
                      <><span style={{fontSize:11,color:"var(--rd)",alignSelf:"center"}}>Supprimer ?</span><button className="ab" onClick={()=>hd(rdv.id)} style={{width:"auto",padding:"0 11px",background:"rgba(228,90,110,0.15)",color:"var(--rd)",fontWeight:700,fontSize:11,borderColor:"rgba(228,90,110,0.3)"}}>Oui</button><button className="ab" onClick={()=>setCdd(null)} style={{width:"auto",padding:"0 11px",fontSize:11}}>Non</button></>
                    ):(
                      <><button className="ab" title="Changer statut" onClick={()=>hst(rdv.id)}><Ic n="swap" s={15}/></button><button className="ab" title="Modifier" onClick={()=>he(rdv)}><Ic n="edit" s={15}/></button><button className="ab" title="Dupliquer" onClick={()=>hdup(rdv)}><Ic n="copy" s={15}/></button><button className="ab" title="Supprimer" onClick={()=>setCdd(rdv.id)}><Ic n="trash" s={15}/></button></>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* GAINS */}
      {tab==="gains"&&(
        <div style={{padding:"14px"}}>
          <div className="hero" style={{marginBottom:12}}>
            <div style={{fontSize:10,color:"rgba(201,168,76,0.5)",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Commission totale</div>
            <div className="gg" style={{fontSize:38,fontWeight:900,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{fmtMAD(S.tc)}</div>
            <div style={{fontSize:12,color:"var(--dm)",marginTop:6}}>sur {fmtMAD(S.tca)} de CA</div>
            <div style={{height:1,background:"rgba(201,168,76,0.12)",margin:"12px 0"}}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
              {[["Patients",S.conf,"var(--gn)"],["Dents",rdvs.filter(r=>r.status==="confirmed").reduce((s,r)=>s+r.teeth,0),"var(--go)"],["Moy.",fmtMAD(Math.round(S.tca/(S.conf||1))).replace(" DH","")+"DH","var(--go)"],["Conv.",S.cvr+"%",S.cvr>=70?"var(--gn)":"var(--or)"]].map(([l,v,c])=>(
                <div key={l} style={{textAlign:"center",background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"7px 3px"}}><div style={{fontSize:13,fontWeight:900,color:c}}>{v}</div><div style={{fontSize:9,color:"var(--mt)",marginTop:2}}>{l}</div></div>
              ))}
            </div>
          </div>
          <div style={{background:"var(--nv2)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:16,padding:15,marginBottom:12,cursor:"pointer"}} onClick={()=>{setGi(String(goal));setSgm(true);}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div><div style={{fontSize:13,fontWeight:700}}>Objectif mensuel</div><div style={{fontSize:10,color:"var(--mt)",marginTop:2}}>Appuie pour modifier</div></div>
              <div style={{fontSize:20,fontWeight:900,color:S.gp>=100?"var(--gn)":"var(--go)"}}>{S.gp}%</div>
            </div>
            <div className="pb" style={{height:8,marginBottom:10}}><div className="pbf" style={{width:S.gp+"%"}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
              {[["Gagne",fmtMAD(Math.round(S.tc)),"var(--gn)"],["Objectif",fmtMAD(goal),"var(--go)"],["Reste",fmtMAD(S.gr),"var(--or)"]].map(([l,v,c])=>(
                <div key={l} style={{textAlign:"center",background:"var(--nv)",borderRadius:9,padding:"7px 4px"}}><div style={{fontSize:11,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:9,color:"var(--mt)",marginTop:1}}>{l}</div></div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            <div style={{background:"rgba(0,200,150,0.05)",border:"1px solid rgba(0,200,150,0.18)",borderRadius:14,padding:13}}>
              <div style={{fontSize:9,color:"rgba(0,200,150,0.7)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>Projection mois</div>
              <div style={{fontSize:19,fontWeight:900,color:"var(--gn)"}}>{S.proj>0?fmtMAD(S.proj):"--"}</div>
            </div>
            <div style={{background:S.roi>=0?"rgba(0,200,150,0.05)":"rgba(255,77,109,0.05)",border:"1px solid "+(S.roi>=0?"rgba(0,200,150,0.18)":"rgba(255,77,109,0.18)"),borderRadius:14,padding:13}}>
              <div style={{fontSize:9,color:S.roi>=0?"rgba(0,200,150,0.7)":"rgba(255,77,109,0.7)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>ROI pub</div>
              <div style={{fontSize:19,fontWeight:900,color:S.roi>=0?"var(--gn)":"var(--rd)"}}>{S.roi>=0?"+":""}{fmtMAD(S.roi)}</div>
              <div style={{fontSize:10,color:"var(--mt)",marginTop:3}}>{fmtMAD(S.tp)} investis</div>
            </div>
          </div>
          <div style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:14,padding:15,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700}}>Taux de conversion</div>
              <div style={{fontSize:17,fontWeight:900,color:S.cvr>=70?"var(--gn)":S.cvr>=50?"var(--or)":"var(--rd)"}}>{S.cvr}%</div>
            </div>
            <div style={{height:7,borderRadius:10,overflow:"hidden",display:"flex",marginBottom:8}}>
              {S.conf>0&&<div style={{flex:S.conf,background:"var(--gn)",borderRadius:"10px 0 0 10px"}}/>}
              {S.pend>0&&<div style={{flex:S.pend,background:"var(--or)"}}/>}
              {S.canc>0&&<div style={{flex:S.canc,background:"var(--rd)",borderRadius:"0 10px 10px 0"}}/>}
            </div>
            <div style={{display:"flex",gap:12}}>
              {[["Confirmes",S.conf,"var(--gn)"],["Attente",S.pend,"var(--or)"],["Annules",S.canc,"var(--rd)"]].map(([l,n,c])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:2,background:c}}/><span style={{fontSize:10,color:"var(--dm)"}}>{l} <span style={{fontWeight:700,color:c}}>{n}</span></span></div>
              ))}
            </div>
          </div>
          <div className="sec">Classement patients</div>
          {rdvs.filter(r=>r.status==="confirmed").sort((a,b)=>b.price-a.price).map((r,i)=>(
            <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:13,marginBottom:8}}>
              <div style={{width:22,height:22,borderRadius:7,background:i===0?"rgba(201,168,76,0.2)":i===1?"rgba(160,160,160,0.15)":i===2?"rgba(180,100,50,0.15)":"var(--nv3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:i===0?"var(--go)":i===1?"#AAA":i===2?"#CD7F32":"var(--mt)",flexShrink:0}}>{i+1}</div>
              <div style={{width:30,height:30,borderRadius:9,background:"rgba(201,168,76,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"var(--go)",fontSize:13,flexShrink:0}}>{r.name[0].toUpperCase()}</div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{r.name}</div><div style={{fontSize:10,color:"var(--dm)"}}>{fmtDate(r.date)} - {r.treatment||"Facettes"}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:800,color:"var(--gn)"}}>+{fmtMAD(r.price*CR)}</div><div style={{fontSize:10,color:"var(--dm)"}}>{fmtMAD(r.price)}</div></div>
            </div>
          ))}
          {mk.length>0&&<div style={{marginTop:14}}>
            <div className="sec">Par mois</div>
            {mk.map((month,idx)=>{const m=S.bm[month];const mx=Math.max(...mk.map(k=>S.bm[k].comm),1);const roi=m.comm-m.pub;return(
              <div key={month} style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:13,padding:13,marginBottom:8,position:"relative"}}>
                {idx===0&&<div style={{position:"absolute",top:9,right:10,fontSize:9,fontWeight:800,color:"var(--go)",background:"rgba(201,168,76,0.1)",padding:"2px 7px",borderRadius:10}}>CE MOIS</div>}
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
                  <div><div style={{fontWeight:700,fontSize:13,textTransform:"capitalize"}}>{mlabel(month)}</div><div style={{fontSize:10,color:"var(--dm)",marginTop:2}}>{m.cnt} patient{m.cnt>1?"s":""}{m.cnt>0?" - moy. "+fmtMAD(Math.round(m.ca/m.cnt)):""}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontWeight:900,fontSize:17,color:"var(--gl)"}}>{fmtMAD(m.comm)}</div><div style={{fontSize:10,color:"var(--dm)"}}>{fmtMAD(m.ca)}</div></div>
                </div>
                <div className="pb" style={{marginBottom:8}}><div className="pbf" style={{width:(m.comm/mx*100)+"%"}}/></div>
                <div style={{display:"flex",gap:8}}>
                  {m.pub>0&&<span style={{fontSize:10,color:"var(--rd)",background:"rgba(255,77,109,0.08)",padding:"2px 8px",borderRadius:10}}>Pub -{fmtMAD(m.pub)}</span>}
                  <span style={{fontSize:10,color:roi>=0?"var(--gn)":"var(--rd)",background:roi>=0?"rgba(0,200,150,0.08)":"rgba(255,77,109,0.08)",padding:"2px 8px",borderRadius:10,fontWeight:700}}>ROI {roi>=0?"+":""}{fmtMAD(roi)}</span>
                </div>
              </div>
            );})}
          </div>}
        </div>
      )}

      {/* PUB */}
      {tab==="pub"&&(
        <div style={{padding:"14px"}}>
          <div style={{background:S.roi>=0?"linear-gradient(135deg,#061A12,#0D1B30)":"linear-gradient(135deg,#1A0610,#0D1B30)",border:"1px solid "+(S.roi>=0?"rgba(0,200,150,0.2)":"rgba(255,77,109,0.2)"),borderRadius:20,padding:22,marginBottom:12}}>
            <div style={{fontSize:10,color:S.roi>=0?"rgba(0,200,150,0.6)":"rgba(255,77,109,0.6)",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>ROI Net</div>
            <div style={{fontSize:32,fontWeight:900,color:S.roi>=0?"var(--gn)":"var(--rd)",fontFamily:"'Playfair Display',serif"}}>{S.roi>=0?"+":""}{fmtMAD(S.roi)}</div>
            {S.rp!==null&&<div style={{fontSize:12,color:"var(--dm)",marginTop:4}}>Retour sur investissement : {S.rp}%</div>}
            <div style={{marginTop:14,display:"flex",gap:16}}>
              {[["Commission",fmtMAD(S.tc),"var(--go)"],["Budget pub",fmtMAD(S.tp),"var(--rd)"],["Cout/patient",S.cpl>0?fmtMAD(S.cpl):"--","var(--pu)"]].map(([l,v,c])=>(
                <div key={l}><div style={{fontSize:10,color:"var(--mt)"}}>{l}</div><div style={{fontSize:13,fontWeight:700,color:c}}>{v}</div></div>
              ))}
            </div>
          </div>
          <div style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:16,padding:15,marginBottom:12}}>
            <div className="sec">Simulateur</div>
            <div style={{fontSize:12,color:"var(--dm)",marginBottom:12}}>{scen}$/j x 7j</div>
            <input type="range" min="1" max="50" value={scen} onChange={e=>setScen(+e.target.value)} className="sl" style={{marginBottom:14}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:10}}>
              {[["Budget",fmtMAD(sc.pm),"var(--rd)"],["~Patients",sc.pat+" pat.","var(--or)"],["Commission",fmtMAD(sc.cm),"var(--gn)"]].map(([l,v,c])=>(
                <div key={l} style={{background:"var(--nv3)",borderRadius:10,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:12,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:9,color:"var(--mt)",marginTop:2,textTransform:"uppercase"}}>{l}</div></div>
              ))}
            </div>
            <div style={{padding:"8px 12px",background:sc.roi>=0?"rgba(0,200,150,0.06)":"rgba(255,77,109,0.06)",border:"1px solid "+(sc.roi>=0?"rgba(0,200,150,0.2)":"rgba(255,77,109,0.2)"),borderRadius:10,fontSize:12,color:sc.roi>=0?"var(--gn)":"var(--rd)",fontWeight:800,textAlign:"center"}}>
              ROI {sc.roi>=0?"+":""}{fmtMAD(sc.roi)} x{Math.round(sc.cm/Math.max(sc.pm,1)*10)/10}
            </div>
          </div>
          <button className="btn" onClick={()=>{setSpf(true);setEpid(null);setPf({...PF0,dateFrom:today()});}} style={{marginBottom:14,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7}}><Ic n="plus" s={17} sw={2.4}/> Ajouter une dépense pub</button>
          <div className="sec">Campagnes</div>
          {pubs.sort((a,b)=>new Date(b.dateFrom)-new Date(a.dateFrom)).map(p=>(
            <div key={p.id} style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderLeft:"3px solid var(--pu)",borderRadius:14,padding:13,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14}}>{p.label}</div>
                  <div style={{fontSize:11,color:"var(--dm)",marginTop:2}}>{p.platform}</div>
                  <div style={{fontSize:11,color:"var(--dm)",marginTop:2}}>{fmtDate(p.dateFrom)} → {fmtDate(p.dateTo)} · {pdays(p)}j · {p.dailyBudget}{p.currency}/j</div>
                </div>
                <div style={{textAlign:"right",marginLeft:12}}>
                  <div style={{fontWeight:800,fontSize:15,color:"var(--rd)"}}>-{fmtMAD(pamad(p))}</div>
                  <div style={{display:"flex",gap:5,marginTop:5,justifyContent:"flex-end"}}>
                    {cpd===p.id?(
                      <><button className="ab" onClick={()=>hpd(p.id)} style={{width:"auto",padding:"0 11px",background:"rgba(228,90,110,0.15)",color:"var(--rd)",fontWeight:700,fontSize:11,borderColor:"rgba(228,90,110,0.3)"}}>Oui</button><button className="ab" onClick={()=>setCpd(null)} style={{width:"auto",padding:"0 11px",fontSize:11}}>Non</button></>
                    ):(
                      <><button className="ab" title="Modifier" onClick={()=>hpe(p)}><Ic n="edit" s={15}/></button><button className="ab" title="Supprimer" onClick={()=>setCpd(p.id)}><Ic n="trash" s={15}/></button></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ANALYSE */}
      {tab==="analyse"&&(
        <div style={{padding:"14px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[
              {l:"CA total",v:fmtMAD(S.tca),c:"var(--go)"},
              {l:"Commission",v:fmtMAD(S.tc),c:"var(--gn)"},
              {l:"Moy./patient",v:fmtMAD(Math.round(S.tca/Math.max(S.conf,1))),c:"var(--go)"},
              {l:"Cout/patient pub",v:S.cpl>0?fmtMAD(S.cpl):"--",c:"var(--pu)"}
            ].map(k=>(
              <div key={k.l} style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:13,padding:13}}>
                <div style={{fontSize:9,color:"var(--mt)",letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>{k.l}</div>
                <div style={{fontSize:17,fontWeight:900,color:k.c}}>{k.v}</div>
              </div>
            ))}
          </div>

          {/* Sources */}
          <div style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:16,padding:16,marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Sources d'acquisition</div>
            {Object.keys(S.bs||{}).length===0?(
              <div style={{textAlign:"center",color:"var(--mt)",fontSize:13,padding:"10px 0"}}>Aucun patient confirme</div>
            ):(
              <div>
                <div style={{display:"flex",gap:16,marginBottom:14}}>
                  <Donut segs={[...ss].sort((a,b)=>b.value-a.value)} size={100}/>
                  <div style={{flex:1}}>
                    {[...ss].sort((a,b)=>b.value-a.value).map(s=>(
                      <div key={s.label} style={{marginBottom:8}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <div style={{width:7,height:7,borderRadius:2,background:s.color}}/>
                            <span style={{fontSize:12,fontWeight:600}}>{s.label}</span>
                          </div>
                          <span style={{fontSize:12,fontWeight:700,color:s.color}}>
                            {s.value} - {Math.round(s.value/ss.reduce((x,y)=>x+y.value,0)*100)}%
                          </span>
                        </div>
                        <div className="pb">
                          <div style={{height:"100%",borderRadius:3,background:s.color,width:Math.round(s.value/ss.reduce((x,y)=>x+y.value,0)*100)+"%"}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{borderTop:"1px solid var(--nb)",paddingTop:12}}>
                  <div className="sec">Commission par source</div>
                  {[...Object.entries(S.bsc||{})].sort((a,b)=>b[1]-a[1]).map(([src,ca],i)=>(
                    <div key={src} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                      <div style={{fontSize:10,fontWeight:700,color:"var(--mt)",width:12}}>{i+1}</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:12}}>
                          <span style={{color:"var(--dm)"}}>{src}</span>
                          <span style={{fontWeight:700,color:scols[src]||"#888"}}>{fmtMAD(Math.round(ca))}</span>
                        </div>
                        <div className="pb">
                          <div style={{height:"100%",borderRadius:3,background:scols[src]||"#888",width:Math.round(ca/Math.max(...Object.values(S.bsc))*100)+"%"}}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Traitements */}
          {Object.keys(S.bt||{}).length>0&&(
            <div style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:16,padding:16,marginBottom:12}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Par traitement</div>
              {[...Object.entries(S.bt||{})].sort((a,b)=>b[1].ca-a[1].ca).map(([t,d],i)=>(
                <div key={t} style={{marginBottom:11}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:9,height:9,borderRadius:3,background:["#C9A84C","#00C896","#9B7FEA","#F5A623","#E1306C","#25D366"][i%6]}}/>
                      <span style={{fontSize:13,fontWeight:600}}>{t}</span>
                    </div>
                    <div>
                      <span style={{fontSize:13,fontWeight:800,color:["#C9A84C","#00C896","#9B7FEA","#F5A623","#E1306C","#25D366"][i%6]}}>{fmtMAD(d.ca)}</span>
                      <span style={{fontSize:11,color:"var(--gn)",marginLeft:8}}>+{fmtMAD(Math.round(d.ca*CR))}</span>
                    </div>
                  </div>
                  <div className="pb" style={{height:6}}>
                    <div style={{height:"100%",borderRadius:6,background:["#C9A84C","#00C896","#9B7FEA","#F5A623","#E1306C","#25D366"][i%6],width:Math.round(d.ca/Math.max(...Object.entries(S.bt||{}).map(([,x])=>x.ca))*100)+"%"}}/>
                  </div>
                  <div style={{fontSize:10,color:"var(--mt)",marginTop:3}}>{d.cnt} patient{d.cnt>1?"s":""} - moy. {fmtMAD(Math.round(d.ca/d.cnt))}</div>
                </div>
              ))}
            </div>
          )}

          {/* Insights */}
          <div style={{background:"linear-gradient(135deg,#0F1E38,#1A1208)",border:"1px solid rgba(201,168,76,0.18)",borderRadius:16,padding:16,marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Insights automatiques</div>
            {S.conf===0&&(
              <div style={{textAlign:"center",color:"var(--dm)",fontSize:13,padding:"10px 0"}}>Ajoute des RDV confirmes pour voir les insights</div>
            )}
            {S.conf>0&&Object.keys(S.bt||{}).length>0&&(
              <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 11px",background:"rgba(255,255,255,0.02)",borderRadius:10,border:"1px solid rgba(255,255,255,0.04)",marginBottom:8}}>
                <span style={{flexShrink:0,marginTop:1,color:"var(--go)"}}><Ic n="award" s={16}/></span>
                <span style={{fontSize:12,color:"var(--dm)",lineHeight:1.6}}>
                  {Object.keys(S.bt||{}).length>0&&"Meilleur traitement : "+[...Object.entries(S.bt)].sort((a,b)=>b[1].ca-a[1].ca)[0][0]+" - "+fmtMAD([...Object.entries(S.bt)].sort((a,b)=>b[1].ca-a[1].ca)[0][1].ca)}
                </span>
              </div>
            )}
            {S.conf>0&&Object.keys(S.bsc||{}).length>0&&(
              <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 11px",background:"rgba(255,255,255,0.02)",borderRadius:10,border:"1px solid rgba(255,255,255,0.04)",marginBottom:8}}>
                <span style={{flexShrink:0,marginTop:1,color:"var(--pu)"}}><Ic n="mega" s={16}/></span>
                <span style={{fontSize:12,color:"var(--dm)",lineHeight:1.6}}>
                  {Object.keys(S.bsc||{}).length>0&&"Source n1 : "+[...Object.entries(S.bsc)].sort((a,b)=>b[1]-a[1])[0][0]+" - "+fmtMAD(Math.round([...Object.entries(S.bsc)].sort((a,b)=>b[1]-a[1])[0][1]))+" commission"}
                </span>
              </div>
            )}
            {S.roi>0&&S.cpl>0&&(
              <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 11px",background:"rgba(255,255,255,0.02)",borderRadius:10,border:"1px solid rgba(255,255,255,0.04)",marginBottom:8}}>
                <span style={{flexShrink:0,marginTop:1,color:"var(--gn)"}}><Ic n="rocket" s={16}/></span>
                <span style={{fontSize:12,color:"var(--dm)",lineHeight:1.6}}>
                  {"ROI pub x"+Math.round(S.ac/Math.max(S.cpl,1))+" - chaque "+fmtMAD(S.cpl)+" investi rapporte "+fmtMAD(Math.round(S.ac))}
                </span>
              </div>
            )}
            {S.cvr<70&&S.conf>0&&(
              <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 11px",background:"rgba(255,255,255,0.02)",borderRadius:10,border:"1px solid rgba(255,255,255,0.04)",marginBottom:8}}>
                <span style={{flexShrink:0,marginTop:1,color:"var(--or)"}}><Ic n="target" s={16}/></span>
                <span style={{fontSize:12,color:"var(--dm)",lineHeight:1.6}}>
                  {"Conversion "+S.cvr+"% - "+S.pend+" patient"+(S.pend>1?"s":"")+" en attente a relancer"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {tab==="semaine"&&(()=>{
        const tw0=gwb(0),lw0=gwb(-1),w20=gwb(-2),w30=gwb(-3);
        const tw=wst(tw0),lw=wst(lw0),w2=wst(w20),w3=wst(w30);
        const cd=dlt(tw.cm,lw.cm),cdc=dlt(tw.cf,lw.cf);
        const DAYS=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
        function dk(b,i){const d=new Date(b.s);d.setDate(d.getDate()+i);return d.toLocaleDateString("fr-FR",{weekday:"short"});}
        const twd=DAYS.map((_,i)=>{const k=dk(tw0,i);return tw.bd[k]||{cm:0,cnt:0};});
        const lwd=DAYS.map((_,i)=>{const k=dk(lw0,i);return lw.bd[k]||{cm:0,cnt:0};});
        const mxd=Math.max(...twd.map(d=>d.cm),...lwd.map(d=>d.cm),1);
        const w4=[{l:"Cette sem.",b:tw0,s:tw,c:"var(--go)"},{l:"Sem. -1",b:lw0,s:lw,c:"rgba(201,168,76,0.45)"},{l:"Sem. -2",b:w20,s:w2,c:"rgba(201,168,76,0.25)"},{l:"Sem. -3",b:w30,s:w3,c:"rgba(201,168,76,0.15)"}];
        const mx4=Math.max(...w4.map(w=>w.s.cm),1);
        return(
          <div style={{padding:"14px"}}>
            <div style={{background:"linear-gradient(135deg,#0F1E38,#1A1208)",border:"1px solid rgba(201,168,76,0.22)",borderRadius:20,padding:20,marginBottom:12}}>
              <div style={{fontSize:10,color:"rgba(201,168,76,0.5)",letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Comparaison hebdomadaire</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center"}}>
                <div>
                  <div style={{fontSize:10,color:"var(--mt)",marginBottom:4}}>Cette semaine</div>
                  <div className="gg" style={{fontSize:26,fontWeight:900,fontFamily:"'Playfair Display',serif"}}>{fmtMAD(Math.round(tw.cm))}</div>
                  <div style={{fontSize:11,color:"var(--dm)",marginTop:2}}>{tw.cf} confirme{tw.cf>1?"s":""}</div>
                  <div style={{fontSize:10,color:"var(--mt)",marginTop:2}}>{fmtB(tw0)}</div>
                </div>
                <div style={{textAlign:"center",padding:"0 6px"}}>
                  {cd!==null?(
                    <div style={{background:cd>=0?"rgba(0,200,150,0.1)":"rgba(255,77,109,0.1)",border:"1px solid "+(cd>=0?"rgba(0,200,150,0.3)":"rgba(255,77,109,0.3)"),borderRadius:12,padding:"8px 10px"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2,fontSize:19,fontWeight:900,color:cd>=0?"var(--gn)":"var(--rd)"}}><Ic n={cd>=0?"up":"dn"} s={15} sw={2.6}/>{Math.abs(cd)}%</div>
                      <div style={{fontSize:9,color:"var(--mt)",marginTop:2}}>vs sem. passee</div>
                    </div>
                  ):<div style={{fontSize:20}}>--</div>}
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10,color:"var(--mt)",marginBottom:4}}>Sem. passee</div>
                  <div style={{fontSize:26,fontWeight:900,color:"rgba(201,168,76,0.45)",fontFamily:"'Playfair Display',serif"}}>{fmtMAD(Math.round(lw.cm))}</div>
                  <div style={{fontSize:11,color:"var(--dm)",marginTop:2}}>{lw.cf} confirme{lw.cf>1?"s":""}</div>
                  <div style={{fontSize:10,color:"var(--mt)",marginTop:2}}>{fmtB(lw0)}</div>
                </div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[{l:"Confirmes",tw:tw.cf,lw:lw.cf,c:"var(--gn)",f:v=>String(v)},{l:"Commission",tw:tw.cm,lw:lw.cm,c:"var(--go)",f:v=>fmtMAD(Math.round(v))},{l:"CA genere",tw:tw.tca,lw:lw.tca,c:"var(--go)",f:v=>fmtMAD(Math.round(v))},{l:"Annules",tw:tw.ca,lw:lw.ca,c:"var(--rd)",f:v=>String(v)}].map(k=>{
                const d2=dlt(k.tw,k.lw);const bt=k.l==="Annules"?k.tw<=k.lw:k.tw>=k.lw;
                return (
                  <div key={k.l} style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:13,padding:13}}>
                    <div style={{fontSize:9,color:"var(--mt)",marginBottom:7}}>{k.l}</div>
                    <div style={{fontSize:19,fontWeight:900,color:k.c,marginBottom:3}}>{k.f(k.tw)}</div>
                    <div style={{fontSize:10,color:"var(--dm)",marginBottom:5}}>sem. pass. : {k.f(k.lw)}</div>
                    {d2!==null&&<div style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 7px",borderRadius:10,background:bt?"rgba(0,200,150,0.08)":"rgba(255,77,109,0.08)",border:"1px solid "+(bt?"rgba(0,200,150,0.2)":"rgba(255,77,109,0.2)")}}>
                      <span style={{display:"inline-flex",alignItems:"center",gap:1,fontSize:11,fontWeight:800,color:bt?"var(--gn)":"var(--rd)"}}><Ic n={d2>=0?"up":"dn"} s={11} sw={2.6}/>{Math.abs(d2)}%</span>
                    </div>}
                  </div>
                );
              })}
            </div>

            <div style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:16,padding:16,marginBottom:12}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Commission jour par jour</div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {[["var(--go)","Cette sem."],["rgba(201,168,76,0.3)","Sem. passee"]].map(([c,l])=><div key={l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:9,height:9,borderRadius:3,background:c}}/><span style={{fontSize:11,color:"var(--dm)"}}>{l}</span></div>)}
              </div>
              <div style={{display:"flex",alignItems:"flex-end",gap:4,height:90}}>
                {DAYS.map((day,i)=>(
                  <div key={day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <div style={{width:"100%",display:"flex",gap:1,alignItems:"flex-end",height:70}}>
                      <div style={{flex:1,background:"var(--nv3)",borderRadius:"3px 3px 0 0",height:"100%",display:"flex",alignItems:"flex-end"}}><div style={{width:"100%",borderRadius:"3px 3px 0 0",background:"rgba(201,168,76,0.3)",height:Math.max((lwd[i].cm/mxd)*100,lwd[i].cm>0?8:0)+"%"}}/></div>
                      <div style={{flex:1,background:"var(--nv3)",borderRadius:"3px 3px 0 0",height:"100%",display:"flex",alignItems:"flex-end"}}><div style={{width:"100%",borderRadius:"3px 3px 0 0",background:twd[i].cm>0?"linear-gradient(180deg,#E8C878,#C9A84C)":"transparent",height:Math.max((twd[i].cm/mxd)*100,twd[i].cm>0?8:0)+"%"}}/></div>
                    </div>
                    {twd[i].cnt>0&&<div style={{fontSize:8,color:"var(--go)",fontWeight:700}}>{twd[i].cnt}</div>}
                    <div style={{fontSize:9,color:"var(--mt)"}}>{day}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:16,padding:16,marginBottom:12}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Historique 4 semaines</div>
              {w4.map((w,i)=>(
                <div key={i} style={{marginBottom:11}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <div><div style={{fontSize:13,fontWeight:700,color:i===0?"var(--go)":"var(--dm)"}}>{w.l}</div><div style={{fontSize:10,color:"var(--mt)"}}>{fmtB(w.b)}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:900,color:i===0?"var(--go)":"var(--dm)"}}>{fmtMAD(Math.round(w.s.cm))}</div><div style={{fontSize:10,color:"var(--mt)"}}>{w.s.cf} RDV</div></div>
                  </div>
                  <div className="pb" style={{height:7}}><div style={{height:"100%",borderRadius:6,background:w.c,width:(w.s.cm/mx4*100)+"%"}}/></div>
                </div>
              ))}
              {tw.cm>0&&lw.cm>0&&<div style={{marginTop:12,padding:"9px 11px",background:tw.cm>=lw.cm?"rgba(0,200,150,0.06)":"rgba(255,77,109,0.06)",borderRadius:10,border:"1px solid "+(tw.cm>=lw.cm?"rgba(0,200,150,0.2)":"rgba(255,77,109,0.2)"),fontSize:12,color:tw.cm>=lw.cm?"var(--gn)":"var(--rd)",fontWeight:700}}>
                {tw.cm>=lw.cm?"En progression ! +"+fmtMAD(Math.round(tw.cm-lw.cm))+" vs sem. passee":"En baisse de "+fmtMAD(Math.round(lw.cm-tw.cm))+". Relance tes patients !"}
              </div>}
            </div>

            <div className="sec">RDV cette semaine ({tw.tot})</div>
            {tw.rdvs.length===0?<div style={{textAlign:"center",padding:"30px 0",color:"var(--mt)",fontSize:13}}>Aucun RDV cette semaine</div>:tw.rdvs.sort((a,b)=>new Date(a.date)-new Date(b.date)).map(r=>(
              <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:"var(--nv2)",border:"1px solid "+SC[r.status].color+"22",borderLeft:"3px solid "+SC[r.status].color,borderRadius:13,marginBottom:8}}>
                <div style={{width:34,height:34,borderRadius:10,background:SC[r.status].color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:SC[r.status].color,fontSize:15,flexShrink:0}}>{r.name[0].toUpperCase()}</div>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{r.name}</div><div style={{fontSize:11,color:"var(--dm)",marginTop:1}}>{fmtDate(r.date)}{r.time?" - "+r.time:""}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:800,color:r.status==="confirmed"?"var(--gl)":"var(--mt)"}}>{fmtMAD(r.price)}</div>{r.status==="confirmed"&&<div style={{fontSize:11,color:"var(--gn)",fontWeight:700}}>+{fmtMAD(r.price*CR)}</div>}</div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* CAL */}
      {tab==="cal"&&(()=>{
        const yr=cal.getFullYear(),mo=cal.getMonth();
        const fd=new Date(yr,mo,1).getDay();
        const dim=new Date(yr,mo+1,0).getDate();
        const mn=cal.toLocaleDateString("fr-FR",{month:"long",year:"numeric"});
        const so=fd===0?6:fd-1;
        const dm2={};
        rdvs.forEach(r=>{if(!r.date)return;const d=new Date(r.date);if(d.getFullYear()===yr&&d.getMonth()===mo){const dy=d.getDate();if(!dm2[dy])dm2[dy]={confirmed:[],pending:[],cancelled:[]};dm2[dy][r.status]?.push(r);}});
        const tmc=Object.values(dm2).reduce((s,d)=>s+d.confirmed.reduce((x,r)=>x+r.price*CR,0),0);
        const td=new Date(),icm=td.getFullYear()===yr&&td.getMonth()===mo;
        const tn=icm?td.getDate():null;
        const sr2=sel&&dm2[sel]?[...(dm2[sel].confirmed||[]),...(dm2[sel].pending||[]),...(dm2[sel].cancelled||[])]:[];
        return(
          <div style={{padding:"14px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <button onClick={()=>{setCal(new Date(yr,mo-1,1));setSel(null);}} style={{width:40,height:40,borderRadius:12,background:"var(--nv2)",border:"1px solid var(--nb)",color:"var(--tx)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="cl" s={18} sw={2.2}/></button>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,textTransform:"capitalize"}}>{mn}</div>
                <div style={{fontSize:11,color:"var(--gn)",fontWeight:700,marginTop:2}}>+{fmtMAD(Math.round(tmc))} ce mois</div>
              </div>
              <button onClick={()=>{setCal(new Date(yr,mo+1,1));setSel(null);}} style={{width:40,height:40,borderRadius:12,background:"var(--nv2)",border:"1px solid var(--nb)",color:"var(--tx)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="cr" s={18} sw={2.2}/></button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              {[["Confirmes",Object.values(dm2).reduce((s,d)=>s+d.confirmed.length,0),"var(--gn)"],["En attente",Object.values(dm2).reduce((s,d)=>s+d.pending.length,0),"var(--or)"],["Commission",fmtMAD(Math.round(tmc)),"var(--go)"]].map(([l,v,c])=>(
                <div key={l} style={{background:"var(--nv2)",border:"1px solid var(--nb)",borderRadius:12,padding:"9px 7px",textAlign:"center"}}><div style={{fontSize:14,fontWeight:900,color:c}}>{v}</div><div style={{fontSize:9,color:"var(--mt)",marginTop:2}}>{l}</div></div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:3}}>
              {["L","M","M","J","V","S","D"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:10,fontWeight:700,color:"var(--mt)",padding:"4px 0"}}>{d}</div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:14}}>
              {Array.from({length:so}).map((_,i)=><div key={"e"+i}/>)}
              {Array.from({length:dim}).map((_,i)=>{
                const dy=i+1,dd=dm2[dy];
                const cc=(dd&&dd.confirmed)?dd.confirmed.length:0;
                const pc=(dd&&dd.pending)?dd.pending.length:0;
                const xc=(dd&&dd.cancelled)?dd.cancelled.length:0;
                const dc=(dd&&dd.confirmed)?dd.confirmed.reduce((s,r)=>s+r.price*CR,0):0;
                const cit=dy===tn,isl=dy===sel,hr=cc+pc+xc>0;
                return (
                  <div key={dy} onClick={()=>setSel(isl?null:dy)} style={{borderRadius:10,padding:"6px 3px",minHeight:55,background:isl?"rgba(201,168,76,0.15)":cit?"rgba(201,168,76,0.07)":"var(--nv2)",border:"1px solid "+(isl?"rgba(201,168,76,0.5)":cit?"rgba(201,168,76,0.3)":hr?"var(--nb)":"rgba(26,45,74,0.4)"),cursor:hr?"pointer":"default",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <div style={{fontSize:12,fontWeight:cit?900:600,color:cit?"var(--go)":hr?"var(--tx)":"var(--mt)"}}>{dy}</div>
                    {hr&&<div style={{display:"flex",gap:2,flexWrap:"wrap",justifyContent:"center"}}>{cc>0&&<div style={{width:5,height:5,borderRadius:"50%",background:"var(--gn)"}}/>}{pc>0&&<div style={{width:5,height:5,borderRadius:"50%",background:"var(--or)"}}/>}{xc>0&&<div style={{width:5,height:5,borderRadius:"50%",background:"var(--rd)",opacity:0.5}}/>}</div>}
                    {dc>0&&<div style={{fontSize:7,fontWeight:700,color:"var(--gn)",background:"rgba(0,200,150,0.1)",borderRadius:4,padding:"1px 3px"}}>+{Math.round(dc)}</div>}
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:14}}>
              {[["Confirme","var(--gn)"],["En attente","var(--or)"],["Annule","var(--rd)"]].map(([l,c])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:"50%",background:c}}/><span style={{fontSize:10,color:"var(--mt)"}}>{l}</span></div>
              ))}
            </div>
            {sel&&(
              <div>
                <div style={{fontSize:13,fontWeight:700,marginBottom:10,color:"var(--go)"}}>
                  {sel} {mn} - {sr2.length} RDV
                  {dm2[sel]?.confirmed?.length>0&&<span style={{marginLeft:8,fontSize:12,color:"var(--gn)",fontWeight:700}}>+{fmtMAD(Math.round(dm2[sel].confirmed.reduce((s,r)=>s+r.price*CR,0)))}</span>}
                </div>
                {sr2.map(r=>(
                  <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:"var(--nv2)",border:"1px solid "+SC[r.status].color+"22",borderLeft:"3px solid "+SC[r.status].color,borderRadius:13,marginBottom:8}}>
                    <div style={{width:34,height:34,borderRadius:10,background:SC[r.status].color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:SC[r.status].color,fontSize:15,flexShrink:0}}>{r.name[0].toUpperCase()}</div>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{r.name}</div><div style={{fontSize:11,color:"var(--dm)",marginTop:2}}>{r.time&&r.time+" - "}{r.teeth} dents - {r.treatment||"Facettes"}</div></div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:13,fontWeight:800,color:r.status==="confirmed"?"var(--gl)":"var(--mt)"}}>{fmtMAD(r.price)}</div>
                      {r.status==="confirmed"&&<div style={{fontSize:11,color:"var(--gn)",fontWeight:700}}>+{fmtMAD(r.price*CR)}</div>}
                      <div style={{display:"flex",gap:4,marginTop:5,justifyContent:"flex-end"}}>
                        <a href={"tel:"+r.phone} style={{display:"inline-flex",background:"rgba(203,170,106,0.08)",borderRadius:8,padding:"6px",color:"var(--go)",textDecoration:"none"}}><Ic n="phone" s={13}/></a>
                        <a href={waLink(r.phone,r.name,r.date,r.time)} target="_blank" rel="noreferrer" style={{display:"inline-flex",background:"rgba(37,211,102,0.08)",borderRadius:8,padding:"6px",color:"#25D366",textDecoration:"none"}}><Ic n="wa" s={13}/></a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ALERTES */}
      {tab==="alertes"&&(
        <div style={{padding:"14px"}}>
          {ac2===0&&S.rel.length===0&&<div style={{textAlign:"center",padding:"70px 20px"}}><div style={{width:64,height:64,borderRadius:18,margin:"0 auto 16px",background:"rgba(51,186,134,0.1)",border:"1px solid rgba(51,186,134,0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--gn)"}}><Ic n="check" s={30} sw={2.4}/></div><div style={{fontSize:16,fontWeight:700,color:"var(--tx)"}}>Tout est en ordre</div><div style={{fontSize:13,color:"var(--mt)",marginTop:4}}>Aucune action requise pour le moment</div></div>}
          {S.trd.length>0&&(
            <div style={{marginBottom:16}}>
              <div className="sec">Aujourd'hui ({S.trd.length})</div>
              {S.trd.map(r=>(
                <div key={r.id} style={{background:"rgba(245,166,35,0.06)",border:"1px solid rgba(245,166,35,0.25)",borderRadius:14,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:34,height:34,borderRadius:10,background:"rgba(245,166,35,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"var(--or)",flexShrink:0,fontSize:16}}>{r.name[0].toUpperCase()}</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{r.name}</div><div style={{fontSize:12,color:"var(--dm)"}}>{r.time||"--"} - {fmtMAD(r.price)} - +{fmtMAD(r.price*CR)}</div></div>
                  <div style={{display:"flex",gap:6}}>
                    <a href={"tel:"+r.phone} style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(203,170,106,0.1)",borderRadius:9,padding:"7px 11px",color:"var(--go)",textDecoration:"none",fontSize:12,fontWeight:600}}><Ic n="phone" s={13}/> Tel</a>
                    <a href={waLink(r.phone,r.name,r.date,r.time)} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(37,211,102,0.1)",borderRadius:9,padding:"7px 11px",color:"#25D366",textDecoration:"none",fontSize:12,fontWeight:600}}><Ic n="wa" s={13}/> WA</a>
                  </div>
                </div>
              ))}
            </div>
          )}
          {S.rel.length>0&&(
            <div style={{marginBottom:16}}>
              <div className="sec">A relancer ({S.rel.length})</div>
              {S.rel.map(r=>(
                <div key={r.id} style={{background:"rgba(201,168,76,0.05)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:14,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:34,height:34,borderRadius:10,background:"rgba(201,168,76,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"var(--go)",flexShrink:0,fontSize:16}}>{r.name[0].toUpperCase()}</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{r.name}</div><div style={{fontSize:12,color:"var(--dm)"}}>{fmtDate(r.date)} - {ddiff(r.date)}j sans reponse</div></div>
                  <a href={waLink(r.phone,r.name,r.date,r.time)} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(37,211,102,0.1)",border:"1px solid rgba(37,211,102,0.25)",borderRadius:9,padding:"8px 13px",color:"#25D366",fontSize:12,textDecoration:"none",fontWeight:700}}><Ic n="wa" s={14}/> Relancer</a>
                </div>
              ))}
            </div>
          )}
          {S.stl.length>0&&(
            <div>
              <div className="sec">En attente +3j ({S.stl.length})</div>
              {S.stl.map(r=>(
                <div key={r.id} style={{background:"rgba(255,77,109,0.05)",border:"1px solid rgba(255,77,109,0.2)",borderRadius:14,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,77,109,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"var(--rd)",flexShrink:0,fontSize:16}}>{r.name[0].toUpperCase()}</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{r.name}</div><div style={{fontSize:12,color:"var(--dm)"}}>{fmtDate(r.date)} - {ddiff(r.date)}j</div></div>
                  <div style={{display:"flex",gap:6}}>
                    <a href={waLink(r.phone,r.name,r.date,r.time)} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(37,211,102,0.1)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:9,padding:"7px 11px",color:"#25D366",fontSize:11,textDecoration:"none",fontWeight:700}}><Ic n="wa" s={13}/> WA</a>
                    <button className="ab" title="Modifier" onClick={()=>he(r)}><Ic n="edit" s={15}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab==="rdv"&&!sf&&<button className="fab" onClick={()=>{setSf(true);setEid(null);setF({...IF0,date:today()});}}><Ic n="plus" s={26} sw={2.4}/></button>}

      {/* BOTTOM NAV */}
      <div className="bn">
        {[["home","home"],["rdv","cal"],["gains","money"],["pub","mega"],["analyse","bars"],["semaine","trend"],["cal","note"],["alertes","bell"]].map(([t,e])=>(
          <button key={t} className={"tb"+(tab===t?" on":"")} onClick={()=>setTab(t)} style={{padding:"11px 0",position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Ic n={e} s={21} sw={tab===t?2.1:1.8}/>{t==="alertes"&&ac2>0&&<span style={{position:"absolute",top:7,right:"calc(50% - 13px)",width:7,height:7,borderRadius:"50%",background:"var(--rd)",border:"1.5px solid var(--nv)"}}/>}
          </button>
        ))}
      </div>

      {/* MODAL OBJECTIF */}
      {sgm&&<div className="ov" onClick={e=>e.target===e.currentTarget&&setSgm(false)}>
        <div className="sh">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div className="gg" style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>Objectif mensuel</div>
            <button onClick={()=>setSgm(false)} style={{width:32,height:32,borderRadius:10,background:"var(--nv3)",border:"1px solid var(--nb)",color:"var(--dm)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="x" s={17} sw={2.2}/></button>
          </div>
          <div style={{fontSize:12,color:"var(--dm)",marginBottom:6}}>Objectif (DH)</div>
          <input className="inp" type="number" placeholder="5000" value={gi} onChange={e=>setGi(e.target.value)} style={{marginBottom:16}}/>
          {gi&&<div style={{fontSize:13,color:"var(--go)",marginBottom:16,fontWeight:700}}>Objectif : {fmtMAD(+gi)}</div>}
          <div style={{display:"flex",gap:10}}><button className="btn2" onClick={()=>setSgm(false)}>Annuler</button><button className="btn" onClick={()=>{if(+gi>0){sg(+gi);setSgm(false);}}}>Enregistrer</button></div>
        </div>
      </div>}

      {/* MODAL RDV */}
      {sf&&<div className="ov" onClick={e=>e.target===e.currentTarget&&setSf(false)}>
        <div className="sh">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div className="gg" style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>{eid?"Modifier RDV":"Nouveau RDV"}</div>
            <button onClick={()=>setSf(false)} style={{width:32,height:32,borderRadius:10,background:"var(--nv3)",border:"1px solid var(--nb)",color:"var(--dm)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="x" s={17} sw={2.2}/></button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><div style={{fontSize:12,color:"var(--dm)",marginBottom:6}}>Nom *</div><input className="inp" placeholder="Prenom" value={form.name} onChange={e=>setF({...form,name:e.target.value})}/></div>
              <div><div style={{fontSize:12,color:"var(--dm)",marginBottom:6}}>Nb dents</div><input className="inp" type="number" placeholder="16" value={form.teeth} onChange={e=>setF({...form,teeth:e.target.value})}/></div>
            </div>
            <div>
              <div style={{fontSize:12,color:"var(--dm)",marginBottom:6}}>Prix (DH) *</div>
              <input className="inp" type="number" placeholder="2000" value={form.price} onChange={e=>setF({...form,price:e.target.value})}/>
              {form.price&&<div style={{fontSize:12,color:"var(--go)",marginTop:6,fontWeight:700}}>Commission : {fmtMAD(Math.round(+form.price*CR))}</div>}
            </div>
            <div><div style={{fontSize:12,color:"var(--dm)",marginBottom:6}}>Traitement</div><select className="inp" value={form.treatment} onChange={e=>setF({...form,treatment:e.target.value})}>{TRTO.map(t=><option key={t}>{t}</option>)}</select></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><div style={{fontSize:12,color:"var(--dm)",marginBottom:6}}>Date *</div><input className="inp" type="date" value={form.date} onChange={e=>setF({...form,date:e.target.value})}/></div>
              <div><div style={{fontSize:12,color:"var(--dm)",marginBottom:6}}>Heure</div><input className="inp" type="time" value={form.time} onChange={e=>setF({...form,time:e.target.value})}/></div>
            </div>
            <div><div style={{fontSize:12,color:"var(--dm)",marginBottom:6}}>Telephone</div><input className="inp" placeholder="+212 6XX-XXXXXX" value={form.phone} onChange={e=>setF({...form,phone:e.target.value})}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><div style={{fontSize:12,color:"var(--dm)",marginBottom:6}}>Source</div><select className="inp" value={form.source} onChange={e=>setF({...form,source:e.target.value})}>{SRCO.map(s=><option key={s}>{s}</option>)}</select></div>
              <div><div style={{fontSize:12,color:"var(--dm)",marginBottom:6}}>Statut</div><select className="inp" value={form.status} onChange={e=>setF({...form,status:e.target.value})}>{Object.entries(SC).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 13px",background:"var(--nv3)",border:"1px solid var(--nb)",borderRadius:11,cursor:"pointer"}} onClick={()=>setF({...form,returnPatient:!form.returnPatient})}>
              <div style={{width:20,height:20,borderRadius:6,border:"2px solid "+(form.returnPatient?"var(--go)":"var(--nb)"),background:form.returnPatient?"var(--go)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#16110A"}}>{form.returnPatient&&<Ic n="check" s={13} sw={3}/>}</div>
              <span style={{fontSize:13,color:form.returnPatient?"var(--go)":"var(--dm)"}}>Patient fidele (deja venu)</span>
            </div>
            <div><div style={{fontSize:12,color:"var(--dm)",marginBottom:6}}>Notes</div><textarea className="inp" placeholder="Zircon, enlever facettes..." value={form.notes} onChange={e=>setF({...form,notes:e.target.value})} rows={2} style={{resize:"none"}}/></div>
            <div style={{display:"flex",gap:10}}><button className="btn2" onClick={()=>setSf(false)}>Annuler</button><button className="btn" onClick={hs}>{eid?"Enregistrer":"Ajouter"}</button></div>
          </div>
        </div>
      </div>}

      {/* MODAL PUB */}
      {spf&&(
        <div style={{position:"fixed",inset:0,background:"rgba(2,6,14,0.92)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:"var(--nv2)",borderRadius:"26px 26px 0 0",padding:"24px 20px 50px",width:"100%",maxHeight:"95vh",overflowY:"auto",borderTop:"1px solid var(--nb)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
              <div className="gg" style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>{epid?"Modifier":"Nouvelle depense pub"}</div>
              <button onClick={()=>{setSpf(false);setEpid(null);setPf(PF0);}} style={{width:32,height:32,borderRadius:10,background:"var(--nv3)",border:"1px solid var(--nb)",color:"var(--dm)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="x" s={17} sw={2.2}/></button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <div style={{fontSize:12,color:"var(--dm)",marginBottom:8,fontWeight:600}}>Libelle *</div>
                <input className="inp" placeholder="Boost Instagram Juin" value={pf.label} onChange={e=>setPf({...pf,label:e.target.value})} style={{fontSize:15}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <div style={{fontSize:12,color:"var(--dm)",marginBottom:8,fontWeight:600}}>Du *</div>
                  <input className="inp" type="date" value={pf.dateFrom} onChange={e=>setPf({...pf,dateFrom:e.target.value})}/>
                </div>
                <div>
                  <div style={{fontSize:12,color:"var(--dm)",marginBottom:8,fontWeight:600}}>Au *</div>
                  <input className="inp" type="date" value={pf.dateTo} onChange={e=>setPf({...pf,dateTo:e.target.value})}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <div style={{fontSize:12,color:"var(--dm)",marginBottom:8,fontWeight:600}}>Budget/jour *</div>
                  <input className="inp" type="number" inputMode="decimal" placeholder="5" value={pf.dailyBudget} onChange={e=>setPf({...pf,dailyBudget:e.target.value})} style={{fontSize:15}}/>
                </div>
                <div>
                  <div style={{fontSize:12,color:"var(--dm)",marginBottom:8,fontWeight:600}}>Devise</div>
                  <select className="inp" value={pf.currency} onChange={e=>setPf({...pf,currency:e.target.value})} style={{fontSize:15}}>
                    {["USD","MAD","EUR"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              {pf.dateFrom&&pf.dateTo&&+pf.dailyBudget>0&&(
                <div style={{background:"linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.04))",border:"1px solid rgba(201,168,76,0.3)",borderRadius:12,padding:"12px 16px"}}>
                  <div style={{fontSize:11,color:"rgba(201,168,76,0.7)",marginBottom:4}}>{pdays(pf)} jours de campagne</div>
                  <div style={{fontSize:18,fontWeight:900,color:"var(--gl)"}}>
                    {fmtMAD(pamad({...pf,dailyBudget:+pf.dailyBudget}))}
                  </div>
                  <div style={{fontSize:11,color:"var(--dm)",marginTop:2}}>{+pf.dailyBudget*pdays(pf)}{pf.currency} total</div>
                </div>
              )}
              <div>
                <div style={{fontSize:12,color:"var(--dm)",marginBottom:8,fontWeight:600}}>Plateforme</div>
                <select className="inp" value={pf.platform} onChange={e=>setPf({...pf,platform:e.target.value})} style={{fontSize:15}}>
                  {["Instagram Ads","Meta Ads","WhatsApp Ads","Autre"].map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:4}}>
                <button className="btn2" onClick={()=>{setSpf(false);setEpid(null);setPf(PF0);}}>Annuler</button>
                <button style={{background:pf.label&&pf.dateFrom&&pf.dateTo&&+pf.dailyBudget>0?"linear-gradient(135deg,var(--go),var(--gl))":"rgba(201,168,76,0.2)",color:pf.label&&pf.dateFrom&&pf.dateTo&&+pf.dailyBudget>0?"var(--nv)":"var(--dm)",border:"none",borderRadius:13,padding:14,fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:15,cursor:"pointer",transition:"all 0.2s"}} onClick={hps}>
                  {epid?"Enregistrer":"Ajouter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BACKUP */}
      {bk&&<div className="ov" onClick={e=>e.target===e.currentTarget&&setBk(false)}>
        <div className="sh">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div className="gg" style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>Sauvegarde</div>
            <button onClick={()=>setBk(false)} style={{width:32,height:32,borderRadius:10,background:"var(--nv3)",border:"1px solid var(--nb)",color:"var(--dm)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="x" s={17} sw={2.2}/></button>
          </div>
          <div style={{background:"var(--nv3)",border:"1px solid var(--nb)",borderRadius:13,padding:15,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Exporter mes donnees</div>
            <div style={{fontSize:12,color:"var(--dm)",marginBottom:12}}>Genere un texte a copier dans Notes ou WA.</div>
            <button className="btn" onClick={xp} style={{marginBottom:im==="__x__"?12:0}}>Generer la sauvegarde</button>
            {im==="__x__"&&<div style={{marginTop:8}}>
              <div style={{fontSize:12,color:"var(--gn)",marginBottom:8}}>Copie tout ce texte :</div>
              <textarea readOnly value={it} onFocus={e=>e.target.select()} style={{width:"100%",height:90,background:"#050D1A",border:"1px solid rgba(201,168,76,0.25)",borderRadius:10,padding:10,color:"var(--tx)",fontSize:11,fontFamily:"monospace",resize:"none"}}/>
              <button onClick={()=>{navigator.clipboard&&navigator.clipboard.writeText(it);setIm("__c__");}} style={{marginTop:8,width:"100%",background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.25)",borderRadius:10,padding:"10px",color:"var(--go)",fontWeight:700,fontSize:13,cursor:"pointer"}}>{im==="__c__"?"Copie !":"Copier tout"}</button>
            </div>}
          </div>
          <div style={{background:"var(--nv3)",border:"1px solid var(--nb)",borderRadius:13,padding:15}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Restaurer mes donnees</div>
            <div style={{fontSize:12,color:"var(--dm)",marginBottom:12}}>Colle ici le texte de ta sauvegarde.</div>
            <textarea placeholder="Colle ton JSON ici..." value={im==="__x__"||im==="__c__"?"":it} onChange={e=>{setIt(e.target.value);setIm("");}} style={{width:"100%",height:80,background:"#050D1A",border:"1px solid var(--nb)",borderRadius:10,padding:10,color:"var(--tx)",fontSize:12,fontFamily:"monospace",resize:"none",marginBottom:10}}/>
            {im&&im!=="__x__"&&im!=="__c__"&&<div style={{fontSize:13,fontWeight:600,marginBottom:10,color:im.startsWith("OK")?"var(--gn)":"var(--rd)"}}>{im}</div>}
            <button className="btn" onClick={xr} style={{opacity:(it&&im!=="__x__"&&im!=="__c__")?1:0.4}}>Restaurer les donnees</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
