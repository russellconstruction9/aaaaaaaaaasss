import React, { useState } from 'react';
import Button from './Button';
import { PlusIcon } from './icons/Icons';
import AddProjectModal from './AddProjectModal';
import EmptyState from './EmptyState';
import ProjectListItem from './ProjectListItem';
import { useProjects } from '../hooks/useProjects';

const Projects: React.FC = () => {
    const { projects, isLoading } = useProjects();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Projects</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                    New Project
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
            ) : projects.length > 0 ? (
                <div className="space-y-4">
                    {projects.map(project => (
                        <ProjectListItem 
                            key={project.id} 
                            project={{
                                id: Number(project.id),
                                businessId: Number(project.business_id),
                                name: project.name,
                                address: project.address,
                                type: 'NewConstruction' as any,
                                status: project.status as any,
                                startDate: project.start_date ? new Date(project.start_date) : new Date(),
                                endDate: project.end_date ? new Date(project.end_date) : new Date(),
                                budget: project.budget || 0,
                                createdAt: new Date(project.created_at),
                                updatedAt: new Date(project.updated_at),
                            } as any}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No Projects Yet"
                    message="Get started by creating your first project."
                    buttonText="New Project"
                    onButtonClick={() => setIsModalOpen(true)}
                />
            )}

            <AddProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Projects;
