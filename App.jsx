import React, { useMemo, useRef, useState } from 'react';

const initialPeople = [
  { name: 'Ana', relation: 'Sua filha', phone: '+5511999991111', photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=120&q=80' },
  { name: 'Carlos', relation: 'Seu filho', phone: '+5511999992222', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
];
const initialTasks = [
  { id: 1, title: 'Tomar o café da manhã', time: '8:00', done: true, icon: '☕' },
  { id: 2, title: 'Tomar o remédio da manhã', time: '9:00', done: false, icon: '💊' },
  { id: 3, title: 'Regar as plantas', time: '10:30', done: false, icon: '🌱' },
  { id: 4, title: 'Almoçar', time: '12:00', done: false, icon: '🍲' },
];
const initialMemories = [
  { id: 'm1', name: 'Ana e mamãe', description: 'Um domingo gostoso no jardim, no último verão.', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=85', date: 'Verão de 2025' },
  { id: 'm2', name: 'Nosso almoço em família', description: 'Todo mundo junto para comemorar o aniversário do Carlos.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=85', date: 'Junho de 2025' },
  { id: 'm3', name: 'Um passeio especial', description: 'Uma tarde de sol e muitas histórias para contar.', image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=85', date: 'Maio de 2025' },
];
const quizQuestions = [
  { question: 'Qual é a estação em que as flores costumam desabrochar?', options: ['Inverno', 'Primavera', 'Outono'], answer: 1 },
  { question: 'Qual destes animais gosta de miar?', options: ['Cachorro', 'Gato', 'Passarinho'], answer: 1 },
  { question: 'O que usamos para nos proteger da chuva?', options: ['Guarda-chuva', 'Óculos de sol', 'Chapéu de festa'], answer: 0 },
];
const stored = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const normalizeEmail = email => email.trim().toLowerCase();
async function passwordHash(password) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function Icon({ name, size = 21 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8"/></>,
    brain: <><path d="M12 18V5"/><path d="M9 7a3 3 0 0 1 6 0c2 .2 3 1.6 3 3.3a3 3 0 0 1-1 5.7c-.2 2-1.6 3-3.5 3H12"/><path d="M12 7a3 3 0 0 0-6 0c-2 .2-3 1.6-3 3.3a3 3 0 0 0 1 5.7c.2 2 1.6 3 3.5 3H12"/></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1z"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow: <><path d="M5 12h14M12 5l7 7-7 7"/></>,
    camera: <><path d="M14 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-2-2z"/><circle cx="12" cy="13" r="3"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function PasswordInput({ id, value, onChange, autoComplete, minLength, placeholder, required = false, ariaLabel }) {
  const [visible, setVisible] = useState(false);
  return <span className="password-field">
    <input id={id} type={visible ? 'text' : 'password'} autoComplete={autoComplete} minLength={minLength} value={value} onChange={onChange} placeholder={placeholder} required={required} aria-label={ariaLabel} />
    <button type="button" className="password-toggle" onClick={() => setVisible(current => !current)} aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={visible} title={visible ? 'Ocultar senha' : 'Mostrar senha'}>
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {visible ? <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></> : <><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a15.7 15.7 0 0 1-3.1 3.9M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8"/></>}
      </svg>
    </button>
  </span>;
}

function App() {
  const [tab, setTab] = useState('inicio');
  const [tasks, setTasks] = useState(() => stored('mv-tasks', initialTasks));
  const [memories, setMemories] = useState(() => stored('mv-memories', initialMemories));
  const [people, setPeople] = useState(() => stored('mv-people', initialPeople));
  const [helpOpen, setHelpOpen] = useState(false);
  const [accounts, setAccounts] = useState(() => stored('mv-accounts', []));
  const [activeAccountId, setActiveAccountId] = useState(() => stored('mv-session', null));
  const activeAccount = accounts.find(account => account.id === activeAccountId) ?? null;
  const familyMode = activeAccount?.type === 'family';
  const linkedPatient = accounts.find(account => account.id === activeAccount?.patientId) ?? null;
  const [authMode, setAuthMode] = useState('family-login');
  const [authError, setAuthError] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [familyEmail, setFamilyEmail] = useState('');
  const [familyPassword, setFamilyPassword] = useState('');
  const [includePatient, setIncludePatient] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPassword, setPatientPassword] = useState('');
  const [patientRelation, setPatientRelation] = useState('');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('15:00');
  const [personName, setPersonName] = useState('');
  const [personRelation, setPersonRelation] = useState('');
  const [personPhone, setPersonPhone] = useState('');
  const [editingContactIndex, setEditingContactIndex] = useState(null);
  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryDescription, setMemoryDescription] = useState('');
  const [memoryImage, setMemoryImage] = useState('');
  const [editingMemoryId, setEditingMemoryId] = useState(null);
  const [notice, setNotice] = useState('');
  const photoInput = useRef(null);
  const doneCount = tasks.filter(task => task.done).length;
  const todayLabel = useMemo(() => new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()), []);

  function persist(key, value, setter) { setter(value); localStorage.setItem(key, JSON.stringify(value)); }
  function toggleTask(id) { persist('mv-tasks', tasks.map(task => task.id === id ? { ...task, done: !task.done } : task), setTasks); }
  function addTask(event) {
    event.preventDefault();
    if (!newTask.trim()) return;
    persist('mv-tasks', [...tasks, { id: Date.now(), title: newTask.trim(), time: newTaskTime, done: false, icon: '✨' }], setTasks);
    setNewTask(''); setNotice('Afazer adicionado com carinho.');
  }
  function addMemory(event) {
    event.preventDefault();
    if (!memoryTitle.trim() || !memoryImage) return;
    if (editingMemoryId !== null) {
      const updatedMemories = memories.map(memory => memory.id === editingMemoryId
        ? { ...memory, name: memoryTitle.trim(), description: memoryDescription.trim() || 'Uma lembrança especial.', image: memoryImage }
        : memory);
      persist('mv-memories', updatedMemories, setMemories);
      resetMemoryForm();
      setNotice('Lembrança atualizada.');
      return;
    }
    persist('mv-memories', [{ id: Date.now(), name: memoryTitle.trim(), description: memoryDescription.trim() || 'Uma lembrança especial.', image: memoryImage, date: 'Nova lembrança' }, ...memories], setMemories);
    resetMemoryForm();
    setNotice('Nova lembrança adicionada ao álbum.');
  }
  function resetMemoryForm() {
    setMemoryTitle(''); setMemoryDescription(''); setMemoryImage(''); setEditingMemoryId(null);
    if (photoInput.current) photoInput.current.value = '';
  }
  function startEditingMemory(memory) {
    setMemoryTitle(memory.name);
    setMemoryDescription(memory.description);
    setMemoryImage(memory.image);
    setEditingMemoryId(memory.id);
    document.getElementById('memory-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function removeMemory(memory) {
    if (!window.confirm(`Remover a lembrança “${memory.name}” do álbum?`)) return;
    persist('mv-memories', memories.filter(item => item.id !== memory.id), setMemories);
    if (editingMemoryId === memory.id) resetMemoryForm();
    setNotice('Lembrança removida do álbum.');
  }
  function onPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2_500_000) { setNotice('Escolha uma foto de até 2,5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => setMemoryImage(reader.result);
    reader.readAsDataURL(file);
  }
  function addPerson(event) {
    event.preventDefault();
    if (!personName.trim() || !personPhone.trim()) return;
    persist('mv-people', [...people, { name: personName.trim(), relation: personRelation.trim() || 'Familiar', phone: personPhone.trim(), photo: '' }], setPeople);
    resetContactForm(); setNotice('Contato de confiança salvo.');
  }
  function resetContactForm() {
    setPersonName(''); setPersonRelation(''); setPersonPhone(''); setEditingContactIndex(null);
  }
  function startEditingContact(person, index) {
    setPersonName(person.name);
    setPersonRelation(person.relation);
    setPersonPhone(person.phone);
    setEditingContactIndex(index);
  }
  function saveContact(event) {
    event.preventDefault();
    if (editingContactIndex === null) {
      addPerson(event);
      return;
    }
    if (!personName.trim() || !personPhone.trim()) return;
    const updatedPeople = people.map((person, index) => index === editingContactIndex
      ? { ...person, name: personName.trim(), relation: personRelation.trim() || 'Familiar', phone: personPhone.trim() }
      : person);
    persist('mv-people', updatedPeople, setPeople);
    resetContactForm();
    setNotice('Contato atualizado.');
  }
  function removeContact(index) {
    const person = people[index];
    if (!person || !window.confirm(`Remover ${person.name} da rede de apoio?`)) return;
    persist('mv-people', people.filter((_, personIndex) => personIndex !== index), setPeople);
    if (editingContactIndex === index) resetContactForm();
    else if (editingContactIndex !== null && editingContactIndex > index) setEditingContactIndex(editingContactIndex - 1);
    setNotice(`${person.name} foi removido da rede de apoio.`);
  }
  function beginQuiz() { setQuizIndex(0); setQuizAnswer(null); setQuizScore(0); setQuizFinished(false); }
  function answerQuiz(index) {
    if (quizAnswer !== null) return;
    const isCorrect = index === quizQuestions[quizIndex].answer;
    if (isCorrect) setQuizScore(score => score + 1);
    setQuizAnswer(index);
  }
  function nextQuestion() {
    if (quizIndex === quizQuestions.length - 1) setQuizFinished(true);
    else { setQuizIndex(index => index + 1); setQuizAnswer(null); }
  }
  function saveAccounts(nextAccounts) {
    setAccounts(nextAccounts);
    localStorage.setItem('mv-accounts', JSON.stringify(nextAccounts));
  }
  function establishSession(account) {
    setActiveAccountId(account.id);
    localStorage.setItem('mv-session', JSON.stringify(account.id));
    setAuthError('');
    setTab('inicio');
  }
  async function submitRegistration(event) {
    event.preventDefault();
    setAuthError('');
    const email = normalizeEmail(familyEmail);
    const patientAddress = normalizeEmail(patientEmail);
    if (accounts.some(account => account.email === email || (includePatient && account.email === patientAddress))) {
      setAuthError('Este e-mail já está cadastrado. Use outro endereço.');
      return;
    }
    if (includePatient && (!patientName.trim() || !patientAddress || patientPassword.length < 6)) {
      setAuthError('Preencha os dados da pessoa e crie uma senha de pelo menos 6 caracteres.');
      return;
    }
    if (includePatient && email === patientAddress) {
      setAuthError('Use um e-mail diferente para a conta da pessoa.');
      return;
    }
    const familyId = crypto.randomUUID();
    const family = { id: familyId, type: 'family', name: familyName.trim(), email, passwordHash: await passwordHash(familyPassword), patientId: null };
    const nextAccounts = [...accounts, family];
    if (includePatient) {
      const patient = { id: crypto.randomUUID(), type: 'patient', name: patientName.trim(), email: patientAddress, passwordHash: await passwordHash(patientPassword), familyId, relation: patientRelation.trim() };
      family.patientId = patient.id;
      nextAccounts.push(patient);
    }
    saveAccounts(nextAccounts);
    establishSession(family);
  }
  async function submitLogin(event) {
    event.preventDefault();
    setAuthError('');
    const email = normalizeEmail(familyEmail);
    const hash = await passwordHash(familyPassword);
    const account = accounts.find(entry => entry.email === email && entry.passwordHash === hash && (authMode === 'patient-login' ? entry.type === 'patient' : entry.type === 'family'));
    if (!account) {
      setAuthError('E-mail ou senha incorretos. Confira os dados e tente novamente.');
      return;
    }
    establishSession(account);
  }
  async function addPatientToFamily(event) {
    event.preventDefault();
    if (!activeAccount || !patientName.trim() || !patientEmail.trim() || patientPassword.length < 6) return;
    const email = normalizeEmail(patientEmail);
    if (accounts.some(account => account.email === email)) {
      setAuthError('Este e-mail já está cadastrado. Use outro endereço.');
      return;
    }
    const patient = { id: crypto.randomUUID(), type: 'patient', name: patientName.trim(), email, passwordHash: await passwordHash(patientPassword), familyId: activeAccount.id, relation: patientRelation.trim() };
    const family = { ...activeAccount, patientId: patient.id };
    saveAccounts([...accounts.filter(account => account.id !== activeAccount.id), family, patient]);
    setPatientName(''); setPatientEmail(''); setPatientPassword(''); setPatientRelation(''); setAuthError('');
    setNotice('A conta da pessoa foi criada. Compartilhe o e-mail e a senha com ela.');
  }
  function logoutFamily() {
    setActiveAccountId(null);
    localStorage.removeItem('mv-session');
    setTab('inicio');
  }

  const authPanel = <section className="login-modal auth-modal auth-gate-card" aria-label={authMode === 'register' ? 'Cadastro da família' : authMode === 'patient-login' ? 'Login da pessoa' : 'Login da família'}>
    {authMode === 'register' ? <div className="login-panel-heading"><h2>Crie sua conta</h2><p>Cadastre-se para acompanhar e cuidar de quem você ama.</p></div> : <div className="login-panel-heading"><h2>Entrar</h2><p>Faça login para continuar</p></div>}
    <form onSubmit={authMode === 'register' ? submitRegistration : submitLogin}>
      {authMode === 'register' && <><label htmlFor="family-name">Seu nome</label><input id="family-name" autoComplete="name" value={familyName} onChange={event => setFamilyName(event.target.value)} placeholder="Nome de quem cuida" required /><label htmlFor="family-email">Seu e-mail</label></>}
      {authMode !== 'register' && <label htmlFor="family-email">E-mail</label>}
      <input id="family-email" type="email" autoComplete="email" value={familyEmail} onChange={event => setFamilyEmail(event.target.value)} placeholder="voce@exemplo.com" required />
      <label htmlFor="family-password">{authMode === 'patient-login' ? 'Sua senha' : 'Senha'}</label><PasswordInput id="family-password" autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} minLength={authMode === 'register' ? 6 : undefined} value={familyPassword} onChange={event => setFamilyPassword(event.target.value)} placeholder={authMode === 'register' ? 'Pelo menos 6 caracteres' : 'Digite sua senha'} required />
      {authMode === 'register' && <><label className="patient-checkbox"><input type="checkbox" checked={includePatient} onChange={event => setIncludePatient(event.target.checked)} /><span>Quero criar o acesso da pessoa agora</span></label>{includePatient && <div className="patient-fields"><label htmlFor="patient-name">Nome da pessoa</label><input id="patient-name" autoComplete="off" value={patientName} onChange={event => setPatientName(event.target.value)} placeholder="Nome completo" required /><label htmlFor="patient-relation">Parentesco (opcional)</label><input id="patient-relation" value={patientRelation} onChange={event => setPatientRelation(event.target.value)} placeholder="Ex.: mãe, avô" /><label htmlFor="patient-email">E-mail para o acesso da pessoa</label><input id="patient-email" type="email" autoComplete="off" value={patientEmail} onChange={event => setPatientEmail(event.target.value)} placeholder="pessoa@exemplo.com" required /><label htmlFor="patient-password">Senha para a pessoa</label><PasswordInput id="patient-password" autoComplete="new-password" minLength={6} value={patientPassword} onChange={event => setPatientPassword(event.target.value)} placeholder="Pelo menos 6 caracteres" required /></div>}</>}
      {authError && <span className="pin-error">{authError}</span>}<button className="button button-primary full-button auth-submit" type="submit">{authMode === 'register' ? 'Criar conta' : 'Entrar'} <Icon name="arrow" size={18} /></button></form>
    <div className="auth-links">{authMode === 'register' ? <button onClick={() => { setAuthMode('family-login'); setAuthError(''); }}>Já tem conta? Entrar</button> : <button onClick={() => { setAuthMode('register'); setAuthError(''); }}>Criar conta da família</button>}{authMode !== 'patient-login' && <button onClick={() => { setAuthMode('patient-login'); setAuthError(''); }}>Entrar como paciente</button>}{authMode === 'patient-login' && <button onClick={() => { setAuthMode('family-login'); setAuthError(''); }}>Entrar como familiar</button>}</div>
  </section>;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" onClick={() => setTab('inicio')} aria-label="Memória Viva, início">
          <span>memória<span className="brand-light">viva</span></span>
        </a>
        <div className="topbar-right">
          <span className="date-pill"><span className="date-dot" />{todayLabel}</span>
          {activeAccount && <button className="family-entry" onClick={logoutFamily}>Sair da conta <Icon name="arrow" size={17} /></button>}
        </div>
      </header>

      {!activeAccount ? <main className="auth-gate">{authPanel}</main> : familyMode ? <main className="family-main">
        <div className="family-heading"><div><span className="eyebrow">ESPAÇO DA FAMÍLIA</span><h1>Olá, {activeAccount.name} <span className="wave">✳</span></h1><p>Pequenos gestos tornam cada dia mais acolhedor.</p></div><div className="family-badge"><span>🔒</span> Conta da família</div></div>
        <section className="panel family-panel patient-account-panel">
          {linkedPatient ? <div className="linked-patient"><span className="contact-initial">{linkedPatient.name[0]}</span><div><span className="eyebrow">CONTA DA PESSOA</span><strong>{linkedPatient.name}</strong><small>Login: {linkedPatient.email} · conta ativa</small></div></div> : <><div className="panel-title"><div><span className="eyebrow">ACESSO DA PESSOA</span><h2>Adicionar paciente</h2></div><span className="panel-icon lavender">♡</span></div><p className="patient-form-note">Crie um login para que a pessoa acesse a rotina e o álbum. Você pode fazer isso agora ou depois.</p><form className="patient-create-form" onSubmit={addPatientToFamily}><input value={patientName} onChange={event => setPatientName(event.target.value)} placeholder="Nome da pessoa" aria-label="Nome da pessoa" required /><input value={patientRelation} onChange={event => setPatientRelation(event.target.value)} placeholder="Parentesco (opcional)" aria-label="Parentesco" /><input type="email" value={patientEmail} onChange={event => setPatientEmail(event.target.value)} placeholder="E-mail para o login" aria-label="E-mail da pessoa" required /><PasswordInput id="patient-dashboard-password" minLength={6} value={patientPassword} onChange={event => setPatientPassword(event.target.value)} placeholder="Crie uma senha (mínimo 6 caracteres)" ariaLabel="Senha de acesso da pessoa" required /><button className="button button-primary" type="submit"><Icon name="plus" size={17} /> Criar acesso da pessoa</button>{authError && <span className="pin-error">{authError}</span>}</form></>}
        </section>
        <div className="family-grid">
          <section className="panel family-panel"><div className="panel-title"><div><span className="eyebrow">ROTINA</span><h2>Afazeres do dia</h2></div><span className="counter-badge">{tasks.length} itens</span></div>
            <form className="add-task-form" onSubmit={addTask}><label className="sr-only" htmlFor="task-title">Nome do afazer</label><input id="task-title" value={newTask} onChange={event => setNewTask(event.target.value)} placeholder="Ex.: Caminhar no jardim" required /><label className="sr-only" htmlFor="task-time">Horário</label><input id="task-time" type="time" value={newTaskTime} onChange={event => setNewTaskTime(event.target.value)} /><button className="icon-button" type="submit" aria-label="Adicionar afazer"><Icon name="plus" /></button></form>
            <div className="family-task-list">{tasks.map(task => <div className="family-task" key={task.id}><span className={`task-check ${task.done ? 'checked' : ''}`}>{task.done ? '✓' : ''}</span><span>{task.title}</span><time>{task.time}</time></div>)}</div>
          </section>
          <section className="panel family-panel"><div className="panel-title"><div><span className="eyebrow">LEMBRANÇAS</span><h2>Adicionar ao álbum</h2></div><span className="panel-icon coral"><Icon name="camera" /></span></div>
            <form className="memory-form" onSubmit={addMemory}><label className="upload-box" htmlFor="memory-photo"><input ref={photoInput} id="memory-photo" type="file" accept="image/*" onChange={onPhoto} /><span className="upload-preview">{memoryImage ? <img src={memoryImage} alt="Prévia da foto escolhida" /> : <Icon name="camera" size={25} />}</span><span><strong>{memoryImage ? (editingMemoryId !== null ? 'Manter ou trocar foto' : 'Foto escolhida') : 'Escolher uma foto'}</strong><small>JPG ou PNG · até 2,5 MB</small></span><Icon name="plus" size={19} /></label><label className="sr-only" htmlFor="memory-title">Título da lembrança</label><input id="memory-title" value={memoryTitle} onChange={event => setMemoryTitle(event.target.value)} placeholder="Quem está na foto?" required /><label className="sr-only" htmlFor="memory-description">Descrição da lembrança</label><textarea id="memory-description" value={memoryDescription} onChange={event => setMemoryDescription(event.target.value)} placeholder="Conte um pouquinho sobre essa lembrança..." rows="3" /><div className="memory-form-actions"><button className="button button-primary full-button" type="submit" disabled={!memoryImage}><Icon name={editingMemoryId !== null ? 'check' : 'plus'} size={18} /> {editingMemoryId !== null ? 'Salvar alterações' : 'Adicionar lembrança'}</button>{editingMemoryId !== null && <button className="button memory-cancel" type="button" onClick={resetMemoryForm}>Cancelar</button>}</div></form>
          </section>
          <section className="panel family-panel contact-panel"><div className="panel-title"><div><span className="eyebrow">REDE DE APOIO</span><h2>Contatos de confiança</h2></div><span className="panel-icon lavender">♡</span></div><div className="contact-list">{people.map((person, index) => <div className="contact-row" key={`${person.name}-${index}`}>{person.photo ? <img src={person.photo} alt="" /> : <span className="contact-initial">{person.name.charAt(0)}</span>}<div className="contact-details"><strong>{person.name}</strong><small>{person.relation}</small></div><div className="contact-actions"><a href={`tel:${person.phone}`} className="call-small" aria-label={`Ligar para ${person.name}`}><Icon name="phone" size={17} /></a><button type="button" className="contact-action edit-contact" onClick={() => startEditingContact(person, index)} aria-label={`Editar ${person.name}`} title="Editar contato">✎</button><button type="button" className="contact-action remove-contact" onClick={() => removeContact(index)} aria-label={`Remover ${person.name}`} title="Remover contato"><Icon name="close" size={15} /></button></div></div>)}</div><form className="add-contact-form" onSubmit={saveContact}><h3>{editingContactIndex === null ? 'Adicionar familiar' : 'Editar contato'}</h3><div className="contact-inputs"><input value={personName} onChange={event => setPersonName(event.target.value)} placeholder="Nome" aria-label="Nome do familiar" required /><input value={personRelation} onChange={event => setPersonRelation(event.target.value)} placeholder="Parentesco" aria-label="Parentesco" /><input value={personPhone} onChange={event => setPersonPhone(event.target.value)} placeholder="Telefone com DDI" aria-label="Telefone" type="tel" required /></div><div className="contact-form-actions"><button type="submit" className="button button-soft"><Icon name={editingContactIndex === null ? 'plus' : 'check'} size={17} /> {editingContactIndex === null ? 'Adicionar contato' : 'Salvar alterações'}</button>{editingContactIndex !== null && <button type="button" className="button contact-cancel" onClick={resetContactForm}>Cancelar</button>}</div></form></section>
          <section className="panel family-panel album-preview"><div className="panel-title"><div><span className="eyebrow">ÁLBUM DE MEMÓRIAS</span><h2>{memories.length} lembranças guardadas</h2></div></div><div className="memory-admin-grid">{memories.map(memory => <article className="memory-admin-card" key={memory.id}><img src={memory.image} alt={memory.name} /><div className="memory-admin-info"><strong>{memory.name}</strong><div><button type="button" onClick={() => startEditingMemory(memory)} aria-label={`Editar ${memory.name}`}>Editar</button><button type="button" onClick={() => removeMemory(memory)} aria-label={`Remover ${memory.name}`}>Remover</button></div></div></article>)}</div><p>Edite ou remova qualquer lembrança guardada no álbum.</p></section>
        </div>
      </main> : <>
        <main className="main-content">
          <section className="welcome-row"><div><span className="eyebrow">UM DIA DE CADA VEZ</span><h1>Bom dia{activeAccount?.type === 'patient' ? `, ${activeAccount.name}` : ', Dona Lúcia'} <span className="wave">✳</span></h1><p>Estamos aqui com você. Vamos aproveitar este dia juntos?</p></div><button className="help-button" onClick={() => setHelpOpen(true)}><span className="help-icon"><Icon name="phone" size={23} /></span><span><strong>Estou perdida</strong><small>Toque para pedir ajuda</small></span><Icon name="arrow" size={19} /></button></section>
          <nav className="main-tabs" aria-label="Navegação principal">{[['inicio','home','Meu dia'],['memorias','book','Minhas memórias'],['quiz','brain','Vamos brincar']].map(([key,icon,label]) => <button key={key} className={`tab-button ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}><Icon name={icon} size={19} />{label}</button>)}</nav>
          {tab === 'inicio' && <div className="home-view"><div className="home-grid"><section className="routine-card"><div className="routine-header"><div><span className="eyebrow">SUA ROTINA DE HOJE</span><h2>Passo a passo, com calma.</h2></div><div className="progress-ring" style={{ '--progress': `${tasks.length ? doneCount / tasks.length * 100 : 0}%` }}><span>{doneCount}<small>/{tasks.length}</small></span></div></div><div className="progress-copy">Você já fez <strong>{doneCount} de {tasks.length} coisas</strong>. Muito bem!</div><div className="routine-list">{tasks.map((task, index) => <button key={task.id} className={`routine-item ${task.done ? 'is-done' : ''}`} onClick={() => toggleTask(task.id)}><span className="routine-icon">{task.icon}</span><span className="routine-text"><strong>{task.title}</strong><small>{task.time} {index === 0 && !task.done ? '· agora' : ''}</small></span><span className="round-check">{task.done && <Icon name="check" size={16} />}</span></button>)}</div><div className="kind-note"><span>☀</span><p>Não precisa ter pressa. Cada pequena conquista importa.</p></div></section>
            <aside className="side-column"><section className="memory-spotlight"><div className="spotlight-top"><span className="spotlight-label"><span>✦</span> UMA LEMBRANÇA DE HOJE</span><button aria-label="Ver todas as memórias" onClick={() => setTab('memorias')}><Icon name="arrow" size={19} /></button></div><div className="spotlight-photo-wrap"><img src={memories[0]?.image} alt={memories[0]?.name || 'Uma lembrança da família'} /><span className="photo-sticker">um dia especial</span></div><div className="spotlight-caption"><h3>{memories[0]?.name || 'Uma lembrança especial'}</h3><p>{memories[0]?.description || 'Momentos bonitos que guardamos no coração.'}</p><div className="memory-byline"><span className="tiny-avatars">{people.slice(0, 2).map((person, index) => person.photo ? <img key={index} src={person.photo} alt="" /> : <i key={index}>{person.name[0]}</i>)}</span><small>Com carinho, sua família</small></div></div></section><button className="quiz-teaser" onClick={() => setTab('quiz')}><span className="quiz-illustration">🧩</span><span><small>UM MOMENTO DIVERTIDO</small><strong>Vamos brincar de perguntas?</strong><em>Um quiz bem facinho <Icon name="arrow" size={16} /></em></span></button></aside></div></div>}
          {tab === 'memorias' && <section className="memories-view"><div className="section-heading"><div><span className="eyebrow">FEITAS DE AMOR</span><h2>Seu álbum de memórias</h2><p>Rostos queridos e momentos que aquecem o coração.</p></div><span className="album-count"><Icon name="book" size={18} /> {memories.length} lembranças</span></div><div className="memory-grid">{memories.map(memory => <article className="memory-card" key={memory.id}><div className="memory-image"><img src={memory.image} alt={memory.name} /><span>{memory.date}</span></div><div className="memory-card-copy"><h3>{memory.name}</h3><p>{memory.description}</p><span className="memory-family"><span>♡</span> Uma lembrança da família</span></div></article>)}</div><div className="family-upload-hint"><span>💌</span><div><strong>Quer guardar mais momentos?</strong><p>Peça para alguém da sua família adicionar novas fotos para você.</p></div><button onClick={logoutFamily}>Trocar de conta <Icon name="arrow" size={17} /></button></div></section>}
          {tab === 'quiz' && <section className="quiz-view"><div className="quiz-card"><div className="quiz-decoration decoration-one">✦</div><div className="quiz-decoration decoration-two">✿</div><span className="eyebrow">SEM PRESSA, SEM ERRO</span><div className="quiz-emoji">{quizFinished ? '🌷' : '🧠'}</div>{quizFinished ? <><h2>Você foi muito bem!</h2><p className="quiz-prompt">Acertou {quizScore} de {quizQuestions.length} perguntas. O mais importante é se divertir.</p><div className="quiz-end-note">✦ Que tal mais uma rodada?</div><button className="button button-primary" onClick={beginQuiz}>Brincar de novo <Icon name="arrow" size={18} /></button></> : <><div className="quiz-progress">PERGUNTA {quizIndex + 1} DE {quizQuestions.length}</div><h2>{quizQuestions[quizIndex].question}</h2><p className="quiz-prompt">Escolha a resposta que você acha que combina.</p><div className="answer-list">{quizQuestions[quizIndex].options.map((option, index) => <button key={option} disabled={quizAnswer !== null} className={`answer-option ${quizAnswer === index ? (index === quizQuestions[quizIndex].answer ? 'correct' : 'incorrect') : ''} ${quizAnswer !== null && index === quizQuestions[quizIndex].answer ? 'correct' : ''}`} onClick={() => answerQuiz(index)}><span className="answer-letter">{String.fromCharCode(65 + index)}</span>{option}<span className="answer-indicator">{quizAnswer !== null && index === quizQuestions[quizIndex].answer ? '✓' : ''}</span></button>)}</div>{quizAnswer !== null && <div className="quiz-feedback"><span>{quizAnswer === quizQuestions[quizIndex].answer ? '🌟' : '💛'}</span><span>{quizAnswer === quizQuestions[quizIndex].answer ? 'Isso mesmo! Você está indo muito bem.' : 'Tudo bem! A resposta certa está destacada.'}</span><button onClick={nextQuestion}>{quizIndex === quizQuestions.length - 1 ? 'Ver resultado' : 'Próxima'} <Icon name="arrow" size={17} /></button></div>}</>}</div></section>}
        </main>
        <footer className="app-footer"><span>✿</span> Feito com carinho, para que você se sinta sempre em casa.</footer>
        <nav className="mobile-nav" aria-label="Navegação mobile">{[['inicio','home','Meu dia'],['memorias','book','Memórias'],['quiz','brain','Brincar']].map(([key,icon,label]) => <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}><Icon name={icon} size={21} /><span>{label}</span></button>)}<button onClick={() => setHelpOpen(true)} className="mobile-help"><Icon name="phone" size={21} /><span>Ajuda</span></button></nav>
      </>}

      {helpOpen && <div className="modal-backdrop" role="presentation" onClick={event => event.target === event.currentTarget && setHelpOpen(false)}><section className="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title"><button className="modal-close" onClick={() => setHelpOpen(false)} aria-label="Fechar"><Icon name="close" /></button><div className="help-modal-icon"><Icon name="phone" size={27} /></div><span className="eyebrow">VOCÊ NÃO ESTÁ SOZINHA</span><h2 id="help-title">Vamos encontrar ajuda?</h2><p>Escolha uma pessoa querida. Ela ficará feliz em falar com você.</p><div className="help-contacts">{people.slice(0, 2).map((person, index) => <a key={`${person.name}-${index}`} className="help-contact" href={`tel:${person.phone}`} onClick={() => setHelpOpen(false)}>{person.photo ? <img src={person.photo} alt="" /> : <span className="contact-initial">{person.name[0]}</span>}<span className="help-contact-copy"><strong>{person.name}</strong><small>{person.relation}</small></span><span className="call-circle"><Icon name="phone" size={19} /></span></a>)}</div><div className="help-reminder"><span>💛</span> Respire fundo. Sua família está pertinho.</div><button className="text-button" onClick={() => setHelpOpen(false)}>Voltar</button></section></div>}
      {notice && <div className="toast" role="status">✓ {notice}<button onClick={() => setNotice('')} aria-label="Fechar aviso"><Icon name="close" size={16} /></button></div>}
    </div>
  );
}

export default App;
