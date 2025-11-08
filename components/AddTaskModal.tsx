import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useNotification } from '../hooks/useNotification';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, projectId: defaultProjectId }) => {
    const { createTask } = useTasks();
    const { projects } = useProjects();
    const { success, error: showError } = useNotification();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState<string>('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProjectId(defaultProjectId || '');
    }
  }, [isOpen, defaultProjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectId || !dueDate) {
        showError('Validation Error', 'Please fill in title, project, and due date.');
        return;
    }

    setIsSubmitting(true);
    try {
      await createTask({
        title,
        description,
        project_id: projectId,
        status: 'Pending',
        priority,
        due_date: dueDate,
      } as any);

      success('Task Created', `Task "${title}" has been created.`);
      setTitle('');
      setDescription('');
      setProjectId(defaultProjectId || '');
      setPriority('Medium');
      setDueDate('');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      showError('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">Title *</label>
          <input type="text" id="taskTitle" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300" required />
        </div>
        <div>
          <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="taskDescription" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-slate-300"></textarea>
        </div>
        <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700">Project *</label>
            <select id="project" value={projectId} onChange={e => setProjectId(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300" required disabled={!!defaultProjectId}>
                <option value="" disabled>Select a project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
        </div>
        <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
            <select id="priority" value={priority} onChange={e => setPriority(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>
        </div>
        <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date *</label>
            <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300" required />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Add Task'}
            </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTaskModal;
