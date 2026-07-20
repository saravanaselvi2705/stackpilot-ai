import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, ProgressBar, Modal } from '../../components/UI';
import { useCustomization } from '../../context/CustomizationContext';
import { 
  IoAdd, 
  IoCalendarOutline, 
  IoArrowBackOutline, 
  IoDocumentTextOutline, 
  IoCheckmarkCircleOutline, 
  IoCloseCircleOutline,
  IoCodeOutline,
  IoSparklesOutline,
  IoTimeOutline,
  IoBriefcaseOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';
import API from '../../services/api';
import type { Project, Task } from '../../../../../packages/shared/types';

export const Projects: React.FC = () => {
  const { settings, formatCurrency, hasPermission } = useCustomization();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'overview' | 'tasks' | 'documents' | 'testing' | 'deliverables' | 'ai' | 'timeline'>('overview');
  
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // New Project Form State
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [budget, setBudget] = useState<number>(50000);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [client, setClient] = useState<string>('');

  // AI Assistant input state
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiOutput, setAiOutput] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const loadProjectsAndTasks = async () => {
    try {
      const [projectList, taskList] = await Promise.all([
        API.projects.list(),
        API.tasks.list()
      ]);
      setProjects(projectList);
      setTasks(taskList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProjectsAndTasks();
  }, []);

  // Listen to deep-links to auto-trigger the Create Project modal if permitted
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'add' && hasPermission('PM', 'create')) {
      setModalOpen(true);
    }
  }, [window.location.search, hasPermission]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('PM', 'create')) return;
    setLoading(true);
    try {
      await API.projects.create({
        name,
        description,
        priority,
        budget,
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        client
      });
      setName('');
      setDescription('');
      setPriority('Medium');
      setBudget(50000);
      setStartDate('');
      setEndDate('');
      setClient('');
      
      setModalOpen(false);
      loadProjectsAndTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    setAiOutput('');
    try {
      // Simulate AI response based on project spec
      setTimeout(() => {
        setAiOutput(`### Generated Code Skeleton for project: ${selectedProject?.name}
\`\`\`typescript
// Automatically compiled using StackPilot AI Engine
export interface TelemetryConfig {
  clientId: string;
  hookIntervalMs: number;
  enableSourceMaps: boolean;
}

export class TelemetryManager {
  private config: TelemetryConfig;
  constructor(config: TelemetryConfig) {
    this.config = config;
  }

  public init() {
    console.log("Telemetry hook active at interval:", this.config.hookIntervalMs);
  }
}
\`\`\`
Specifications summary successfully mapped to requirements directory.`);
        setAiLoading(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setAiLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      await API.tasks.update(taskId, { status: newStatus });
      loadProjectsAndTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getHealthBadge = (health: string) => {
    if (health === 'Healthy') return <Badge variant="success">Healthy</Badge>;
    if (health === 'At Risk') return <Badge variant="warning">At Risk</Badge>;
    return <Badge variant="danger">Critical</Badge>;
  };

  // Filter tasks belonging to the current project
  const projectTasks = selectedProject
    ? tasks.filter(t => t.projectId === selectedProject._id || t.projectId === selectedProject.name)
    : [];

  return (
    <div className="space-y-8">
      {!selectedProject ? (
        <>
          {/* Main Gallery List */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black font-display text-white tracking-tight">Projects Workspace</h1>
              <p className="text-xs text-slate-400 mt-1">Manage project timelines, budgets, and milestones.</p>
            </div>
            {hasPermission('PM', 'create') && (
              <Button onClick={() => setModalOpen(true)} className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white">
                <IoAdd size={16} /> Create Project
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {projects.map((p) => {
              const percentSpent = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
              return (
                <Card 
                  key={p._id} 
                  onClick={() => setSelectedProject(p)}
                  className="flex flex-col justify-between h-[300px] cursor-pointer hover:border-[#22C55E]/40 transition-all hover:scale-[1.01]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-white truncate max-w-[150px]">{p.name}</h3>
                      {getHealthBadge(p.health)}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-3">
                      {p.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                        <span>Spent vs Budget</span>
                        <span>{formatCurrency(p.spent)} / {formatCurrency(p.budget)} ({percentSpent}%)</span>
                      </div>
                      <ProgressBar value={percentSpent} color={percentSpent > 80 ? 'bg-red-500' : 'bg-[#22C55E]'} />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/40 pt-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <IoCalendarOutline size={12} className="text-slate-400" />
                        {new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(p.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="font-bold text-[#22C55E] hover:underline">Open Project Workspace →</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Gantt Timeline */}
          <Card>
            <div className="border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-sm font-bold text-slate-200">Project Timeline</h3>
              <p className="text-[10px] text-slate-400">Visual schedule of all active projects.</p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-12 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                <span className="col-span-3 text-left">Project Title</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
              </div>
              {projects.map((p, idx) => {
                const startCol = idx === 0 ? 4 : idx === 1 ? 5 : 3;
                const widthCols = idx === 0 ? 4 : idx === 1 ? 5 : 3;
                return (
                  <div key={p._id} className="grid grid-cols-12 items-center text-xs">
                    <span className="col-span-3 text-slate-300 font-semibold truncate">{p.name}</span>
                    <div className="col-span-9 grid grid-cols-9 h-6 relative bg-slate-900/10 rounded-lg overflow-hidden">
                      <div 
                        className="h-full rounded-md bg-gradient-to-r from-[#22C55E]/25 to-[#22C55E] border-l-2 border-[#22C55E] shadow-md shadow-[#22C55E]/10 flex items-center px-3 cursor-pointer hover:brightness-110 transition-all"
                        style={{ gridColumnStart: startCol, gridColumnEnd: startCol + widthCols }}
                        onMouseEnter={(e) => {
                          setHoveredProject(p);
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoverPosition({ x: rect.left + rect.width / 2, y: rect.top - 8 });
                        }}
                        onMouseLeave={() => {
                          setHoveredProject(null);
                          setHoverPosition(null);
                        }}
                        onClick={() => setSelectedProject(p)}
                      >
                        <span className="text-[9px] font-bold text-emerald-250 truncate">{p.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      ) : (
        /* Workspace View */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-450 hover:text-white cursor-pointer transition-all"
              >
                <IoArrowBackOutline size={16} />
              </button>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Project Workspace</span>
                <h1 className="text-2xl font-black text-white font-display mt-0.5">{selectedProject.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getHealthBadge(selectedProject.health)}
              <Badge variant={selectedProject.status === 'Completed' ? 'success' : 'primary'}>
                {selectedProject.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar for stats */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest border-b border-slate-800 pb-2">Specs Summary</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Budget Cap</span>
                    <span className="text-white font-bold font-mono">{formatCurrency(selectedProject.budget)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Current Cost</span>
                    <span className="text-red-400 font-bold font-mono">{formatCurrency(selectedProject.spent)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Client Account</span>
                    <span className="text-slate-350 capitalize font-semibold">{selectedProject.client || 'Internal Development'}</span>
                  </div>
                </div>
              </Card>

              {/* Action shortcuts */}
              <Card className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Tools</h4>
                <Button onClick={() => setActiveWorkspaceTab('ai')} size="sm" className="w-full text-[10px] bg-[#22C55E] hover:bg-[#1db053] text-white">
                  Launch Project Assistant
                </Button>
              </Card>
            </div>

            {/* Main workspace container */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex border-b border-slate-800 gap-1 overflow-x-auto">
                {[
                  { key: 'overview', label: 'Overview', icon: <IoBriefcaseOutline size={13} /> },
                  { key: 'tasks', label: 'Tasks Kanban', icon: <IoCodeOutline size={13} /> },
                  { key: 'documents', label: 'Specs & Documents', icon: <IoDocumentTextOutline size={13} /> },
                  { key: 'testing', label: 'QA & Testing', icon: <IoCheckmarkCircleOutline size={13} /> },
                  { key: 'deliverables', label: 'Deliverables Archive', icon: <IoCheckmarkCircleOutline size={13} /> },
                  { key: 'ai', label: 'AI Assistant', icon: <IoSparklesOutline size={13} /> },
                  { key: 'timeline', label: 'Timeline History', icon: <IoTimeOutline size={13} /> }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveWorkspaceTab(tab.key as any)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeWorkspaceTab === tab.key 
                        ? 'border-[#22C55E] text-[#22C55E] bg-[#22C55E]/5' 
                        : 'border-transparent text-slate-450 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Workspace overview */}
              {activeWorkspaceTab === 'overview' && (
                <div className="space-y-6">
                  <Card className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Scope and Objectives</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{selectedProject.description}</p>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team roster */}
                    <Card>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Project Roster</h4>
                      <div className="space-y-2">
                        {selectedProject.team?.length === 0 ? (
                          <span className="text-xs text-slate-500">No members linked</span>
                        ) : (
                          selectedProject.team?.map((member, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-950/20 rounded-xl border border-slate-850">
                              <span className="font-bold text-white">Member ID: {member.userId}</span>
                              <Badge variant="primary">{member.role}</Badge>
                            </div>
                          ))
                        )}
                      </div>
                    </Card>

                    {/* Timeline dates */}
                    <Card className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Milestone Progress</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Kickoff Date:</span>
                          <span className="text-white font-mono">{selectedProject.startDate}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Target Delivery:</span>
                          <span className="text-white font-mono">{selectedProject.endDate}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Tasks Kanban tab */}
              {activeWorkspaceTab === 'tasks' && (
                <Card>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">Workspace Task Registry</h3>
                  
                  {projectTasks.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No tasks registered for this project.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['Todo', 'In Progress', 'Done'].map(statusKey => (
                        <div key={statusKey} className="bg-slate-950/40 p-3.5 border border-slate-850 rounded-xl space-y-3">
                          <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider pb-2 border-b border-slate-850">{statusKey}</h4>
                          <div className="space-y-2">
                            {projectTasks.filter(t => t.status === statusKey).map(t => (
                              <div key={t._id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs">
                                <h5 className="font-bold text-white">{t.title}</h5>
                                <div className="flex items-center justify-between gap-1 text-[9px] pt-2 border-t border-slate-850/50">
                                  <Badge variant={t.priority === 'Critical' ? 'danger' : t.priority === 'High' ? 'warning' : 'primary'}>
                                    {t.priority}
                                  </Badge>
                                  <div className="flex gap-1">
                                    {statusKey !== 'Todo' && (
                                      <button onClick={() => updateTaskStatus(t._id, 'Todo')} className="text-[8px] bg-slate-800 hover:text-white px-1.5 py-0.5 rounded cursor-pointer">←</button>
                                    )}
                                    {statusKey !== 'Done' && (
                                      <button onClick={() => updateTaskStatus(t._id, statusKey === 'Todo' ? 'In Progress' : 'Done')} className="text-[8px] bg-[#22C55E]/20 text-[#22C55E] px-1.5 py-0.5 rounded cursor-pointer">→</button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Documents tab */}
              {activeWorkspaceTab === 'documents' && (
                <Card>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">SRS Documents & Layout Blueprints</h3>
                  <div className="space-y-3 text-xs">
                    {[
                      { title: 'Project Specification SRS v1.2', size: '2.4 MB', author: 'AI Studio' },
                      { title: 'Staging System Design Map', size: '1.2 MB', author: 'SarahPM' },
                      { title: 'Contracts Agreement', size: '4.8 MB', author: 'Corporate Admin' }
                    ].map((doc, idx) => (
                      <div key={idx} className="p-3 border border-slate-850 bg-slate-950/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IoDocumentTextOutline className="text-[#22C55E]" size={16} />
                          <div>
                            <h4 className="font-bold text-white">{doc.title}</h4>
                            <span className="text-[9px] text-slate-500 mt-0.5">Author: {doc.author} | Size: {doc.size}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="secondary" className="border-slate-800 text-slate-350 hover:text-white text-[9px]">Download File</Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* QA Testing tab */}
              {activeWorkspaceTab === 'testing' && (
                <Card>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">QA Test Plan Registry</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-850 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                          <th className="py-2.5 px-2">Test Suite ID</th>
                          <th className="py-2.5 px-2">QA Status</th>
                          <th className="py-2.5 px-2">Test Cases</th>
                          <th className="py-2.5 px-2 text-right">Bug Index</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'QA-HOOKS-01', status: 'Passed', cases: '18 / 18', bugs: 0 },
                          { id: 'QA-SCHEMA-02', status: 'Passed', cases: '12 / 12', bugs: 0 },
                          { id: 'QA-BUILD-03', status: 'Pending', cases: '0 / 8', bugs: 2 }
                        ].map((test, idx) => (
                          <tr key={idx} className="border-b border-slate-850 hover:bg-slate-900/10 text-slate-300">
                            <td className="py-3 px-2 font-bold text-slate-200">{test.id}</td>
                            <td className="py-3 px-2">
                              <Badge variant={test.status === 'Passed' ? 'success' : 'warning'}>{test.status}</Badge>
                            </td>
                            <td className="py-3 px-2 font-mono">{test.cases}</td>
                            <td className="py-3 px-2 text-right font-black text-red-400">{test.bugs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* Deliverables tab */}
              {activeWorkspaceTab === 'deliverables' && (
                <Card className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">Staging Build Archives</h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 border border-slate-850 bg-slate-950/20 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white">Production Release v1.0.0.zip</h4>
                        <a href="https://next-hooks.stackpilot.ai" target="_blank" rel="noreferrer" className="text-[10px] text-[#22C55E] hover:underline block mt-0.5">https://next-hooks.stackpilot.ai</a>
                      </div>
                      <Badge variant="success">Launch Live</Badge>
                    </div>
                  </div>
                </Card>
              )}

              {/* AI assistant */}
              {activeWorkspaceTab === 'ai' && (
                <Card className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 mb-2">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Requirements Spec compiler</h3>
                    <p className="text-[10px] text-slate-500">Draft specifications or telemetry configuration templates instantly.</p>
                  </div>

                  <div className="space-y-3">
                    <input 
                      type="text"
                      placeholder="e.g. Generate software skeleton for React hooks telemetry"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
                    />
                    <Button 
                      onClick={handleAiGenerate}
                      loading={aiLoading}
                      className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white"
                    >
                      Compile Spec
                    </Button>

                    {aiOutput && (
                      <div className="mt-4 p-4 bg-slate-950 border border-slate-850 rounded-xl font-mono text-[10px] text-slate-350 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                        {aiOutput}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Timeline tab */}
              {activeWorkspaceTab === 'timeline' && (
                <Card>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-6 border-b border-slate-850 pb-2">Workspace logs</h3>
                  <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    {[
                      { title: 'QA Plan QA-SCHEMA-02 Certified', desc: 'Sprint testing suite passed successfully.', date: 'Jul 18, 2026' },
                      { title: 'Project Workspace Initialized', desc: 'Scope files and budget configurations logged.', date: 'Jul 04, 2026' }
                    ].map((log, idx) => (
                      <div key={idx} className="flex gap-4 items-start relative pl-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[#22C55E] shrink-0 z-10">
                          <IoTimeOutline size={12} />
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-slate-250">{log.title}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">{log.date}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">{log.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deploy Project Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Project Title</label>
            <input
              type="text"
              required
              placeholder="Next.js Performance Compiler Hooks"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the project goals and details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Budget ({settings.currency})</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Client Name</label>
              <input
                type="text"
                required
                placeholder="Vercel Inc."
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="text-xs bg-white text-[#111827] border border-[#22C55E]">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
