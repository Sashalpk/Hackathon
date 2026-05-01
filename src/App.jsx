import { useState } from 'react';
import logo from './photo-illustrations/ScheduleMonitor.png';
import checkIcon from './icons/check.svg';
import plusIcon from './icons/plus.svg';
import groupsIcon from './icons/groups.svg';
import calendarIcon from './icons/calendar.svg';
import savedIcon from './icons/saved.svg';

const ArrowDownIcon = ({ className }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`btn-arrow-icon ${className}`}
  >
    <path 
      d="M6 9L12 15L18 9" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const App = () => {
  const [screen, setScreen] = useState('home');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isGroupsCreated, setIsGroupsCreated] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("NN–nm–n/m");
  const [isNumerator, setIsNumerator] = useState(true);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [activeDeptId, setActiveDeptId] = useState(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false); 
  const [isSubjectInputVisible, setIsSubjectInputVisible] = useState(false);
  const [activeCell, setActiveCell] = useState(null);
  const [isScheduleSaved, setIsScheduleSaved] = useState(false);

  const [cellData, setCellData] = useState({
    numerator: {},
    denominator: {}
  });

  const [subjects, setSubjects] = useState([
    { 
      id: 1, 
      name: 'Вікно',
      teacher: '', 
      cabinet: '',
      isSubmitted: true
    }
  ]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [departments, setDepartments] = useState([
    {
      id: 101,
      name: '',
      isSubmitted: false,
      groups: [{ id: 201, name: '', isSubmitted: false }]
    }
  ]);

  const hasNoSubjectsYet = subjects.length <= 1;

  const handleHeaderAddSubjectClick = () => {
    if (hasNoSubjectsYet) {
      setShowSubjectModal(true);
    } else {
      setScreen('create-subjects');
    }
  };

  const handleCellPlusClick = (cellId) => {
    if (hasNoSubjectsYet) {
      setShowSubjectModal(true);
    } else {
      setActiveCell(cellId);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistration = () => {
    setIsRegistered(true);
    setScreen('profile');
  };

  const handlePlusClick = () => {
    setIsInputVisible(true);
    setIsGroupsCreated(true);
  };

  const handleSubjectChange = (id, field, value) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addNewSubjectField = () => {
    const lastSubject = subjects[subjects.length - 1];
    if (lastSubject.name.trim() !== '') {
      setSubjects(prev => [
        ...prev.map(s => ({ ...s, isSubmitted: true })), 
        { 
          id: Date.now(), 
          name: '', 
          teacher: '', 
          cabinet: '№', 
          isSubmitted: false 
        }
      ]);
    }
  };

  const handleGroupNameChange = (deptId, groupId, value) => {
    setDepartments(prevDepts => prevDepts.map(dept => 
      dept.id === deptId 
        ? { ...dept, groups: dept.groups.map(g => g.id === groupId ? { ...g, name: value } : g) }
        : dept
    ));
  };

  const handleKeyDown = (e, deptId, groupId) => {
    if (e.key === 'Enter') {
      setDepartments(prevDepts => prevDepts.map(dept => {
        if (dept.id === deptId) {
          return {
            ...dept,
            groups: dept.groups.map(g => 
              g.id === groupId && g.name.trim() !== '' ? { ...g, isSubmitted: true } : g
            )
          };
        }
        return dept;
      }));
    }
  };

  const addNewGroupField = (deptId) => {
    setDepartments(prevDepts => prevDepts.map(dept => 
      dept.id === deptId 
        ? { ...dept, groups: [...dept.groups, { id: Date.now(), name: '', isSubmitted: false }] }
        : dept
    ));
  };

  const addNewDepartment = () => {
    setDepartments(prev => [...prev, {
      id: Date.now(),
      name: '',
      isSubmitted: false,
      groups: [{ id: Date.now() + 1, name: '', isSubmitted: false }]
    }]);
  };

  const handleSelectSubject = (cellId, subject) => {
    const weekType = isNumerator ? 'numerator' : 'denominator';
    setCellData(prev => ({
      ...prev,
      [weekType]: {
        ...prev[weekType],
        [cellId]: subject
      }
    }));
    setActiveCell(null);
  };

  const handleSaveSchedule = () => {
    setIsScheduleSaved(true);
    setScreen('profile');
  };

  return (
    <div className="app-wrapper">
      <div className="corner-glow"></div>
      <div className="bottom-glow"></div>
      
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo-section" onClick={() => setScreen(isScheduleSaved ? 'profile' : 'home')}>
            <img src={logo} alt="logo" className="nav-icon" />
            <span className="nav-title">РозкладМонітор</span>
          </div>
          <div className="nav-right-side">
            {isGroupsCreated && (
              <div className="nav-menu-items">
                <div className="nav-item" onClick={() => setScreen('create-groups')}>
                  <img src={groupsIcon} alt="" className="nav-small-icon" />
                  <span>Групи</span>
                </div>
                <div className="nav-item" onClick={() => setScreen('create-schedule')}>
                  <img src={calendarIcon} alt="" className="nav-small-icon" />
                  <span>Змінити розклад</span>
                </div>
              </div>
            )}
            {isRegistered && (
              <div className="nav-profile-icon" onClick={() => setScreen('profile')}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4A3E55" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="main-screen">
        <div className="content-container">
          
          {screen === 'home' && (
            <>
              <h1 className="main-title">Інструкція з <br /> налаштування сайту</h1>
              <div className="buttons-group">
                <button className={`custom-btn ${isRegistered ? 'btn-success' : ''}`} onClick={() => setScreen(isRegistered ? 'profile' : 'registration')}>
                  {isRegistered ? <div className="btn-content-success"><span>Зареєстровано</span><img src={checkIcon} alt="done" className="check-mark" /></div> : "Зареєструватись"}
                </button>
                <button className={`custom-btn ${isGroupsCreated ? 'btn-success' : ''}`} onClick={() => setScreen('create-groups')}>
                  {isGroupsCreated ? <div className="btn-content-success"><span>Групи створено</span><img src={checkIcon} alt="done" className="check-mark" /></div> : "Створити список груп"}
                </button>
                <button className="custom-btn" onClick={() => setScreen('create-schedule')}>Створити розклад</button>
              </div>
            </>
          )}

          {screen === 'registration' && (
            <div className="registration-container">
              <h1 className="main-title-registration">Реєстрація</h1>
              <div className="inputs-group">
                <input name="firstName" className="reg-input" placeholder="Ім’я" onChange={handleChange} value={formData.firstName} />
                <input name="lastName" className="reg-input" placeholder="Прізвище" onChange={handleChange} value={formData.lastName} />
                <input name="email" className="reg-input" placeholder="Електронна пошта" onChange={handleChange} value={formData.email} />
                <button className="custom-btn reg-submit-btn" onClick={handleRegistration}>Зареєструватись</button>
              </div>
            </div>
          )}

          {screen === 'profile' && (
            <div className="profile-container">
              {isScheduleSaved ? (
                <div className="profile-menu-card glass-card">
                  <h2 className="profile-welcome-text">
                    Доброго часу доби <br /> 
                    <span className="highlight-text">{formData.firstName || "<Ім'я>"} {formData.lastName || "<Прізвище>"}</span>
                  </h2>
                  
                  <div className="profile-grid-layout">
                    <button className="profile-action-btn btn-left-top" onClick={() => setScreen('create-groups')}>
                      Переглянути список груп
                    </button>
                    
                    <button className="profile-action-btn btn-right-top btn-with-icon" onClick={() => setScreen('create-schedule')}>
                      Переглянути розклад <ArrowDownIcon className="orange-arrow" />
                    </button>
                    
                    <button className="profile-action-btn btn-left-bottom" onClick={() => setScreen('create-subjects')}>
                      Переглянути список предметів
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="avatar-circle">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#4A3E55" strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div className="inputs-group">
                    <div className="reg-input disabled-input">{formData.firstName || "Ім’я"}</div>
                    <div className="reg-input disabled-input">{formData.lastName || "Прізвище"}</div>
                    <div className="reg-input disabled-input">{formData.email || "Електронна пошта"}</div>
                  </div>
                </>
              )}
            </div>
          )}

          {screen === 'create-groups' && (
            <div className="groups-list-screen">
              <div className="glass-card">
                <h2 className="glass-card-title">Створити список груп</h2>
                {!isInputVisible ? (
                  <button className="plus-btn-large" onClick={handlePlusClick}><img src={plusIcon} alt="add" className="plus-icon-img" /></button>
                ) : (
                  <div className="creation-horizontal-container">
                    {departments.map((dept) => (
                      <div key={dept.id} className="dept-column">
                        <input type="text" className="dept-input-overlay" placeholder="Додати відділення" value={dept.name} onChange={(e) => setDepartments(prev => prev.map(d => d.id === dept.id ? {...d, name: e.target.value} : d))} />
                        <div className="groups-vertical-list">
                          {dept.groups.map((group) => (
                            <div key={group.id} className="group-input-wrapper">
                              <div className="input-with-cursor">
                                <input type="text" className="group-input-field" placeholder="Введіть назву групи" value={group.name} onChange={(e) => handleGroupNameChange(dept.id, group.id, e.target.value)} onKeyDown={(e) => handleKeyDown(e, dept.id, group.id)} autoFocus={!group.isSubmitted} readOnly={group.isSubmitted} />
                              </div>
                              {group.isSubmitted && group.id === dept.groups[dept.groups.length - 1].id && (
                                <button className="add-more-group-btn" onClick={() => addNewGroupField(dept.id)}><span className="plus-symbol">+</span></button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button className="add-dept-column-btn" onClick={addNewDepartment}><img src={plusIcon} alt="add dept" className="plus-icon-small" /><span>Створити відділення</span></button>
                  </div>
                )}
              </div>
            </div>
          )}

          {screen === 'create-subjects' && (
            <div className="groups-list-screen">
              <div className="glass-card subjects-card-wide">
                <h2 className="glass-card-title">Створити список предметів</h2>
                {!isSubjectInputVisible ? (
                  <button className="plus-btn-large" onClick={() => setIsSubjectInputVisible(true)}><img src={plusIcon} alt="add" className="plus-icon-img" /></button>
                ) : (
                  <div className="subjects-creation-container">
                    <div className="subjects-grid">
                      {subjects.map((subject) => {
                        const isWindow = subject.name.toLowerCase() === 'вікно';
                        return (
                          <div key={subject.id} className="subject-item-horizontal">
                            <div className={`subject-inputs-card ${subject.isSubmitted ? 'submitted' : ''} ${isWindow ? 'window-card' : ''}`}>
                              {isWindow ? (
                                <input type="text" className="subject-input window-text-centered" value={subject.name} onChange={(e) => handleSubjectChange(subject.id, 'name', e.target.value)} readOnly={subject.isSubmitted} />
                              ) : (
                                <>
                                  <input type="text" className="subject-input name-input" placeholder="<Назва предмету>" value={subject.name} onChange={(e) => handleSubjectChange(subject.id, 'name', e.target.value)} readOnly={subject.isSubmitted} />
                                  <input type="text" className="subject-input teacher-input" placeholder="<ПІБ викладача>" value={subject.teacher} onChange={(e) => handleSubjectChange(subject.id, 'teacher', e.target.value)} readOnly={subject.isSubmitted} />
                                  <input type="text" className="subject-input cabinet-input" placeholder="<№ауд.>" value={subject.cabinet} onChange={(e) => handleSubjectChange(subject.id, 'cabinet', e.target.value)} readOnly={subject.isSubmitted} />
                                </>
                              )}
                            </div>
                            {subject.id === subjects[subjects.length - 1].id && (
                              <button className="add-more-subject-btn-inline" onClick={addNewSubjectField}><img src={plusIcon} alt="" className="plus-icon-small" /></button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {screen === 'create-schedule' && (
            <div className="schedule-container">
              <div className="schedule-glass-card">
                <div className="schedule-toolbar">
                  <div className="dropdown-container">
                    <button 
                      className={`toolbar-btn group-btn ${isGroupDropdownOpen ? 'active' : ''}`}
                      onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                    >
                      <img src={groupsIcon} alt="" className="nav-small-icon" />
                      <span>{selectedGroup === "NN–nm–n/m" ? "Вкажіть групу" : selectedGroup}</span>
                      <ArrowDownIcon className={isGroupDropdownOpen ? 'rotate-icon' : ''} />
                    </button>

                    {isGroupDropdownOpen && (
                      <div className="dropdown-menu main-menu">
                        {departments.map((dept) => (
                          <div key={dept.id} className={`menu-item dept-item ${activeDeptId === dept.id ? 'hovered' : ''}`} onMouseEnter={() => setActiveDeptId(dept.id)}>
                            <span>{dept.name || "Відділення"}</span>
                            <div className="arrow-right">›</div>
                            {activeDeptId === dept.id && (
                              <div className="submenu groups-menu">
                                {dept.groups.map((group) => group.name && (
                                  <div key={group.id} className="menu-item group-selection-item" onClick={() => { setSelectedGroup(group.name); setIsGroupDropdownOpen(false); }}>
                                    {group.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`custom-toggle ${isNumerator ? 'numerator' : 'denominator'}`} onClick={() => setIsNumerator(!isNumerator)}>
                    <div className="toggle-circle"></div>
                    <span className="toggle-text">{isNumerator ? 'Чисельник' : 'Знаменник'}</span>
                  </div>

                  <button 
                    className={`toolbar-btn save-btn ${selectedGroup === "NN–nm–n/m" ? 'disabled' : ''}`}
                    onClick={handleSaveSchedule}
                  >
                    <img src={savedIcon} alt="" className="savedIcon"/>
                    Зберегти зміни
                  </button>
                </div>

                {selectedGroup !== "NN–nm–n/m" && (
                  <div className="table-sub-block">
                    <div className="schedule-table-wrapper">
                      <table className="schedule-table">
                        <thead>
                          <tr>
                            <th rowSpan="2" className="diagonal-cell">
                              <div className="diag-text day">День</div>
                              <div className="diag-text time">Час</div>
                            </th>
                            <th colSpan="6" className="table-header-cell">
                              <div className="header-items-wrapper">
                                <div className="header-pill group-pill">
                                  <span className="group-name-text">Розклад гр. {selectedGroup} ({isNumerator ? "Чисельник" : "Знаменник"})</span>
                                </div>
                                <button className="add-subject-btn" onClick={handleHeaderAddSubjectClick}>
                                  <img src={plusIcon} alt="" className="btn-plus-icon" />
                                  <span>Додати предмети</span>
                                  <ArrowDownIcon />
                                </button>
                              </div>
                            </th>
                          </tr>
                          <tr className="sub-header">
                            <th>0 пара:<br/>7:30 – 8:50</th>
                            <th>1 пара:<br/>9:00 – 10:20</th>
                            <th>2 пара:<br/>10:30 – 11:50</th>
                            <th>3 пара:<br/>12:20 – 13:40</th>
                            <th>4 пара:<br/>13:50 – 15:10</th>
                            <th>5 пара:<br/>15:20 – 16:40</th>
                          </tr>
                        </thead>
                        <tbody>
                          {['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця'].map((day) => (
                            <tr key={day}>
                              <td className="day-name">{day}</td>
                              {[...Array(6)].map((_, i) => {
                                const cellId = `${day}-${i}`;
                                const weekType = isNumerator ? 'numerator' : 'denominator';
                                const activeItem = cellData[weekType][cellId];
                                
                                return (
                                  <td key={i} className="schedule-cell">
                                    <div className="cell-content-wrapper">
                                      {activeItem ? (
                                        <div className={`selected-cell-info ${activeItem.name === 'Вікно' ? 'window-cell' : ''}`} onClick={() => setActiveCell(cellId)}>
                                          <div className="cell-sub-name">{activeItem.name}</div>
                                          {activeItem.teacher && <div className="cell-sub-teacher">{activeItem.teacher}</div>}
                                          {activeItem.cabinet && <div className="cell-sub-cabinet">{activeItem.cabinet}</div>}
                                        </div>
                                      ) : (
                                        <button className="add-subject-to-cell-btn" onClick={() => handleCellPlusClick(cellId)}>
                                          <span className="plus-orange-small">+</span>
                                        </button>
                                      )}

                                      {activeCell === cellId && (
                                        <>
                                          <div className="popup-overlay-fixed" onClick={(e) => { e.stopPropagation(); setActiveCell(null); }}></div>
                                          <div className="subject-selector-popup" style={{ zIndex: 999 }}>
                                            <div className="popup-header">Оберіть предмет:</div>
                                            <div className="popup-list">
                                              {subjects.map((sub) => (
                                                <div key={sub.id} className="popup-item" onClick={() => handleSelectSubject(cellId, sub)}>
                                                  <span className="popup-sub-name">{sub.name}</span>
                                                  {sub.name.toLowerCase() !== 'вікно' && sub.teacher && <span className="popup-sub-teacher">{sub.teacher}</span>}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {showSubjectModal && (
            <div className="modal-overlay">
              <div className="subject-modal-card">
                <p className="modal-text">На даний момент у вас<br />немає списку предметів, створити?</p>
                <div className="modal-buttons">
                  <button className="modal-btn confirm-btn" onClick={() => {
                    setScreen('create-subjects');
                    setShowSubjectModal(false);
                  }}>
                    <span className="plus-icon-orange">+</span> Так, створити
                  </button>
                  <button className="modal-btn cancel-btn" onClick={() => setShowSubjectModal(false)}>
                    <div className="oval-icon"></div> Ні, пізніше
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;