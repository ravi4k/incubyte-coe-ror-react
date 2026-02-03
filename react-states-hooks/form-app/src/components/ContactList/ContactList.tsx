import { useState, useEffect } from 'react';
import { Contact } from '../ContactForm';
import './ContactList.css';

interface ContactListProps {
  contacts: Contact[];
  onDeleteContact: (id: string) => void;
}

export function ContactList({ contacts, onDeleteContact }: ContactListProps) {
  // useState for search/filter functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);

  // useEffect to filter contacts when search term or contacts change
  // Demonstrates dependency array with multiple dependencies
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(lowerSearch) ||
      contact.email.toLowerCase().includes(lowerSearch) ||
      contact.phone.includes(searchTerm)
    );

    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  // Event handler for search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Event handler for delete button click
  const handleDelete = (id: string) => {
    onDeleteContact(id);
  };

  return (
    <div className="contact-list">
      <h2>Contacts ({contacts.length})</h2>

      {/* Search input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Conditional rendering based on contacts length */}
      {contacts.length === 0 ? (
        <div className="empty-state">
          <p>No contacts yet. Add your first contact!</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="empty-state">
          <p>No contacts match your search.</p>
        </div>
      ) : (
        // Rendering list with proper keys (using unique id, not index)
        <ul className="contacts">
          {filteredContacts.map(contact => (
            <li key={contact.id} className="contact-item">
              <div className="contact-info">
                <span className="contact-name">{contact.name}</span>
                <span className="contact-email">{contact.email}</span>
                <span className="contact-phone">{contact.phone}</span>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(contact.id)}
                aria-label={`Delete ${contact.name}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Show filtered count when searching */}
      {searchTerm && filteredContacts.length > 0 && (
        <p className="filter-info">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </p>
      )}
    </div>
  );
}
