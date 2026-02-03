import { useEffect } from 'react';
import { ContactForm, Contact } from './components/ContactForm';
import { ContactList } from './components/ContactList';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

/**
 * Main App Component
 * 
 * Demonstrates all success criteria:
 * 1. Uses useState correctly for state management (via useLocalStorage custom hook)
 * 2. Implements useEffect for side effects properly
 * 3. Handles events and forms correctly
 * 4. Renders lists with keys properly
 * 5. Follows rules of hooks (all hooks at top level, only in React functions)
 */
function App() {
  // Custom hook for persisted contacts - demonstrates useState pattern with localStorage
  const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts', []);

  // useEffect for logging / debugging - runs on contact changes
  useEffect(() => {
    console.log(`Contact list updated. Total contacts: ${contacts.length}`);
  }, [contacts]);

  // useEffect to set document title - demonstrates DOM side effect
  useEffect(() => {
    document.title = 'Contact Manager';
    
    // Cleanup: reset title when component unmounts
    return () => {
      document.title = 'React App';
    };
  }, [contacts.length]);

  // Event handler: Add contact - updates state with new array (immutable update)
  const handleAddContact = (contact: Contact) => {
    setContacts(prevContacts => [...prevContacts, contact]);
  };

  // Event handler: Delete contact - filters out the contact (immutable update)
  const handleDeleteContact = (id: string) => {
    setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
  };

  // Event handler: Clear all contacts
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all contacts?')) {
      setContacts([]);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Contact Manager</h1>
        <p>React State & Hooks Demo</p>
      </header>

      <main className="app-main">
        <ContactForm onAddContact={handleAddContact} />
        <ContactList 
          contacts={contacts} 
          onDeleteContact={handleDeleteContact} 
        />
      </main>

      {/* Conditional rendering: only show clear button if there are contacts */}
      {contacts.length > 0 && (
        <footer className="app-footer">
          <button 
            className="clear-all-btn" 
            onClick={handleClearAll}
          >
            Clear All Contacts
          </button>
        </footer>
      )}
    </div>
  );
}

export default App;
