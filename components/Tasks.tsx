import React, { useState } from 'react';
import Card from './Card';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { TaskStatus } from '../types';
import Button from './Button';
import { PlusIcon, ChevronLeftIcon } from './icons/Icons';
import { format } from 'date-fns';
import AddTaskModal from './AddTaskModal';
import EmptyState from './EmptyState';
import { useParams, useNavigate } from 'react-router-dom';


const TaskCard: React.FC<{ task: any }> = React.memo(({ task }) => {
    const { updateTask } = useTasks();

    const handleStatusChange = async (status: string) => {
      try {
        await updateTask(task.id, { status });
      } catch (err) {
        console.error('Failed to update task status:', err);
      }
    };

    return (
        <Card>
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold">{task.title}</h3>
            </div>
            <p className="text-sm text-gray-700 mt-2">{task.description || 'No description'}</p>
            <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm font-medium text-gray-500">
                  Due: {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No date'}
                </p>
                <select 
                  value={task.status} 
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-sm font-semibold rounded-md border-slate-300 focus:ring-blue-600 focus:border-blue-600"
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
            </div>
        </Card>
    );
});

const Tasks: React.FC = () => {
    const { tasks, isLoading } = useTasks();
    const { projects } = useProjects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    const project = projectId ? projects.find(p => p.id === projectId) : null;
    
    const filteredTasks = projectId 
        ? tasks.filter(t => t.project_id === projectId)
        : tasks;

    const todoTasks = filteredTasks.filter(t => t.status === 'Pending');
    const inProgressTasks = filteredTasks.filter(t => t.status === 'In Progress');
    const doneTasks = filteredTasks.filter(t => t.status === 'Done');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                 <div>
                    {project && (
                        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-1">
                           <ChevronLeftIcon className="w-5 h-5 mr-2" />
                           Back
                        </button>
                    )}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                         {project ? `Tasks for ${project.name}` : 'All Tasks'}
                    </h1>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                    New Task
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
            ) : filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h2 className="text-xl font-bold text-slate-700">To Do ({todoTasks.length})</h2>
                        {todoTasks.length > 0 ? todoTasks.map(task => <TaskCard key={task.id} task={task} />) : <p className="text-sm text-gray-500">No tasks to do.</p>}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h2 className="text-xl font-bold text-slate-700">In Progress ({inProgressTasks.length})</h2>
                        {inProgressTasks.length > 0 ? inProgressTasks.map(task => <TaskCard key={task.id} task={task} />) : <p className="text-sm text-gray-500">No tasks in progress.</p>}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h2 className="text-xl font-bold text-slate-700">Done ({doneTasks.length})</h2>
                        {doneTasks.length > 0 ? doneTasks.map(task => <TaskCard key={task.id} task={task} />) : <p className="text-sm text-gray-500">No tasks are done.</p>}
                    </div>
                </div>
            ) : (
                <EmptyState
                    title={project ? "No Tasks For This Project" : "No Tasks Yet"}
                    message="Get started by creating your first task."
                    buttonText="New Task"
                    onButtonClick={() => setIsModalOpen(true)}
                />
            )}
            <AddTaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                projectId={projectId}
            />
        </div>
    );
};

export default Tasks;
