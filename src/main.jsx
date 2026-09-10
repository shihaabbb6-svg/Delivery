import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  LayoutDashboard, CalendarDays, PlusCircle, Truck, Users, Settings,
  ClipboardList, AlertTriangle, LogOut, MapPin, CheckCircle2, XCircle,
  Clock3, Search, ChevronRight, RotateCcw, UserCog, PackageCheck,
  Menu, X, Edit3, Save, Ban, History, ShieldCheck
} from 'lucide-react';
import './styles.css';

const SHOWROOMS = ['AR01','AR02','AR03','AR04','AR05'];
const MAX_CAPACITY = 20;

const USERS = [
  { id:'u-admin', username:'admin', password:'admin123', name:'Shihab', role:'admin' },
  { id:'u-head', username:'head', password:'head123', name:'Delivery Head', role:'head' },
  { id:'u-sale1', username:'sale1', password:'sale123', name:'Ahmed Saleh', role:'sales' },
  { id:'u-sale2', username:'sale2', password:'sale123', name:'Mariam Ali', role:'sales' },
  { id:'u-driver1', username:'driver1', password:'driver123', name:'Driver 01', role:'driver', driverId:'d1' },
  { id:'u-driver2', username:'driver2', password:'driver123', name:'Driver 02', role:'driver', driverId:'d2' },
  { id:'u-driver3', username:'driver3', password:'driver123', name:'Driver 03', role:'driver', driverId:'d3' },
  { id:'u-driver4', username:'driver4', password:'driver123', name:'Driver 04', role:'driver', driverId:'d4' },
  { id:'u-driver5', username:'driver5', password:'driver123', name:'Driver 05', role:'driver', driverId:'d5' },
];

const DRIVERS = [
  { id:'d1', name:'Driver 01', truck:'Truck 01' },
  { id:'d2', name:'Driver 02', truck:'Truck 02' },
  { id:'d3', name:'Driver 03', truck:'Truck 03' },
  { id:'d4', name:'Driver 04', truck:'Truck 04' },
  { id:'d5', name:'Driver 05', truck:'Truck 05' },
];

const areaGroups = [
  ['Salmiya','Rumaithiya','Salwa','Bidaa'],
  ['Hawally','Jabriya','Shaab','Maidan Hawally'],
  ['Surra','Qadsiya','Yarmouk','Shamiya','Kaifan'],
  ['Egaila','Fintas','Mahboula','Abu Halifa','Mangaf'],
  ['Jaber Al Ahmad','Saad Al Abdullah','Doha','Sulaibikhat'],
  ['Khaitan','Farwaniya','Jleeb','Ardiya'],
];

const seedDeliveries = [
  {id:'del-001', invoiceDate:'2026-09-09', invoiceNo:'124159', customer:'Noura Al-Salem', showroom:'AR03', salesperson:'Ahmed Saleh', salespersonId:'u-sale1', address:'Salmiya', deliveryDate:'2026-09-11', requestedTime:'Before 1 PM', remarks:'Big tree, plantation required', location:'https://maps.google.com/?q=Salmiya+Kuwait', status:'scheduled', driverId:null, truck:null, history:[]},
  {id:'del-002', invoiceDate:'2026-09-09', invoiceNo:'124160', customer:'Yousef Al-Essa', showroom:'AR01', salesperson:'Mariam Ali', salespersonId:'u-sale2', address:'Rumaithiya', deliveryDate:'2026-09-11', requestedTime:'Morning', remarks:'', location:'', status:'scheduled', driverId:null, truck:null, history:[]},
  {id:'del-003', invoiceDate:'2026-09-09', invoiceNo:'124161', customer:'Dana Al-Awadhi', showroom:'AR05', salesperson:'Ahmed Saleh', salespersonId:'u-sale1', address:'Egaila', deliveryDate:'2026-09-11', requestedTime:'12 PM to 6 PM', remarks:'Customer requested careful handling', location:'', status:'scheduled', driverId:null, truck:null, history:[]},
  {id:'del-004', invoiceDate:'2026-09-09', invoiceNo:'124162', customer:'Fahad Al-Rashid', showroom:'AR02', salesperson:'Mariam Ali', salespersonId:'u-sale2', address:'Hawally', deliveryDate:'2026-09-11', requestedTime:'Any time', remarks:'', location:'https://maps.google.com/?q=Hawally+Kuwait', status:'scheduled', driverId:null, truck:null, history:[]},
  {id:'del-005', invoiceDate:'2026-09-08', invoiceNo:'124148', customer:'Maha Al-Otaibi', showroom:'AR04', salesperson:'Ahmed Saleh', salespersonId:'u-sale1', address:'Surra', deliveryDate:'2026-09-10', requestedTime:'Before 6 PM', remarks:'', location:'', status:'assigned', driverId:'d1', truck:'Truck 01', history:[]},
  {id:'del-006', invoiceDate:'2026-09-08', invoiceNo:'124149', customer:'Ali Al-Mutairi', showroom:'AR02', salesperson:'Mariam Ali', salespersonId:'u-sale2', address:'Qadsiya', deliveryDate:'2026-09-10', requestedTime:'Morning', remarks:'Planting required', location:'https://maps.google.com/?q=Qadsiya+Kuwait', status:'assigned', driverId:'d1', truck:'Truck 01', history:[]},
  {id:'del-007', invoiceDate:'2026-09-08', invoiceNo:'124150', customer:'Sara Al-Hamad', showroom:'AR01', salesperson:'Ahmed Saleh', salespersonId:'u-sale1', address:'Salwa', deliveryDate:'2026-09-10', requestedTime:'After 4 PM', remarks:'', location:'', status:'assigned', driverId:'d2', truck:'Truck 02', history:[]},
];

const roleLabel = {admin:'Admin', head:'Delivery Head', sales:'Salesperson', driver:'Driver'};
const statusLabel = {
  scheduled:'Scheduled', assigned:'Driver Assigned', delivered:'Delivered',
  could_not_deliver:'Could Not Deliver', incomplete:'Couldn\'t Complete Delivery',
  rescheduled:'Rescheduled', cancelled:'Cancelled'
};

function todayStr(){ return new Date().toISOString().slice(0,10); }
function addDaysStr(days){ const d=new Date(); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); }
function formatDate(v){ if(!v) return ''; return new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(v+'T00:00:00')); }
function nowStamp(){ return new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}); }

function nearestAreas(area){
  const g = areaGroups.find(group => group.includes(area));
  return g ? g.filter(a=>a!==area) : [];
}

function App(){
  const [currentUser,setCurrentUser] = useState(null);
  const [deliveries,setDeliveries] = useState(()=>JSON.parse(localStorage.getItem('hg-deliveries')||'null') || seedDeliveries);
  const [page,setPage] = useState('dashboard');
  const [mobileNav,setMobileNav] = useState(false);
  const [selectedDate,setSelectedDate] = useState(addDaysStr(1));
  const [toast,setToast] = useState('');

  const updateDeliveries = (next) => {
    setDeliveries(next); localStorage.setItem('hg-deliveries', JSON.stringify(next));
  };
  const flash = (m)=>{setToast(m); setTimeout(()=>setToast(''),2200)};

  if(!currentUser) return <Login onLogin={(u)=>{setCurrentUser(u); setPage(u.role==='driver'?'today':'dashboard')}} />;

  const logout=()=>{setCurrentUser(null);setPage('dashboard')};
  const commonProps={currentUser,deliveries,updateDeliveries,flash,selectedDate,setSelectedDate,setPage};

  let content;
  if(page==='dashboard') content=<Dashboard {...commonProps}/>;
  if(page==='schedule') content=<Schedule {...commonProps}/>;
  if(page==='my-deliveries') content=<MyDeliveries {...commonProps}/>;
  if(page==='calendar') content=<CalendarView {...commonProps}/>;
  if(page==='assignment') content=<Assignment {...commonProps}/>;
  if(page==='all-deliveries') content=<AllDeliveries {...commonProps}/>;
  if(page==='action') content=<ActionRequired {...commonProps}/>;
  if(page==='today') content=<DriverToday {...commonProps}/>;
  if(page==='history') content=<DriverHistory {...commonProps}/>;
  if(page==='users') content=<UsersPage/>;
  if(page==='settings') content=<SettingsPage/>;

  const nav = navFor(currentUser.role);
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?'open':''}`}>
      <div className="brand"><div className="brand-mark">H&G</div><div><strong>Delivery Hub</strong><span>Prototype</span></div></div>
      <nav>{nav.map(item=><button key={item.id} className={page===item.id?'active':''} onClick={()=>{setPage(item.id);setMobileNav(false)}}>{item.icon}<span>{item.label}</span></button>)}</nav>
      <div className="sidebar-user"><div className="avatar">{currentUser.name[0]}</div><div><strong>{currentUser.name}</strong><span>{roleLabel[currentUser.role]}</span></div><button className="icon-btn" onClick={logout} title="Logout"><LogOut size={17}/></button></div>
    </aside>
    <main className="main">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setMobileNav(!mobileNav)}>{mobileNav?<X/>:<Menu/>}</button><div><span className="eyebrow">Home&Garden</span><h1>{nav.find(n=>n.id===page)?.label || 'Delivery Hub'}</h1></div><div className="role-chip">{roleLabel[currentUser.role]}</div></header>
      <section className="content">{content}</section>
    </main>
    {toast && <div className="toast">{toast}</div>}
  </div>
}

function navFor(role){
  const I=(C)=><C size={18}/>;
  if(role==='sales') return [
    {id:'dashboard',label:'Dashboard',icon:I(LayoutDashboard)},
    {id:'schedule',label:'Schedule Delivery',icon:I(PlusCircle)},
    {id:'my-deliveries',label:'My Deliveries',icon:I(ClipboardList)},
    {id:'calendar',label:'Delivery Calendar',icon:I(CalendarDays)},
  ];
  if(role==='driver') return [
    {id:'today',label:"Today's Deliveries",icon:I(Truck)},
    {id:'history',label:'History',icon:I(History)},
  ];
  if(role==='head') return [
    {id:'dashboard',label:'Operations Dashboard',icon:I(LayoutDashboard)},
    {id:'assignment',label:'Driver Assignment',icon:I(Truck)},
    {id:'all-deliveries',label:'All Deliveries',icon:I(ClipboardList)},
    {id:'calendar',label:'Calendar',icon:I(CalendarDays)},
    {id:'action',label:'Action Required',icon:I(AlertTriangle)},
  ];
  return [
    {id:'dashboard',label:'Dashboard',icon:I(LayoutDashboard)},
    {id:'schedule',label:'Schedule Delivery',icon:I(PlusCircle)},
    {id:'all-deliveries',label:'All Deliveries',icon:I(ClipboardList)},
    {id:'calendar',label:'Calendar',icon:I(CalendarDays)},
    {id:'assignment',label:'Driver Assignment',icon:I(Truck)},
    {id:'action',label:'Action Required',icon:I(AlertTriangle)},
    {id:'users',label:'Users',icon:I(Users)},
    {id:'settings',label:'Settings',icon:I(Settings)},
  ];
}

function Login({onLogin}){
  const [username,setUsername]=useState('admin'); const [password,setPassword]=useState('admin123'); const [error,setError]=useState('');
  const submit=(e)=>{e.preventDefault(); const u=USERS.find(x=>x.username===username&&x.password===password); if(u) onLogin(u); else setError('Invalid username or password')};
  return <div className="login-wrap"><div className="login-panel"><div className="login-brand">H&G</div><span className="eyebrow">Home&Garden</span><h1>Delivery Hub</h1><p>Internal delivery scheduling prototype</p><form onSubmit={submit}><label>Username<input value={username} onChange={e=>setUsername(e.target.value)} /></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>{error&&<div className="form-error">{error}</div>}<button className="primary" type="submit">Sign in</button></form><div className="demo-box"><strong>Demo accounts</strong><span>Admin: admin / admin123</span><span>Head: head / head123</span><span>Sales: sale1 / sale123</span><span>Driver: driver1 / driver123</span></div></div></div>
}

function Dashboard({currentUser,deliveries,setPage}){
  const today=todayStr();
  if(currentUser.role==='sales'){
    const mine=deliveries.filter(d=>d.salespersonId===currentUser.id);
    return <><div className="stat-grid"><Stat label="My upcoming" value={mine.filter(d=>d.deliveryDate>=today&&!['delivered','cancelled'].includes(d.status)).length}/><Stat label="Delivered" value={mine.filter(d=>d.status==='delivered').length}/><Stat label="Needs attention" value={mine.filter(d=>['could_not_deliver','incomplete'].includes(d.status)).length}/><Stat label="Tomorrow capacity" value={`${deliveries.filter(d=>d.deliveryDate===addDaysStr(1)&&d.status!=='cancelled').length}/${MAX_CAPACITY}`}/></div><Section title="Upcoming deliveries" action={<button className="link-btn" onClick={()=>setPage('my-deliveries')}>View all <ChevronRight size={16}/></button>}><DeliveryTable rows={mine.filter(d=>d.deliveryDate>=today).slice(0,6)} compact/></Section></>
  }
  const todayRows=deliveries.filter(d=>d.deliveryDate===today);
  const attention=deliveries.filter(d=>['could_not_deliver','incomplete'].includes(d.status));
  return <><div className="stat-grid"><Stat label="Today's deliveries" value={todayRows.length}/><Stat label="Assigned" value={todayRows.filter(d=>d.driverId).length}/><Stat label="Delivered" value={todayRows.filter(d=>d.status==='delivered').length}/><Stat label="Action required" value={attention.length} warn={attention.length>0}/></div><div className="two-col"><Section title="Driver progress"><DriverProgress deliveries={todayRows}/></Section><Section title="Operational snapshot"><div className="snapshot"><div><span>Tomorrow booked</span><strong>{deliveries.filter(d=>d.deliveryDate===addDaysStr(1)&&d.status!=='cancelled').length} / {MAX_CAPACITY}</strong></div><div><span>Unassigned tomorrow</span><strong>{deliveries.filter(d=>d.deliveryDate==='2026-09-11'&&!d.driverId&&d.status!=='cancelled').length}</strong></div><div><span>Location pending</span><strong>{deliveries.filter(d=>!d.location&&d.status!=='cancelled').length}</strong></div></div></Section></div></>
}
function Stat({label,value,warn}){return <div className={`stat-card ${warn?'warn':''}`}><span>{label}</span><strong>{value}</strong></div>}
function Section({title,action,children}){return <div className="section"><div className="section-head"><h2>{title}</h2>{action}</div>{children}</div>}

function Schedule({currentUser,deliveries,updateDeliveries,flash,selectedDate,setSelectedDate}){
  const [form,setForm]=useState({invoiceDate:todayStr(),invoiceNo:'',customer:'',showroom:'AR01',address:'',deliveryDate:selectedDate,requestedTime:'',remarks:'',location:''});
  const booked=deliveries.filter(d=>d.deliveryDate===form.deliveryDate&&d.status!=='cancelled');
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=(e)=>{e.preventDefault(); if(booked.length>=MAX_CAPACITY){flash('This delivery date is already full.');return;} const sales = currentUser.role==='sales'?currentUser:USERS.find(u=>u.role==='sales'); const n={...form,id:'del-'+Date.now(),salesperson:sales?.name||currentUser.name,salespersonId:sales?.id||currentUser.id,status:'scheduled',driverId:null,truck:null,history:[{at:nowStamp(),text:`Delivery scheduled by ${currentUser.name}`}]} ; updateDeliveries([...deliveries,n]); flash('Delivery scheduled successfully'); setForm(f=>({...f,invoiceNo:'',customer:'',address:'',requestedTime:'',remarks:'',location:''}));};
  return <div className="schedule-layout"><Section title="Create delivery request"><form className="delivery-form" onSubmit={submit}><div className="form-grid"><label>Invoice Date<input type="date" value={form.invoiceDate} onChange={e=>set('invoiceDate',e.target.value)} required/></label><label>Invoice Number<input value={form.invoiceNo} onChange={e=>set('invoiceNo',e.target.value)} placeholder="e.g. 124163" required/></label><label className="span2">Customer Name<input value={form.customer} onChange={e=>set('customer',e.target.value)} required/></label><label>Showroom<select value={form.showroom} onChange={e=>set('showroom',e.target.value)}>{SHOWROOMS.map(s=><option key={s}>{s}</option>)}</select></label><label>Sales Person<input value={currentUser.role==='sales'?currentUser.name:'Admin entry'} readOnly/></label><label>Address / Area<input value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Salmiya" required/></label><label>Delivery Date<input type="date" value={form.deliveryDate} onChange={e=>{set('deliveryDate',e.target.value);setSelectedDate(e.target.value)}} required/></label><label>Customer Requested Time<input value={form.requestedTime} onChange={e=>set('requestedTime',e.target.value)} placeholder="Before 1 PM / Morning / Any time"/></label><label>Google Maps Location <span className="optional">Optional</span><input value={form.location} onChange={e=>set('location',e.target.value)} placeholder="https://maps.google.com/..."/></label><label className="span2">Remarks<textarea rows="3" value={form.remarks} onChange={e=>set('remarks',e.target.value)} placeholder="Big tree, plantation required..."/></label></div><button className="primary" disabled={booked.length>=MAX_CAPACITY}>{booked.length>=MAX_CAPACITY?'Date Full':'Schedule Delivery'}</button></form></Section><aside><CapacityCard date={form.deliveryDate} booked={booked.length}/><Section title={`Scheduled on ${formatDate(form.deliveryDate)}`}><div className="mini-list">{booked.length===0?<Empty text="No deliveries yet"/>:booked.map(d=><div className="mini-row" key={d.id}><div><strong>{d.address}</strong><span>{d.customer} · {d.showroom}</span></div><span className="muted">{d.requestedTime||'No requested time'}</span></div>)}</div></Section></aside></div>
}
function CapacityCard({date,booked}){const pct=Math.min(100,(booked/MAX_CAPACITY)*100);return <div className={`capacity-card ${booked>=MAX_CAPACITY?'full':''}`}><div><span>Daily capacity</span><strong>{booked} / {MAX_CAPACITY}</strong></div><div className="bar"><i style={{width:pct+'%'}}/></div><p>{booked>=MAX_CAPACITY?'Full — no slots available':`${MAX_CAPACITY-booked} slots available`} · {formatDate(date)}</p></div>}

function MyDeliveries({currentUser,deliveries,updateDeliveries,flash}){
  const mine=deliveries.filter(d=>d.salespersonId===currentUser.id); return <DeliveryManager rows={mine} deliveries={deliveries} updateDeliveries={updateDeliveries} flash={flash} canEditFuture/>
}
function AllDeliveries({deliveries,updateDeliveries,flash,currentUser}){return <DeliveryManager rows={deliveries} deliveries={deliveries} updateDeliveries={updateDeliveries} flash={flash} fullAccess={['admin','head'].includes(currentUser.role)}/>}

function DeliveryManager({rows,deliveries,updateDeliveries,flash,fullAccess,canEditFuture}){
  const [q,setQ]=useState(''); const [editing,setEditing]=useState(null);
  const filtered=rows.filter(d=>`${d.invoiceNo} ${d.customer} ${d.address} ${d.salesperson}`.toLowerCase().includes(q.toLowerCase()));
  const saveEdit=(draft)=>{const old=deliveries.find(d=>d.id===draft.id); if(old.deliveryDate!==draft.deliveryDate){const count=deliveries.filter(d=>d.deliveryDate===draft.deliveryDate&&d.id!==draft.id&&d.status!=='cancelled').length;if(count>=MAX_CAPACITY){flash('New date is full.');return;}}
    updateDeliveries(deliveries.map(d=>d.id===draft.id?{...draft,history:[...(draft.history||[]),{at:nowStamp(),text:'Delivery details updated'}]}:d)); setEditing(null); flash('Delivery updated');};
  return <><div className="toolbar"><div className="searchbox"><Search size={17}/><input placeholder="Search invoice, customer, area or salesperson" value={q} onChange={e=>setQ(e.target.value)}/></div></div><Section title={`${filtered.length} deliveries`}><DeliveryTable rows={filtered} onOpen={(d)=>setEditing(d)}/></Section>{editing&&<EditModal delivery={editing} onClose={()=>setEditing(null)} onSave={saveEdit} fullAccess={fullAccess} canEditFuture={canEditFuture}/>}</>
}

function DeliveryTable({rows,onOpen,compact}){return <div className="table-wrap"><table><thead><tr><th>Invoice</th><th>Customer</th><th>Showroom</th><th>Sales</th><th>Area</th><th>Delivery Date</th><th>Requested Time</th><th>Status</th>{onOpen&&<th></th>}</tr></thead><tbody>{rows.map(d=><tr key={d.id}><td>#{d.invoiceNo}</td><td><strong>{d.customer}</strong>{!d.location&&<span className="pending"><MapPin size={12}/> Location Pending</span>}</td><td>{d.showroom}</td><td>{d.salesperson}</td><td>{d.address}</td><td>{formatDate(d.deliveryDate)}</td><td>{d.requestedTime||'—'}</td><td><Status s={d.status}/></td>{onOpen&&<td><button className="icon-btn" onClick={()=>onOpen(d)}><ChevronRight size={18}/></button></td>}</tr>)}{rows.length===0&&<tr><td colSpan="9"><Empty text="No deliveries found"/></td></tr>}</tbody></table></div>}
function Status({s}){return <span className={`status ${s}`}>{statusLabel[s]||s}</span>}

function CalendarView({deliveries,setSelectedDate,setPage,currentUser}){
  const days=Array.from({length:14},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return d.toISOString().slice(0,10)});
  return <Section title="Delivery capacity — next 14 days"><div className="calendar-grid">{days.map(date=>{const count=deliveries.filter(d=>d.deliveryDate===date&&d.status!=='cancelled').length;return <button className={`day-card ${count>=MAX_CAPACITY?'full':''}`} key={date} onClick={()=>{setSelectedDate(date); if(currentUser.role==='sales'||currentUser.role==='admin')setPage('schedule')}}><span>{new Intl.DateTimeFormat('en-GB',{weekday:'short'}).format(new Date(date+'T00:00:00'))}</span><strong>{new Date(date+'T00:00:00').getDate()}</strong><em>{count}/{MAX_CAPACITY} booked</em></button>})}</div></Section>
}

function Assignment({deliveries,updateDeliveries,flash}){
  const [date,setDate]=useState(todayStr()); const rows=deliveries.filter(d=>d.deliveryDate===date&&d.status!=='cancelled'); const unassigned=rows.filter(d=>!d.driverId);
  const assign=(delivery,driver)=>{updateDeliveries(deliveries.map(d=>d.id===delivery.id?{...d,driverId:driver.id,truck:driver.truck,status:'assigned',history:[...(d.history||[]),{at:nowStamp(),text:`Assigned to ${driver.name} / ${driver.truck}`}]}:d));flash(`Assigned to ${driver.name}`)};
  const suggestFor=(driver)=>{const assigned=rows.filter(d=>d.driverId===driver.id); const areas=[...new Set(assigned.map(d=>d.address))]; const nearby=new Set(areas.flatMap(a=>nearestAreas(a))); return unassigned.filter(d=>areas.includes(d.address)||nearby.has(d.address)).slice(0,4)};
  return <><div className="toolbar"><label className="inline-date">Delivery date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><span className="muted">Requested times are shown for reference only and are not used in suggestions.</span></div><div className="assignment-layout"><Section title={`Unassigned (${unassigned.length})`}><div className="cards-list">{unassigned.map(d=><div className="delivery-card" key={d.id}><div><div className="card-top"><strong>{d.address}</strong><span>#{d.invoiceNo}</span></div><h3>{d.customer}</h3><p>{d.showroom} · {d.salesperson}</p><p className="muted"><Clock3 size={14}/> {d.requestedTime||'No requested time'} · Not guaranteed</p>{!d.location&&<span className="pending"><MapPin size={12}/> Location Pending</span>}</div><select defaultValue="" onChange={e=>{const dr=DRIVERS.find(x=>x.id===e.target.value); if(dr)assign(d,dr); e.target.value=''}}><option value="">Assign driver...</option>{DRIVERS.map(dr=><option value={dr.id} key={dr.id}>{dr.name} · {dr.truck}</option>)}</select></div>)}{unassigned.length===0&&<Empty text="Everything is assigned"/>}</div></Section><div className="driver-columns">{DRIVERS.map(dr=>{const assigned=rows.filter(d=>d.driverId===dr.id);const sug=suggestFor(dr);return <div className="driver-panel" key={dr.id}><div className="driver-head"><div><strong>{dr.name}</strong><span>{dr.truck}</span></div><b>{assigned.length}</b></div><div className="driver-jobs">{assigned.map(d=><div className="driver-job" key={d.id}><strong>{d.address}</strong><span>{d.customer}</span></div>)}{assigned.length===0&&<span className="muted">No deliveries assigned</span>}</div>{assigned.length>0&&sug.length>0&&<div className="suggestions"><span>Suggested nearby</span>{sug.map(d=><button key={d.id} onClick={()=>assign(d,dr)}><MapPin size={13}/>{d.address} · {d.customer}<PlusCircle size={14}/></button>)}</div>}</div>})}</div></div></>
}

function DriverToday({currentUser,deliveries,updateDeliveries,flash}){
  const date=todayStr(); const rows=deliveries.filter(d=>d.deliveryDate===date&&d.driverId===currentUser.driverId&&d.status!=='cancelled'); const remaining=rows.filter(d=>!['delivered','could_not_deliver','incomplete'].includes(d.status));
  const complete=(d,status,reason)=>{updateDeliveries(deliveries.map(x=>x.id===d.id?{...x,status,outcomeReason:reason||'',completedAt:nowStamp(),history:[...(x.history||[]),{at:nowStamp(),text:`Driver marked ${statusLabel[status]}${reason?`: ${reason}`:''}`}]}:x));flash(statusLabel[status]);}
  return <><div className="driver-summary"><div><span>Today's route</span><strong>{rows.length} Assigned · {rows.filter(d=>d.status==='delivered').length} Delivered · {remaining.length} Remaining</strong></div></div><div className="driver-mobile-list">{rows.map((d,i)=><DriverCard key={d.id} d={d} index={i+1} onComplete={complete}/>)}</div></>
}
function DriverCard({d,index,onComplete}){const [action,setAction]=useState(null);const [reason,setReason]=useState('');const done=['delivered','could_not_deliver','incomplete'].includes(d.status); const reasons=action==='could_not_deliver'?['Customer unavailable','Customer requested reschedule','Wrong/incomplete location','Could not contact customer','Other']:['Unexpected issue from our side','Installation/plantation could not be completed','Missing item / incomplete order','Vehicle or equipment issue','Other']; return <div className={`driver-mobile-card ${done?'done':''}`}><div className="stop-no">{index}</div><div className="driver-card-body"><div className="card-top"><strong>{d.customer}</strong><Status s={d.status}/></div><h3>{d.address}</h3><p>Invoice #{d.invoiceNo} · {d.showroom}</p><p><Clock3 size={14}/> Requested: {d.requestedTime||'—'} <span className="muted">(Not guaranteed)</span></p>{d.remarks&&<div className="remark">{d.remarks}</div>}{d.location?<a className="secondary btn-like" href={d.location} target="_blank" rel="noreferrer"><MapPin size={16}/>Open Location</a>:<div className="pending big"><MapPin size={15}/>Location Pending</div>}{!done&&!action&&<div className="outcome-grid"><button className="success" onClick={()=>onComplete(d,'delivered','')}><CheckCircle2 size={17}/>Delivered</button><button className="danger" onClick={()=>setAction('could_not_deliver')}><XCircle size={17}/>Could Not Deliver</button><button className="warning" onClick={()=>setAction('incomplete')}><AlertTriangle size={17}/>Couldn't Complete</button></div>}{action&&<div className="reason-box"><strong>{action==='could_not_deliver'?'Why could it not be delivered?':'Why could it not be completed?'}</strong><select value={reason} onChange={e=>setReason(e.target.value)}><option value="">Select reason...</option>{reasons.map(r=><option key={r}>{r}</option>)}</select>{reason==='Other'&&<textarea placeholder="Enter a short reason" rows="2" onChange={e=>setReason('Other: '+e.target.value)}/>}<div className="row-actions"><button className="secondary" onClick={()=>{setAction(null);setReason('')}}>Back</button><button className="primary" disabled={!reason} onClick={()=>onComplete(d,action,reason)}>Confirm</button></div></div>}{done&&d.outcomeReason&&<div className="result-note"><strong>Reason:</strong> {d.outcomeReason}</div>}</div></div>}
function DriverHistory({currentUser,deliveries}){const rows=deliveries.filter(d=>d.driverId===currentUser.driverId&&['delivered','could_not_deliver','incomplete'].includes(d.status));return <Section title="Delivery history"><DeliveryTable rows={rows}/></Section>}

function ActionRequired({deliveries,updateDeliveries,flash}){const rows=deliveries.filter(d=>['could_not_deliver','incomplete'].includes(d.status));const reschedule=(d,newDate)=>{if(!newDate)return;const count=deliveries.filter(x=>x.deliveryDate===newDate&&x.status!=='cancelled').length;if(count>=MAX_CAPACITY){flash('Selected date is full');return;}updateDeliveries(deliveries.map(x=>x.id===d.id?{...x,deliveryDate:newDate,status:'rescheduled',driverId:null,truck:null,history:[...(x.history||[]),{at:nowStamp(),text:`Rescheduled to ${formatDate(newDate)}`}]}:x));flash('Delivery rescheduled');};return <Section title={`Action required (${rows.length})`}><div className="cards-list">{rows.map(d=><div className="action-card" key={d.id}><div><Status s={d.status}/><h3>{d.customer} · {d.address}</h3><p>Invoice #{d.invoiceNo} · {d.salesperson}</p><div className="result-note"><strong>Reason:</strong> {d.outcomeReason||'No reason recorded'}</div></div><div className="action-controls"><input type="date" id={'date-'+d.id}/><button className="primary" onClick={()=>reschedule(d,document.getElementById('date-'+d.id).value)}><RotateCcw size={15}/>Reschedule</button></div></div>)}{rows.length===0&&<Empty text="No deliveries need attention"/>}</div></Section>}

function EditModal({delivery,onClose,onSave,fullAccess,canEditFuture}){const [d,setD]=useState({...delivery});const editable=fullAccess || (canEditFuture && d.deliveryDate>=todayStr());const set=(k,v)=>setD(x=>({...x,[k]:v}));return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><span className="eyebrow">Delivery #{d.invoiceNo}</span><h2>{d.customer}</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div><div className="form-grid"><label>Invoice Date<input type="date" disabled={!editable} value={d.invoiceDate} onChange={e=>set('invoiceDate',e.target.value)}/></label><label>Invoice Number<input disabled={!editable} value={d.invoiceNo} onChange={e=>set('invoiceNo',e.target.value)}/></label><label>Customer<input disabled={!editable} value={d.customer} onChange={e=>set('customer',e.target.value)}/></label><label>Showroom<select disabled={!editable} value={d.showroom} onChange={e=>set('showroom',e.target.value)}>{SHOWROOMS.map(s=><option key={s}>{s}</option>)}</select></label><label>Address / Area<input disabled={!editable} value={d.address} onChange={e=>set('address',e.target.value)}/></label><label>Delivery Date<input type="date" disabled={!editable} value={d.deliveryDate} onChange={e=>set('deliveryDate',e.target.value)}/></label><label>Requested Time<input disabled={!editable} value={d.requestedTime||''} onChange={e=>set('requestedTime',e.target.value)}/></label><label>Location<input disabled={!editable} value={d.location||''} onChange={e=>set('location',e.target.value)}/></label><label className="span2">Remarks<textarea disabled={!editable} rows="3" value={d.remarks||''} onChange={e=>set('remarks',e.target.value)}/></label>{fullAccess&&<label>Status<select value={d.status} onChange={e=>set('status',e.target.value)}>{Object.entries(statusLabel).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>}</div><div className="timeline"><h3>Activity history</h3>{(d.history||[]).length===0?<span className="muted">No activity yet</span>:[...(d.history||[])].reverse().map((h,i)=><div className="timeline-row" key={i}><i/><div><strong>{h.text}</strong><span>{h.at}</span></div></div>)}</div><div className="modal-actions"><button className="secondary" onClick={onClose}>Close</button>{editable&&<button className="primary" onClick={()=>onSave(d)}><Save size={16}/>Save changes</button>}</div></div></div>}

function UsersPage(){return <Section title="User management (prototype)"><div className="user-list">{USERS.map(u=><div className="user-row" key={u.id}><div className="avatar">{u.name[0]}</div><div><strong>{u.name}</strong><span>@{u.username}</span></div><StatusRole role={u.role}/><button className="secondary"><UserCog size={15}/>Manage</button></div>)}</div><p className="muted footnote">Prototype only: account creation/reset/deactivation will be connected to real authentication in production.</p></Section>}
function StatusRole({role}){return <span className="role-pill">{roleLabel[role]}</span>}
function SettingsPage(){return <div className="two-col"><Section title="Delivery settings"><div className="settings-form"><label>Daily capacity<input value="20" readOnly/></label><label>Showrooms<input value="AR01, AR02, AR03, AR04, AR05" readOnly/></label></div></Section><Section title="Prototype rules"><div className="rules"><p><ShieldCheck/>One delivery always consumes one slot.</p><p><ShieldCheck/>Requested time is informational only.</p><p><ShieldCheck/>Admin can override operational data.</p><p><ShieldCheck/>Delivery Head has full delivery control.</p></div></Section></div>}

function DriverProgress({deliveries}){return <div className="progress-list">{DRIVERS.map(dr=>{const jobs=deliveries.filter(d=>d.driverId===dr.id);const done=jobs.filter(d=>d.status==='delivered').length;return <div className="progress-row" key={dr.id}><div><strong>{dr.name}</strong><span>{dr.truck}</span></div><div className="progress-meta"><span>{done}/{jobs.length} delivered</span><div className="mini-bar"><i style={{width:(jobs.length?done/jobs.length*100:0)+'%'}}/></div></div></div>})}</div>}
function Empty({text}){return <div className="empty"><PackageCheck size={30}/><span>{text}</span></div>}

createRoot(document.getElementById('root')).render(<App/>);
