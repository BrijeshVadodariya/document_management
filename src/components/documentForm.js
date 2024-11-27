import React, { useState } from 'react';
import axios from 'axios';

const DocumentForm = ({ refreshDocuments }) => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/documents', { name, content });
            refreshDocuments();
            setName('');
            setContent('');
        } catch (error) {
            console.error('Error adding document:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Document</h2>
            <input
                type="text"
                placeholder="Document Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder="Document Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <button type="submit">Add Document</button>
        </form>
    );
};

export default DocumentForm;
