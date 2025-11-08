import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type, GenerateContentResponse, Chat as GeminiChat } from '@google/genai';
import { useData } from './useSupabaseData';
import { Chat, ProjectType, TaskStatus, User } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const initialSystemMessage: Chat = {
  sender: 'model',
  message: `Hello! I'm the AI Assistant for ConstructTrack Pro. I can help you manage projects, tasks, time tracking, and more.
<br/><br/>
🏗️ **ConstructTrack Pro - Production Ready Construction Management System**
<br/><br/>
### **Current System Architecture**
---
This application is built with React and TypeScript, using **Supabase** as the backend database and authentication system. All data is now stored in a production PostgreSQL database with proper:
<br/><br/>
✅ **Multi-tenant business isolation** - Each business only sees their own data<br/>
✅ **Real-time data persistence** - All changes save immediately to Supabase<br/>
✅ **Secure authentication** - User login/signup with Supabase Auth<br/>
✅ **Role-based access control** - Admin, Manager, Worker, Viewer roles<br/>
✅ **Complete CRUD operations** - Full create, read, update, delete functionality<br/>
<br/><br/>
### **Available Features I Can Help With:**
---
🏗️ **Project Management**: Create projects, track budgets, manage timelines<br/>
📋 **Task Management**: Assign tasks, update status, track progress<br/>
⏰ **Time Tracking**: Clock in/out, switch jobs, manual time entry<br/>
👥 **Team Management**: Add team members, manage roles and rates<br/>
📸 **Photo Documentation**: Project photos and punch list annotations<br/>
📊 **Reporting**: Time reports, project summaries, cost tracking<br/>
💰 **Invoicing**: Generate invoices from time logs and project data<br/>
📦 **Inventory**: Track materials and supplies<br/>
<br/><br/>
### **Data Security & Integrity**
---
All data is securely stored in Supabase with Row Level Security (RLS) policies ensuring businesses can only access their own information. Financial calculations are performed server-side for accuracy and security.

I am ready to assist with any construction management tasks. Just ask!
`
};

const functionDeclarations: FunctionDeclaration[] = [
    // Project Management
    {
        name: 'addProject',
        description: 'Creates a new construction project. Use this when a user wants to start a new project.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: 'The official name of the project.' },
                address: { type: Type.STRING, description: 'The physical address of the project site.' },
                type: { type: Type.STRING, enum: Object.values(ProjectType), description: 'The category of the construction project.' },
                status: { type: Type.STRING, enum: ['In Progress', 'On Hold'], description: 'The initial status of the project.' },
                startDate: { type: Type.STRING, description: 'The project start date in YYYY-MM-DD format.' },
                endDate: { type: Type.STRING, description: 'The project end date in YYYY-MM-DD format.' },
                budget: { type: Type.NUMBER, description: 'The total budget allocated for the project.' },
            },
            required: ['name', 'address', 'type', 'status', 'startDate', 'endDate', 'budget']
        }
    },
    // Task Management
    {
        name: 'addTask',
        description: 'Adds a new task to a specific project and assigns it to a team member.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: 'A brief, clear title for the task.' },
                description: { type: Type.STRING, description: 'A detailed description of what the task involves.' },
                projectName: { type: Type.STRING, description: 'The name of the project this task belongs to.' },
                assigneeName: { type: Type.STRING, description: 'The name of the team member assigned to this task.' },
                dueDate: { type: Type.STRING, description: 'The due date for the task in YYYY-MM-DD format.' },
            },
            required: ['title', 'projectName', 'assigneeName', 'dueDate']
        }
    },
    {
        name: 'updateTaskStatus',
        description: "Updates the status of an existing task (e.g., 'To Do', 'In Progress', 'Done').",
        parameters: {
            type: Type.OBJECT,
            properties: {
                taskTitle: { type: Type.STRING, description: 'The title of the task to update.' },
                newStatus: { type: Type.STRING, enum: Object.values(TaskStatus), description: 'The new status for the task.' },
            },
            required: ['taskTitle', 'newStatus']
        }
    },
    // Time Tracking
    {
        name: 'toggleClockInOut',
        description: 'Clocks the current user in or out of a project. If clocking in, the project name is required.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                projectName: { type: Type.STRING, description: 'The name of the project to clock in to. Not needed for clocking out.' },
            },
            required: []
        }
    },
    {
        name: 'switchJob',
        description: 'Clocks the user out of their current job and immediately into a new one.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                newProjectName: { type: Type.STRING, description: 'The name of the new project to switch to.' },
            },
            required: ['newProjectName']
        }
    },
    // Team Management
    {
        name: 'addUser',
        description: 'Adds a new team member to the system.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: 'The full name of the new team member.' },
                role: { type: Type.STRING, description: 'The job title or role of the team member.' },
                hourlyRate: { type: Type.NUMBER, description: 'The hourly pay rate for the team member.' },
            },
            required: ['name', 'role', 'hourlyRate']
        }
    },
    // Punch List
    {
        name: 'addPunchListItem',
        description: 'Adds a new item to a project\'s punch list.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                projectName: { type: Type.STRING, description: 'The name of the project to add the item to.' },
                text: { type: Type.STRING, description: 'The description of the punch list item.' },
            },
            required: ['projectName', 'text']
        }
    },
    {
        name: 'togglePunchListItemCompletion',
        description: 'Toggles the completion status of a punch list item.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                projectName: { type: Type.STRING, description: 'The name of the project containing the item.' },
                itemText: { type: Type.STRING, description: 'The text of the punch list item to toggle.' },
            },
            required: ['projectName', 'itemText']
        }
    },
    // Data Retrieval
    {
        name: 'listData',
        description: 'Retrieves a list of all projects, tasks, or users.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                dataType: { type: Type.STRING, enum: ['projects', 'tasks', 'users'], description: "The type of data to list." }
            },
            required: ['dataType']
        }
    }
];

export const useGemini = () => {
    const [history, setHistory] = useState<Chat[]>([initialSystemMessage]);
    const [isLoading, setIsLoading] = useState(false);
    const dataContext = useData();
    const chatSessionRef = useRef<GeminiChat | null>(null);

    // Initialize chat session once
    useEffect(() => {
        chatSessionRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { tools: [{ functionDeclarations }] }
        });
    }, []);

    const findProjectByName = (name: string) => dataContext.projects.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
    const findUserByName = (name: string) => dataContext.users.find(u => u.name.toLowerCase().includes(name.toLowerCase()));
    const findTaskByTitle = (title: string) => dataContext.tasks.find(t => t.title.toLowerCase().includes(title.toLowerCase()));

    const functions = {
        addProject: ({ name, address, type, status, startDate, endDate, budget }: any) => {
            dataContext.addProject({ name, address, type, status, startDate: new Date(startDate), endDate: new Date(endDate), budget });
            return { success: true, message: `Project "${name}" has been created.` };
        },
        addTask: ({ title, description, projectName, assigneeName, dueDate }: any) => {
            const project = findProjectByName(projectName);
            const assignee = findUserByName(assigneeName);
            if (!project) return { success: false, message: `Project "${projectName}" not found.` };
            if (!assignee) return { success: false, message: `User "${assigneeName}" not found.` };
            dataContext.addTask({ title, description: description || '', projectId: project.id, assigneeId: assignee.id, dueDate: new Date(dueDate) });
            return { success: true, message: `Task "${title}" has been added to ${projectName} and assigned to ${assignee.name}.` };
        },
        updateTaskStatus: ({ taskTitle, newStatus }: any) => {
            const task = findTaskByTitle(taskTitle);
            if (!task) return { success: false, message: `Task "${taskTitle}" not found.` };
            dataContext.updateTaskStatus(task.id, newStatus);
            return { success: true, message: `Task "${taskTitle}" status updated to ${newStatus}.` };
        },
        toggleClockInOut: ({ projectName }: { projectName?: string }) => {
            const { currentUser, toggleClockInOut } = dataContext;
            if (currentUser?.isClockedIn) {
                toggleClockInOut();
                return { success: true, message: `You have been clocked out.` };
            } else {
                if (!projectName) return { success: false, message: 'You must specify a project to clock in.' };
                const project = findProjectByName(projectName);
                if (!project) return { success: false, message: `Project "${projectName}" not found.` };
                toggleClockInOut(project.id);
                return { success: true, message: `You are now clocked in to ${projectName}.` };
            }
        },
        switchJob: ({ newProjectName }: { newProjectName: string }) => {
            const project = findProjectByName(newProjectName);
            if (!project) return { success: false, message: `Project "${newProjectName}" not found.` };
            if (!dataContext.currentUser?.isClockedIn) return { success: false, message: "You must be clocked in to switch jobs." };
            dataContext.switchJob(project.id);
            return { success: true, message: `Successfully switched to project "${newProjectName}".` };
        },
        addUser: ({ name, role, hourlyRate }: any) => {
            dataContext.addUser({ name, role, hourlyRate });
            return { success: true, message: `Team member "${name}" has been added.` };
        },
        addPunchListItem: ({ projectName, text }: any) => {
            const project = findProjectByName(projectName);
            if (!project) return { success: false, message: `Project "${projectName}" not found.` };
            dataContext.addPunchListItem(project.id, text);
            return { success: true, message: `Added punch list item to "${projectName}".` };
        },
        togglePunchListItemCompletion: ({ projectName, itemText }: any) => {
            const project = findProjectByName(projectName);
            if (!project) return { success: false, message: `Project "${projectName}" not found.` };
            const item = project.punchList.find(i => i.text.toLowerCase().includes(itemText.toLowerCase()));
            if (!item) return { success: false, message: `Punch list item "${itemText}" not found in ${projectName}.` };
            dataContext.togglePunchListItem(project.id, item.id);
            return { success: true, message: `Punch list item "${itemText}" status has been toggled.` };
        },
        listData: ({ dataType }: { dataType: string }) => {
            let data: any[] = [];
            let fields: string[] = [];
            let title = dataType.charAt(0).toUpperCase() + dataType.slice(1);

            switch (dataType) {
                case 'projects': data = dataContext.projects; fields = ['name', 'status', 'type']; break;
                case 'tasks': data = dataContext.tasks.map(t => ({...t, projectName: findProjectByName(t.projectId.toString())?.name, assigneeName: findUserByName(t.assigneeId.toString())?.name })); fields = ['title', 'status', 'projectName', 'assigneeName']; break;
                case 'users': data = dataContext.users; fields = ['name', 'role', 'isClockedIn']; break;
            }
            if(data.length === 0) return { success: true, message: `There are no ${dataType}.`, data: [] };
            
            const formattedData = data.map(item => "- " + fields.map(field => `${item[field]}`).join(' | ')).join('\\n');
            return { success: true, message: `Here is the list of ${title}:\\n${formattedData}`, data };
        }
    };

    const sendMessage = async (message: string, image?: string) => {
        if (!chatSessionRef.current) return;
        setIsLoading(true);
        const userMessage: Chat = { sender: 'user', message, image };
        setHistory(prev => [...prev, userMessage]);

        const parts: any[] = [];
        let promptText = message;

        if (image) {
            promptText = `Extract the project details from this image and call the addProject function. If any details are missing, make reasonable assumptions or state they are missing. The user's original prompt was: "${message}"`;
            parts.push({
                inlineData: { mimeType: 'image/jpeg', data: image }
            });
        }
        
        const fullPrompt = `(Today's date is 10/20/2025) ${promptText}`;
        parts.unshift({ text: fullPrompt });
        
        try {
            // FIX: The sendMessage method expects an object with a `message` property containing the parts array.
            let response: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: parts });

            while (response.functionCalls && response.functionCalls.length > 0) {
                 const functionResponseParts = response.functionCalls.map((funcCall) => {
                    // @ts-ignore
                    const result = functions[funcCall.name](funcCall.args);
                    return {
                        functionResponse: {
                            name: funcCall.name,
                            response: result,
                        },
                    };
                 });

                // FIX: The sendMessage method expects an object with a `message` property.
                response = await chatSessionRef.current.sendMessage({ message: functionResponseParts });
            }
            
            const modelResponse: Chat = { sender: 'model', message: response.text };
            setHistory(prev => [...prev, modelResponse]);

        } catch (error) {
            console.error(error);
            const errorResponse: Chat = { sender: 'model', message: "Sorry, I encountered an error." };
            setHistory(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    return { history, sendMessage, isLoading };
};
