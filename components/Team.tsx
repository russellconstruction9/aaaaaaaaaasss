import React, { useState } from 'react';
import Card from './Card';
import { useTeamMembers } from '../hooks/useTeamMembers';
import Button from './Button';
import { PlusIcon, Trash2Icon } from './icons/Icons';
import AddTeamMemberModal from './AddTeamMemberModal';
import EmptyState from './EmptyState';
import { useNotification } from '../hooks/useNotification';

const Team: React.FC = () => {
    const { teamMembers, isLoading, deleteTeamMember } = useTeamMembers();
    const { error: showError, success } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
      if (window.confirm('Are you sure you want to delete this team member?')) {
        setDeletingId(id);
        try {
          await deleteTeamMember(id);
          success('Deleted', 'Team member removed successfully.');
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to delete team member';
          showError('Error', message);
        } finally {
          setDeletingId(null);
        }
      }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Team Members</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                    New Member
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
            ) : teamMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {teamMembers.map(member => (
                        <Card key={member.id} className="text-center relative">
                            <button
                              onClick={() => handleDelete(member.id)}
                              disabled={deletingId !== null}
                              className="absolute top-2 right-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                            >
                              {deletingId === member.id ? (
                                <span className="animate-spin h-5 w-5 border-2 border-b-transparent border-red-600 rounded-full inline-block"></span>
                              ) : (
                                <Trash2Icon className="w-5 h-5" />
                              )}
                            </button>
                            <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="mt-4 text-lg font-bold">{member.name}</h2>
                            <p className="text-sm text-gray-500">{member.role}</p>
                            {member.hourly_rate && (
                              <p className="text-sm font-semibold text-gray-700 mt-1">${member.hourly_rate.toFixed(2)}/hr</p>
                            )}
                            {member.email && (
                              <p className="text-xs text-gray-500 mt-2">{member.email}</p>
                            )}
                            {member.phone && (
                              <p className="text-xs text-gray-500">{member.phone}</p>
                            )}
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState 
                    title="No Team Members Yet"
                    message="Get started by adding your first team member."
                    buttonText="New Member"
                    onButtonClick={() => setIsModalOpen(true)}
                />
            )}
            <AddTeamMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Team;
