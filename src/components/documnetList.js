import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState('name'); 
  const [size, setSize] = useState(null);
  const [isContentModalOpen, setisContentModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState('');

  useEffect(() => {
    fetchDocuments();
}, [searchTerm, sortOption]);

  // Function to handle card click
  const handleCardClick = (content) => {
    setCurrentContent(content); // Set the file content to display
    console.log(content);
    setisContentModalOpen(true);       // Open the modal
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setName(selectedFile.name); // Set the file name as the document name
      setSize(formatFileSize(selectedFile.size)); // Format and set the file size
  
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target.result); // Set the file content (plain text)
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("There was an error reading the file.");
      };
      reader.readAsText(selectedFile); // Read the file content as plain text
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/documents', { name, content, size });
            setName('');
            setContent('');
            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error adding document:', error);
        }
    };


     // Function to close the modal
  const closeContentModal = () => {
    setisContentModalOpen(false);
    setCurrentContent('');
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const formatFileSize = (sizeInBytes) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = sizeInBytes;
    let unitIndex = 0;
  
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
  
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };


    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/documents?search=${searchTerm}`);
            setDocuments(response.data.documents);
            console.log("hello",response.data);
        } catch (error) {
            setError('Error fetching documents');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/documents/${id}`);
            fetchDocuments();  // Refresh list after deletion
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    return (
        <div className="container">
            <h1>Document List</h1>
                <button onClick={openModal} className="add-doc-button">Add New Document</button>
            <div className='search_input_filter'>
            <input
                type="text"
                placeholder="Search documents"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <div className="filter-dropdown">
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="sort-select"
                >
                    <option value="name">Sort by Name</option>
                    <option value="date">Sort by Date</option>
                </select>
                <i className="fa fa-sort" aria-hidden="true"></i>
            </div>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <div className="card-container">
                {documents
                    .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase())) // Search functionality
                    .sort((a, b) => {
                      if (sortOption === 'name') {
                        return a.name.localeCompare(b.name);
                      } else if (sortOption === 'date') {
                        return new Date(b.created_at) - new Date(a.created_at);
                      }
                      return 0;
                    })
                .map(doc => (
                    <div className="card">
                    <div>
                      <h2 className="card-title">{doc.name}</h2>
                      <p className="card-date">{new Date(doc.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="card_date_delete_button">
                      <p className="card-date">{doc.size}</p>
                      <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}>Delete</button>
                      <button className="View-button" key={doc.id} onClick={() => handleCardClick(doc.content)}>View</button>
                    </div>
                  </div>
                ))}
                {isContentModalOpen && (
                <div className="modal-overlay" onClick={closeContentModal}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <span className="close-modal-btn" onClick={closeContentModal}>&times;</span>
                    {/* For content display with scrolling */}
                    <div className="modal-content-wrapper">
                      <pre>{currentContent}</pre>
                    </div>
                  </div>
                </div>
              )}

            </div>
            {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button onClick={closeModal} className="close-modal-btn" >×</button>
                <form onSubmit={handleSubmit} className="document-form">
                  <h2>Upload Document</h2>
                  <input
                    type="file"
                    accept=".txt" // Specify accepted file types
                    onChange={handleFileChange}
                    required
                  />
                  <button type="submit" className="submit-btn">Upload Document</button>
                </form>
              </div>
            </div>
      )}
        </div>
    );
};

export default DocumentList;
