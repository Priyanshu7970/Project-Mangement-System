"use client"
import React, { useState, useCallback, useEffect } from 'react';

// --- Sample Data for Demonstration ---
const initialUsers = [
    { id: 1, name: 'Alice Smith', email: 'alice@corp.com', role: 'Editor' },
    { id: 2, name: 'Bob Johnson', email: 'bob@corp.com', role: 'Viewer' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@corp.com', role: 'Admin' },
];

const initialProjects = [
    { id: 101, title: 'Q4 Marketing Campaign', status: 'In Progress', lead: 'Alice Smith' },
    { id: 102, title: 'Website Redesign', status: 'Completed', lead: 'Bob Johnson' },
    { id: 103, title: 'Mobile App V2', status: 'On Hold', lead: 'Charlie Brown' },
];

// Helper to style the status dynamically
const getStatusClasses = (status) => {
    switch (status) {
        case 'Completed':
            return 'bg-green-100 text-green-800';
        case 'In Progress':
            return 'bg-blue-100 text-blue-800';
        case 'On Hold':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// --- Custom Notification Component (Replaces alert()) ---
const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    const baseClasses = 'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white transition-opacity duration-300';
    const colorClasses = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = type === 'success' ? '✔' : '❌';

    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div className={`${baseClasses} ${colorClasses} flex items-center space-x-3`}>
            <span className="text-xl">{icon}</span>
            <p className="font-medium">{message}</p>
            <button onClick={onClose} className="ml-4 text-white opacity-70 hover:opacity-100 text-lg">
                &times;
            </button>
        </div>
    );
};


// --- User Edit Modal Component ---
const UserEditModal = ({ user, onSave, onCancel }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...user, name, email, role });
    };

    return (
        <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
                            Edit User: {user.name}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="userName">Name</label>
                                <input
                                    id="userName"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="userEmail">Email</label>
                                <input
                                    id="userEmail"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="userRole">Role</label>
                                <select
                                    id="userRole"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                                >
                                    <option>Viewer</option>
                                    <option>Editor</option>
                                    <option>Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-xl border-t">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 shadow-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Project Edit Modal Component ---
const ProjectEditModal = ({ project, onSave, onCancel, users }) => {
    const [title, setTitle] = useState(project.title);
    const [status, setStatus] = useState(project.status);
    const [lead, setLead] = useState(project.lead);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...project, title, status, lead });
    };

    const projectStatuses = ['In Progress', 'Completed', 'On Hold', 'Planned'];
    const userNames = users.map(u => u.name);

    return (
        <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
                            Edit Project: {project.title}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="projectTitle">Title</label>
                                <input
                                    id="projectTitle"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="projectStatus">Status</label>
                                <select
                                    id="projectStatus"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                >
                                    {projectStatuses.map(s => (
                                        <option key={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="projectLead">Project Lead</label>
                                <select
                                    id="projectLead"
                                    value={lead}
                                    onChange={(e) => setLead(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                >
                                    {userNames.map(u => (
                                        <option key={u}>{u}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-xl border-t">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 shadow-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---
export default function AdminDashboard() {
    const [users, setUsers] = useState(initialUsers);
    const [projects, setProjects] = useState(initialProjects);
    const [editingUser, setEditingUser] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [notification, setNotification] = useState(null); // { message: string, type: 'success' | 'error' }

    // --- Calculate Key Metrics (NEW) ---
    const totalUsers = users.length;
    const totalProjects = projects.length;
    // Calculate simple average projects per user, rounding to 1 decimal place
    const projectsPerUser = totalUsers > 0 ? (totalProjects / totalUsers).toFixed(1) : 0;
    
    // --- User Handlers ---
    const handleEditUser = useCallback((user) => {
        setEditingUser(user);
    }, []);

    const handleCancelUserEdit = useCallback(() => {
        setEditingUser(null);
    }, []);

    const handleSaveUser = useCallback((updatedUser) => {
        setUsers(prevUsers =>
            prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u))
        );
        setEditingUser(null);
        setNotification({
            message: `User '${updatedUser.name}' updated successfully!`,
            type: 'success',
        });
    }, []);

    const handleDelete = useCallback((id, name) => {
        // NOTE: window.confirm is used here, which should be replaced by a custom modal in a real app
        if (window.confirm(`Are you sure you want to delete user ${name}?`)) { 
            setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
            setNotification({
                message: `User '${name}' deleted. (Mock Action)`,
                type: 'success',
            });
        }
    }, []);

    // --- Project Handlers ---
    const handleEditProject = useCallback((project) => {
        setEditingProject(project);
    }, []);

    const handleCancelProjectEdit = useCallback(() => {
        setEditingProject(null);
    }, []);

    const handleSaveProject = useCallback((updatedProject) => {
        setProjects(prevProjects =>
            prevProjects.map(p => (p.id === updatedProject.id ? updatedProject : p))
        );
        setEditingProject(null);
        setNotification({
            message: `Project '${updatedProject.title}' updated successfully!`,
            type: 'success',
        });
    }, []);
    
    // Custom close message handler for the Notification component
    const handleCloseNotification = useCallback(() => {
        setNotification(null);
    }, []);


    return (
        <div className="min-h-screen bg-gray-50 font-[Inter]">
            
            {/* --- Custom Notification Display --- */}
            <Notification
                message={notification?.message}
                type={notification?.type}
                onClose={handleCloseNotification}
            />

            {/* --- Modals (conditionally rendered) --- */}
            {editingUser && (
                <UserEditModal
                    user={editingUser}
                    onSave={handleSaveUser}
                    onCancel={handleCancelUserEdit}
                />
            )}
            
            {editingProject && (
                <ProjectEditModal
                    project={editingProject}
                    onSave={handleSaveProject}
                    onCancel={handleCancelProjectEdit}
                    users={users} // Pass users for project lead selection
                />
            )}
            
            {/* --- Header/Nav Bar --- */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        🚀 Admin Control Panel
                    </h1>
                    {/* Replaced Next Link with a standard anchor for single-file preview */}
                    <a 
                        href="#" 
                        className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
                    >
                        Logout
                    </a>
                </div>
            </header>
            
            {/* --- Main Content --- */}
            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">

                {/* --- DASHBOARD STATS SECTION (NEW) --- */}
                <div className="mb-10">
                    <h2 className="text-2xl font-extrabold text-gray-800 mb-5">Admin Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Total Users Card */}
                        <div className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-indigo-500 transition duration-300 hover:shadow-2xl">
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <p className="text-4xl font-extrabold text-gray-900 mt-1">{totalUsers}</p>
                        </div>
                        {/* Total Projects Card */}
                        <div className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-blue-500 transition duration-300 hover:shadow-2xl">
                            <p className="text-sm font-medium text-gray-500">Total Projects</p>
                            <p className="text-4xl font-extrabold text-gray-900 mt-1">{totalProjects}</p>
                        </div>
                        {/* Projects per User Card */}
                        <div className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-green-500 transition duration-300 hover:shadow-2xl">
                            <p className="text-sm font-medium text-gray-500">Avg. Projects per User</p>
                            <p className="text-4xl font-extrabold text-gray-900 mt-1">{projectsPerUser}</p>
                        </div>
                    </div>
                </div>
                {/* --- END DASHBOARD STATS SECTION --- */}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* --- USERS MANAGEMENT SECTION --- */}
                    <div className="bg-white overflow-hidden shadow-2xl rounded-xl">
                        <div className="px-4 py-6 sm:p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                                👤 User Management ({users.length})
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                                <td className="px-6 py-4  whitespace-nowrap text-right text-sm font-medium">
                                                    <button 
                                                        className="text-indigo-600 cursor-pointer hover:text-indigo-800 transition duration-150 font-medium mr-4" 
                                                        onClick={() => handleEditUser(user)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(user.id, user.name)} 
                                                        className="text-red-600 cursor-pointer hover:text-red-800 transition duration-150 font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    {/* --- PROJECTS MANAGEMENT SECTION --- */}
                    <div className="bg-white overflow-hidden shadow-2xl rounded-xl">
                        <div className="px-4 py-6 sm:p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                                📈 Project Management ({projects.length})
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {projects.map((project) => (
                                            <tr key={project.id} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusClasses(project.status)}`}>
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button 
                                                        className="text-blue-600 hover:text-blue-800 transition duration-150 font-medium mr-4"
                                                        // Using the same edit handler structure for projects
                                                        onClick={() => handleEditProject(project)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="text-red-600 hover:text-red-800 transition duration-150 font-medium"
                                                        onClick={() => setNotification({ message: 'Project deletion is not yet implemented.', type: 'error' })}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </main>
        </div>
    );
}
