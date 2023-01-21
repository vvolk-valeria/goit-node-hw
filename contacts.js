const fs = require('fs/promises');
const path = require("path"); 
const {v4} = require("uuid");

const dirContactsPath = path.join(__dirname, "db");
const contactsPath = path.join(__dirname, "db", "contacts.json");
const contactsPathToModifiedList = path.join(__dirname, "db", "newContacts.json");


async function listContacts(){
    try {
        const files = await fs.readdir(dirContactsPath);
  
        if (files.length === 1) {
            const data = await fs.readFile(contactsPath);
            const contacts = JSON.parse(data);
            return contacts;
        }
    const data = await fs.readFile(contactsPathToModifiedList);
    const contacts = JSON.parse(data);
    return contacts;

    } catch (error) {
        console.log('Error! ', error.message);
    }
}
  
async function getContactById(contactId) {
    try {
        const contacts = await listContacts();
        const result = contacts.find(contact => contact.id === contactId);
        if (!result){
            return null;
        }
        return result;
    } catch (error) {
        console.log('Error! ', error.message);
    } 
}

async function removeContact(contactId) {
    try {
        const contacts = await listContacts();
        const idx = contacts.findIndex(contact => contact.id === contactId);
        if(idx === -1){
            return null;
        };
        const [removeContact] = contacts.splice(idx, 1);
        await fs.writeFile(contactsPathToModifiedList, JSON.stringify(contacts));
        return removeContact; 
    } catch (error) {
        console.log('Error! ', error.message);
    }
}
  
async function addContact(name, email, phone) {
    try {
        
        const contacts = await listContacts();
        const newContact = {name, email, phone, id:v4()};
        contacts.push(newContact);
        await fs.writeFile(contactsPathToModifiedList, JSON.stringify(contacts));
        return newContact;
    } catch (error) {
        console.log('Error! ', error.message);
    }
}


module.exports =  {
    listContacts, 
    getContactById, 
    removeContact, 
    addContact
};
